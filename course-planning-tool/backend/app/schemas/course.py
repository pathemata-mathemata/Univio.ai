from pydantic import BaseModel
from typing import List, Optional

# Course creation
class CourseCreate(BaseModel):
    code: str
    title: str
    description: Optional[str] = None
    units: float
    institution: str
    transferable: bool = True
    category: Optional[str] = None
    prerequisites: List[str] = []

# Course update
class CourseUpdate(BaseModel):
    code: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    units: Optional[float] = None
    institution: Optional[str] = None
    transferable: Optional[bool] = None
    category: Optional[str] = None
    prerequisites: Optional[List[str]] = None

# Course response
class CourseResponse(BaseModel):
    id: int
    code: str
    title: str
    description: Optional[str] = None
    units: float
    institution: str
    transferable: bool
    category: Optional[str] = None
    prerequisites: List[str]
    
    class Config:
        from_attributes = True

# Course search/filter parameters
class CourseSearchParams(BaseModel):
    institution: Optional[str] = None
    search: Optional[str] = None
    category: Optional[str] = None
    transferable: Optional[bool] = None
    page: int = 1
    limit: int = 20 