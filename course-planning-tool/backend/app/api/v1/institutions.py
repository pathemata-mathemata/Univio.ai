from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_institutions():
    return {"message": "institutions endpoint"} 