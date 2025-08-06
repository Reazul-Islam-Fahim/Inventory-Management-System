from pydantic import BaseModel
from typing import Optional
from models import *


class ProductsSchema(BaseModel):
    name: str
    description: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    price: float
    discount_type: Optional[discount] = None 
    discount_amount: Optional[int] = 0
    is_active: bool = True

    class Config:
        orm_mode = True

    
class InventorySchema(BaseModel):
    unit_price: float
    total_quantity: int
    inventory_type: InventoryType
    notes: Optional[str] = None
    is_active: bool = True
    product_id: int

    class Config:
        orm_mode = True