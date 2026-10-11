import os
import json
from openai import OpenAI
from fastapi import HTTPException, status

class OpenAIService:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is not set.")
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1",
        )

    async def analyze_and_generate_redesign(self, base64_image: str) -> dict:
        try:
            vision_response = self.client.chat.completions.create(
                model="qwen/qwen3.8-27b",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert fashion designer and sustainable upcycling specialist. "
                            "Analyze the provided clothing image to identify its type, material, color, and any damage, stains, or wear. "
                            "Provide a creative, practical DIY upcycling plan and a descriptive prompt for image generation. "
                            "Output MUST be a valid JSON object with keys: 'garment_type', 'detected_damage', 'materials_needed' (array of strings), "
                            "'upcycling_steps' (array of strings), and 'redesign_prompt'."
                        )
                    },
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Analyze this garment and provide upcycling details in JSON format."},
                            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                        ]
                    }
                ],
                response_format={"type": "json_object"},
                temperature=0.7
            )

            response_content = vision_response.choices[0].message.content
            analysis_data = json.loads(response_content)
            return analysis_data

        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to parse AI vision response into valid JSON."
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Groq API error: {str(e)}"
            )
