from fastapi import APIRouter, UploadFile, File, HTTPException, status
import base64
from app.models.schemas import RedesignResponse, HealthCheckResponse
from app.services.openai_service import OpenAIService

router = APIRouter(prefix="/api/v1", tags=["ReWear AI"])

@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    return {"status": "healthy", "message": "ReWear AI Backend is running smoothly!"}

@router.post("/analyze-and-redesign", response_model=RedesignResponse)
async def analyze_and_redesign(image: UploadFile = File(...)):
    # Validate file type
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Please upload an image file (JPEG, PNG, etc.)."
        )
    
    try:
        contents = await image.read()
        
        # Optional: Limit file size (e.g., 10MB max)
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds the 10MB limit."
            )

        base64_image = base64.b64encode(contents).decode('utf-8')
        
        openai_service = OpenAIService()
        result = await openai_service.analyze_and_generate_redesign(base64_image)
        
        return result

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )
