from fastapi import APIRouter, Depends, Query, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from crud import *
from schemas import *
from db import get_db
from models import *

router = APIRouter()

###########################################################################
#                                Product
###########################################################################

@router.get("/product")
async def list_products(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(30, ge=1),
    is_active: Optional[bool] = Query(None),
    name: Optional[str] = Query(None),
    description: Optional[str] = Query(None),
    meta_title: Optional[str] = Query(None),
    meta_description: Optional[str] = Query(None),
    discount_type: Optional[discount] = Query(None),
):
    return await get_all_products(
        db=db,
        page=page,
        limit=limit,
        is_active=is_active,
        name=name,
        description=description,
        meta_title=meta_title,
        meta_description=meta_description,
        discount_type=discount_type,
    )


@router.get("/product/{product_id}")
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    return await get_product_by_id(db, product_id)

@router.post("/product")
async def create_product_endpoint(
    product_data: ProductsSchema,
    db: AsyncSession = Depends(get_db),
):
    return await create_product(db, product_data)


@router.put("/product/{product_id}")
async def update_product_endpoint(
    product_id: int,
    product_data: ProductsSchema,
    db: AsyncSession = Depends(get_db),
):
    return await update_product_by_id(db, product_id, product_data)





###########################################################################
#                                Inventory
###########################################################################


@router.post("/inventory")
async def create(data: InventorySchema, db: AsyncSession = Depends(get_db)):
    return await create_inventory(db, data)

@router.get("/inventory")
async def read_all(
    db: AsyncSession = Depends(get_db),
    page: int = 1,
    limit: int = 20,
    product_id: Optional[int] = Query(None),
):
    return await get_all_inventories(db, page, limit, product_id)

@router.get("/inventory/{inventory_id}")
async def read_one(inventory_id: int, db: AsyncSession = Depends(get_db)):
    return await get_inventory_by_id(db, inventory_id)

@router.put("/inventory/{inventory_id}")
async def update(inventory_id: int, data: InventorySchema, db: AsyncSession = Depends(get_db)):
    return await update_inventory(db, inventory_id, data)

@router.delete("/inventory/{inventory_id}")
async def delete(inventory_id: int, db: AsyncSession = Depends(get_db)):
    return await delete_inventory(db, inventory_id)
