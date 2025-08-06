from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, Enum as senum, func
from sqlalchemy.orm import relationship
from enum import Enum
from db import Base

class discount(str, Enum):
    Percentage = "percentage"
    Fixed = "fixed"
    
class InventoryType(str, Enum):
    Purchase = "purchase"
    Sale = "sale"

class Product(Base):
    __tablename__ = "product"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    description = Column(String(255), nullable=True)
    meta_title = Column(String(50), nullable=True)
    meta_description = Column(String(255), nullable=True)
    slug = Column(String(50), nullable=False, unique=True)
    price = Column(Integer, nullable=False, default=0)
    payable_price = Column(Integer, nullable=False, default=0)
    discount_type = Column(senum(discount), nullable=False, default=discount.Percentage)
    discount_amount = Column(Integer, nullable=False, default=0)
    total_stock = Column(Integer, nullable=False, default=0)
    available_stock = Column(Integer, nullable=False, default=0)
    quantity_sold = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(String(50), nullable=False, server_default=func.now())
    updated_at = Column(String(50), nullable=False, server_default=func.now(), onupdate=func.now())

    inventory = relationship("Inventory", back_populates="product")
    
    
    
    
class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    unit_price = Column(Integer, nullable=False, default=0)
    total_quantity = Column(Integer, nullable=False, default=0)
    total_price = Column(Integer, nullable=False, default=0)
    inventory_type = Column(senum(InventoryType), nullable=False, default=InventoryType.Purchase)
    notes = Column(String(255), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(String(50), nullable=False, server_default=func.now())
    updated_at = Column(String(50), nullable=False, server_default=func.now(), onupdate=func.now())
    
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)

    product = relationship("Product", back_populates="inventory")