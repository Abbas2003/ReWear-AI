import os
import json
from openai import OpenAI
from fastapi import HTTPException, status

class OpenAIService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set.")
        self.client = OpenAI(api_key=api_key)

    async def analyze_and_generate_redesign(self, base64_image: str) -> dict:
        try:
            # Step 1: Vision analysis & structured JSON output from GPT-4o
            vision_response = self.client.chat.completions.create(
                model="gpt-4o",
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

            # Step 2: Generate visual preview using DALL-E 3
            redesign_prompt = analysis_data.get("redesign_prompt", "A stylish upcycled sustainable fashion garment, professional photography")
            image_response = self.client.images.generate(
                model="dall-e-3",
                prompt=f"A professional studio product photo of {redesign_prompt}, modern fashion design, clean neutral background, high detail.",
                n=1,
                size="1024x1024",
            )

            preview_url = image_response.data[0].url
            analysis_data["preview_image_url"] = preview_url

            return analysis_data

        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to parse AI vision response into valid JSON."
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"OpenAI API error: {str(e)}"
            )
