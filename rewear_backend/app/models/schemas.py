from pydantic import BaseModel, Field
from typing import List

class RedesignResponse(BaseModel):
    garment_type: str = Field(..., description="Detected type of the garment")
    detected_damage: str = Field(..., description="Description of damage, stains, or wear")
    materials_needed: List[str] = Field(..., description="List of materials required for upcycling")
    upcycling_steps: List[str] = Field(..., description="Step-by-step instructions for upcycling")
    redesign_prompt: str = Field(..., description="Prompt used for image generation")
    preview_image_url: str = Field(..., description="URL of the generated redesign preview")

class HealthCheckResponse(BaseModel):
    status: str
    message: str
