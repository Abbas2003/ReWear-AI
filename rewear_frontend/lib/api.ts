export interface RedesignResponse {
  garment_type: string;
  detected_damage: string;
  materials_needed: string[];
  upcycling_steps: string[];
  redesign_prompt: string;
  preview_image_url: string;
}

export interface StoredResultData {
  result: RedesignResponse;
  originalImageDataUrl: string;
  uploadedAt: string;
}

export class ApiError extends Error {
  statusCode?: number;
  hint?: string;

  constructor(message: string, statusCode?: number, hint?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.hint = hint;
  }
}

const DEFAULT_API_URL = "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 90_000;

export const MOCK_RESPONSE: RedesignResponse = {
  garment_type: "Artisan Upcycled Garment",
  detected_damage:
    "Surface fabric distress (approx 5cm wear zone), loosened edge seam stitching, and light regional fabric discoloration.",
  materials_needed: [
    "Contrasting decorative fabric patch (or scrap cotton)",
    "Durable embroidery thread (Sashiko or heavy-duty thread)",
    "Hand-sewing embroidery needle (size 3–5)",
    "Fabric shears / sharp craft scissors",
    "Non-toxic fabric adhesive or iron-on fusible web",
  ],
  upcycling_steps: [
    "Carefully trim frayed loose threads along the perimeter of the distressed area to create a clean foundation.",
    "Cut a scrap fabric backing patch approximately 1.5 cm larger than the tear and affix it behind the damaged zone.",
    "Position your decorative accent patch over the exterior fabric and pin it firmly in place.",
    "Using decorative Sashiko running stitches, hand-sew geometric rows across the patch to permanently bond the layers.",
    "Reinforce the surrounding seam edges with small, tight whipstitches to prevent future unravelling.",
    "Steam-press the completed repair using a damp pressing cloth and warm iron to lock the stitches in place.",
  ],
  redesign_prompt:
    "An artisan upcycled wearable garment transformed with intricate botanical embroidery patches and geometric sashiko contrast stitching, bespoke sustainable streetwear aesthetic, professional studio lighting.",
  preview_image_url: "/mock-preview.svg",
};

export function getMockResult(): RedesignResponse {
  return { ...MOCK_RESPONSE };
}

export async function analyzeGarment(
  file: File,
  signal?: AbortSignal,
  forceMock: boolean = false
): Promise<RedesignResponse> {
  const isMockMode =
    forceMock ||
    (typeof window !== "undefined" &&
      window.localStorage.getItem("rewear_mock_mode") === "true") ||
    process.env.NEXT_PUBLIC_USE_MOCK === "true";

  if (isMockMode) {
    // Simulate real AI processing latency for authentic demo feeling
    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, 5000);

      if (signal) {
        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new DOMException("Analysis cancelled by user", "AbortError"));
        });
      }
    });

    return getMockResult();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || DEFAULT_API_URL;
  const endpoint = `${baseUrl}/api/v1/analyze-and-redesign`;

  if (!file.type.startsWith("image/")) {
    throw new ApiError(
      "Invalid file format. Please upload a JPG, PNG, or WEBP image.",
      415,
      "Ensure you are selecting an image file from your device."
    );
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new ApiError(
      "File size exceeds the 10MB limit.",
      413,
      "Use our automatic image compression or select a smaller photo."
    );
  }

  const formData = new FormData();
  formData.append("image", file, file.name);

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort();
  }, REQUEST_TIMEOUT_MS);

  if (signal) {
    signal.addEventListener("abort", () => {
      timeoutController.abort();
    });
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      signal: timeoutController.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errorJson = await response.json();
        if (errorJson.detail) {
          errorMessage = typeof errorJson.detail === "string" 
            ? errorJson.detail 
            : JSON.stringify(errorJson.detail);
        }
      } catch {
        if (response.statusText) errorMessage = response.statusText;
      }

      if (response.status === 413) {
        throw new ApiError(
          "Image size exceeds server limits.",
          413,
          "Please upload an image smaller than 10MB."
        );
      }

      if (response.status === 415 || response.status === 400) {
        throw new ApiError(
          errorMessage || "Invalid image upload.",
          response.status,
          "Please ensure your image is a clear JPG or PNG photo."
        );
      }

      if (response.status >= 500) {
        throw new ApiError(
          "The AI processing engine encountered an unexpected error.",
          response.status,
          "The OpenAI GPT-4o Vision or DALL-E 3 service may be experiencing high load. Please retry or click 'Show demo result'."
        );
      }

      throw new ApiError(errorMessage, response.status);
    }

    const data: RedesignResponse = await response.json();
    return data;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      if (signal?.aborted) {
        throw new ApiError("Analysis was cancelled.", 0, "You cancelled the process.");
      }
      throw new ApiError(
        "Request timed out after 90 seconds.",
        408,
        "High-resolution AI analysis took longer than expected. Click 'Show demo result' to see the blueprint immediately."
      );
    }

    if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
      throw new ApiError(
        "Could not connect to the ReWear AI backend server.",
        0,
        `FastAPI service is offline at ${baseUrl}. Click 'Show demo result' to continue the presentation.`
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred during analysis.",
      0,
      "Please verify your connection or click 'Show demo result'."
    );
  }
}
