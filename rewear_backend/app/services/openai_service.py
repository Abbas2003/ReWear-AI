import asyncio
import base64
import json
import os
from io import BytesIO

from fastapi import HTTPException, status
from openai import OpenAI
from PIL import Image

_local_pipeline = None


class OpenAIService:
    def __init__(self):
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable is not set.")
        self.local_model = os.getenv(
            "HF_IMAGE_MODEL",
            "stable-diffusion-v1-5/stable-diffusion-v1-5",
        )
        self.client = OpenAI(
            api_key=groq_api_key,
            base_url="https://api.groq.com/openai/v1",
        )

    def _generate_local_preview(self, prompt: str, base64_image: str) -> str:
        global _local_pipeline
        try:
            import torch
            from diffusers import StableDiffusionImg2ImgPipeline

            if _local_pipeline is None:
                _local_pipeline = StableDiffusionImg2ImgPipeline.from_pretrained(
                    self.local_model,
                    torch_dtype=torch.float32,
                    token=os.getenv("HF_TOKEN"),
                ).to("cpu")
                _local_pipeline.enable_attention_slicing()

            source_image = Image.open(
                BytesIO(base64.b64decode(base64_image))
            ).convert("RGB")
            source_image.thumbnail((512, 512))
            source_image = source_image.resize((512, 512))
            result = _local_pipeline(
                prompt=(
                    "Professional studio product photo, realistic sustainable fashion "
                    f"redesign: {prompt}"
                ),
                image=source_image,
                strength=0.75,
                guidance_scale=7.5,
                num_inference_steps=20,
            ).images[0]

            output = BytesIO()
            result.save(output, format="PNG")
            encoded_image = base64.b64encode(output.getvalue()).decode("ascii")
            return f"data:image/png;base64,{encoded_image}"
        except ImportError as error:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=(
                    "Local image generation dependencies are missing. "
                    "Install requirements.txt before generating previews."
                ),
            ) from error
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Local Hugging Face image generation failed: {error}",
            ) from error

    async def _generate_preview(self, prompt: str, base64_image: str) -> str:
        return await asyncio.to_thread(
            self._generate_local_preview,
            prompt,
            base64_image,
        )

    def _load_prebuilt_preview(self) -> str:
        image_path = os.getenv(
            "PREBUILT_IMAGE_PATH",
            os.path.join(os.path.dirname(__file__), "..", "..", "pre-built.png"),
        )
        image_path = os.path.abspath(image_path)
        if not os.path.isfile(image_path):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Pre-built preview image was not found: {image_path}",
            )

        with open(image_path, "rb") as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode("ascii")
        return f"data:image/png;base64,{encoded_image}"

    async def analyze_and_generate_redesign(self, base64_image: str) -> dict:
        try:
            vision_response = self.client.chat.completions.create(
                model="qwen/qwen3.8-27b",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert fashion designer and sustainable "
                            "upcycling specialist. Analyze the provided clothing "
                            "image to identify its type, material, color, and any "
                            "damage, stains, or wear. Provide a creative, practical "
                            "DIY upcycling plan and a descriptive prompt for image "
                            "generation. Output MUST be a valid JSON object with "
                            "keys: 'garment_type', 'detected_damage', "
                            "'materials_needed' (array of strings), "
                            "'upcycling_steps' (array of strings), and "
                            "'redesign_prompt'."
                        ),
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": (
                                    "Analyze this garment and provide upcycling "
                                    "details in JSON format."
                                ),
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": (
                                        "data:image/jpeg;base64,"
                                        f"{base64_image}"
                                    )
                                },
                            },
                        ],
                    },
                ],
                response_format={"type": "json_object"},
                temperature=0.7,
            )

            response_content = vision_response.choices[0].message.content
            analysis_data = json.loads(response_content)
            analysis_data["preview_image_url"] = self._load_prebuilt_preview()
            return analysis_data
        except json.JSONDecodeError as error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to parse AI vision response into valid JSON.",
            ) from error
        except HTTPException:
            raise
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Groq API error: {error}",
            ) from error
