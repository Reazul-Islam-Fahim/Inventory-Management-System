from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from models import *
from schemas import *
from typing import Optional
from sqlalchemy.exc import SQLAlchemyError
import re
from unidecode import unidecode


###########################################################################
#                                Utils
###########################################################################


async def generate_unique_slug(
    db: AsyncSession,
    name: str,
    model,
    slug_field: str = "slug"
):
    slug = unidecode(name.lower())
    slug = re.sub(r'[^a-z0-9]+', '-', slug).strip('-')
    slug = re.sub(r'[-]+', '-', slug)

    counter = 1
    original_slug = slug

    while True:
        column = getattr(model, slug_field)
        result = await db.execute(select(model).where(column == slug))
        if not result.scalar_one_or_none():
            return slug
        slug = f"{original_slug}-{counter}"
        counter += 1



def calc_payable_price(
    price: float,
    discount_type: Optional[str],
    discount_amount: Optional[float] = None
) -> float:
    if discount_type == "percentage" and discount_amount is not None and 0 < discount_amount <= 100:
        return int(price * (1 - discount_amount / 100))
    elif discount_type == "fixed" and discount_amount is not None and 0 < discount_amount <= price:
        return int(price - discount_amount)
    else:
        return int(price)
    
    
###########################################################################
#                                Product
###########################################################################


async def create_product(db: AsyncSession, product_data: ProductsSchema):
    try:
        slug = await generate_unique_slug(db, product_data.name, Product)

        payable_price = calc_payable_price(
            product_data.price,
            product_data.discount_type.value if product_data.discount_type else None,
            product_data.discount_amount
        )

        new_product = Product(
            name=product_data.name,
            description=product_data.description,
            meta_title=product_data.meta_title,
            meta_description=product_data.meta_description,
            slug=slug,
            price=int(product_data.price),
            payable_price=payable_price,
            discount_type=product_data.discount_type,
            discount_amount=product_data.discount_amount or 0,
            is_active=product_data.is_active,
            total_stock=0,
            available_stock=0,
            quantity_sold=0
        )

        db.add(new_product)
        await db.commit()
        await db.refresh(new_product)
        return new_product

    except SQLAlchemyError as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


async def get_product_by_id(db: AsyncSession, product_id: int):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return product


def apply_filters(query, filters):
    for condition in filters:
        query = query.where(condition)
    return query


