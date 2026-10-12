/**
 * Utility for client-side image optimization, sizing checks, and dataURL conversion.
 */

const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB threshold
const MAX_DIMENSION_PX = 2000; // 2000px dimension threshold
const TARGET_MAX_DIMENSION_PX = 1600; // Max downscaled dimension
const COMPRESSION_QUALITY = 0.85; // 85% JPEG quality

/**
 * Converts a File or Blob into a base64 Data URL string for previews.
 */
export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Formats byte size into human readable string (e.g. 2.4 MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Loads an HTMLImageElement from an object URL safely.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Optimizes and downscales image files exceeding 4MB or 2000px dimensions.
 * Uses an offscreen canvas to resize to max 1600px width/height with 0.85 JPEG quality.
 */
export async function optimizeImageIfNeeded(file: File): Promise<{
  file: File;
  compressed: boolean;
  originalSize: number;
  newSize: number;
}> {
  const originalSize = file.size;

  // Non-image files or SVG should not be modified
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return { file, compressed: false, originalSize, newSize: originalSize };
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await loadImage(objectUrl);
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    const needsResize = width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX;
    const exceedsSize = originalSize > MAX_IMAGE_SIZE_BYTES;

    // If both size and dimensions are within healthy limits, return original
    if (!needsResize && !exceedsSize) {
      return { file, compressed: false, originalSize, newSize: originalSize };
    }

    // Calculate proportional dimensions maintaining aspect ratio
    let targetWidth = width;
    let targetHeight = height;

    if (width > TARGET_MAX_DIMENSION_PX || height > TARGET_MAX_DIMENSION_PX) {
      if (width >= height) {
        targetWidth = TARGET_MAX_DIMENSION_PX;
        targetHeight = Math.round((height * TARGET_MAX_DIMENSION_PX) / width);
      } else {
        targetHeight = TARGET_MAX_DIMENSION_PX;
        targetWidth = Math.round((width * TARGET_MAX_DIMENSION_PX) / height);
      }
    }

    // Render to Canvas
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return { file, compressed: false, originalSize, newSize: originalSize };
    }

    // Optional subtle image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    // Convert canvas to compressed Blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", COMPRESSION_QUALITY);
    });

    if (!blob) {
      return { file, compressed: false, originalSize, newSize: originalSize };
    }

    const compressedFileName = file.name.replace(/\.[^/.]+$/, "") + "-optimized.jpg";
    const compressedFile = new File([blob], compressedFileName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    return {
      file: compressedFile,
      compressed: true,
      originalSize,
      newSize: compressedFile.size,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