async def get_all_products(
    db: AsyncSession,
    page: int,
    limit: int,
    is_active: Optional[bool] = None,
    name: Optional[str] = None,
    description: Optional[str] = None,
    meta_title: Optional[str] = None,
    meta_description: Optional[str] = None,
    discount_type: Optional[str] = None,
):
    try:
        filters = []

        if is_active is not None:
            filters.append(Product.is_active == is_active)
        if name:
            filters.append(Product.name.ilike(f"%{name}%"))
        if description:
            filters.append(Product.description.ilike(f"%{description}%"))
        if meta_title:
            filters.append(Product.meta_title.ilike(f"%{meta_title}%"))
        if meta_description:
            filters.append(Product.meta_description.ilike(f"%{meta_description}%"))
        if discount_type:
            filters.append(Product.discount_type == discount_type)

        query = select(Product)
        query = apply_filters(query, filters)

        total_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(total_query)
        total = total_result.scalar_one()

        offset = (page - 1) * limit
        result = await db.execute(query.offset(offset).limit(limit))
        products = result.scalars().all()

        return {
            "data": products,
            "meta": {
                "total": total,
                "page": page,
                "limit": limit,
                "pages": (total + limit - 1) // limit
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving products: {str(e)}")


async def update_product_by_id(
    db: AsyncSession,
    product_id: int,
    product_data: ProductsSchema,
):
    try:
        result = await db.execute(select(Product).where(Product.id == product_id))
        product = result.scalar_one_or_none()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        if product.name != product_data.name:
            product.slug = await generate_unique_slug(db, product_data.name, Product)

        payable_price = calc_payable_price(
            product_data.price,
            product_data.discount_type.value if product_data.discount_type else None,
            product_data.discount_amount
        )

        product.name = product_data.name
        product.description = product_data.description
        product.meta_title = product_data.meta_title
        product.meta_description = product_data.meta_description
        product.price = int(product_data.price)
        product.payable_price = payable_price
        product.discount_type = product_data.discount_type
        product.discount_amount = product_data.discount_amount or 0
        product.is_active = product_data.is_active

        await db.commit()
        await db.refresh(product)
        return product

    except SQLAlchemyError as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")



###########################################################################
#                                Inventory
###########################################################################


async def create_inventory(db: AsyncSession, data: InventorySchema):
    try:
        # 1. Validate Product
        product_query = await db.execute(select(Product).where(Product.id == data.product_id))
        product = product_query.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        quantity = data.total_quantity
        inv_type = data.inventory_type

        # 2. Create Inventory Record
        new_inventory = Inventory(
            unit_price=int(data.unit_price),
            total_quantity=quantity,
            total_price=int(data.unit_price * quantity),
            inventory_type=inv_type,
            notes=data.notes,
            is_active=data.is_active,
            quantity=quantity,
            product_id=data.product_id,
        )

        db.add(new_inventory)

        # 3. Update Product Stock Based on Inventory Type
        if inv_type in [InventoryType.Purchase]:
            product.total_stock += quantity
            product.available_stock += quantity
        elif inv_type in [InventoryType.Sale]:
            if product.available_stock < quantity:
                raise HTTPException(status_code=400, detail="Insufficient available stock")
            product.available_stock -= quantity
            product.quantity_sold += quantity
        else:
            raise HTTPException(status_code=400, detail="Invalid inventory type")

        await db.commit()
        await db.refresh(new_inventory)
        return new_inventory

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


async def get_all_inventories(
    db: AsyncSession,
    page: int = 1,
    limit: int = 20,
    product_id: Optional[int] = None,
):
    try:
        offset = (page - 1) * limit

        query = select(Inventory)

        if product_id:
            query = query.where(Inventory.product_id == product_id)

        total_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(total_query)
        total = total_result.scalar_one()

        result = await db.execute(query.offset(offset).limit(limit))
        inventories = result.scalars().all()

        return {
            "data": inventories,
            "meta": {
                "total": total,
                "page": page,
                "limit": limit,
                "pages": (total + limit - 1) // limit
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve inventories: {str(e)}")


async def get_inventory_by_id(db: AsyncSession, inventory_id: int):
    result = await db.execute(
        select(Inventory).where(Inventory.id == inventory_id)
    )
    inventory = result.scalar_one_or_none()
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return inventory


async def update_inventory(db: AsyncSession, inventory_id: int, data: InventorySchema):
    inventory = await get_inventory_by_id(db, inventory_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory not found")

    product_query = await db.execute(select(Product).where(Product.id == data.product_id))
    product = product_query.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    quantity = data.total_quantity
    inv_type = data.inventory_type

    # Update Inventory
    inventory.unit_price = int(data.unit_price)
    inventory.total_quantity = quantity
    inventory.total_price = int(data.unit_price * quantity)
    inventory.inventory_type = inv_type
    inventory.notes = data.notes
    inventory.quantity = quantity
    inventory.product_id = data.product_id

    # Note: We are not "undoing" the previous inventory effect; that's complex and requires audit trail.
    if inv_type == InventoryType.Purchase:
        product.total_stock += quantity
        product.available_stock += quantity
    elif inv_type == InventoryType.Sale:
        if product.available_stock < quantity:
            raise HTTPException(status_code=400, detail="Insufficient available stock")
        product.available_stock -= quantity
        product.quantity_sold += quantity
    else:
        raise HTTPException(status_code=400, detail="Invalid inventory type")

    await db.commit()
    await db.refresh(inventory)
    return inventory


async def delete_inventory(db: AsyncSession, inventory_id: int):
    inventory = await get_inventory_by_id(db, inventory_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory not found")
    await db.delete(inventory)
    await db.commit()
    return {"message": "Inventory deleted successfully"}
