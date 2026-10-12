/**
 * Verifies real file signature (magic bytes) for image uploads.
 * Defends against file extension and MIME type spoofing.
 */

export async function verifyImageFileSignature(file: File): Promise<{
  isValid: boolean;
  mimeType: string;
  error?: string;
}> {
  // Read first 12 bytes
  const slice = file.slice(0, 12);
  const buffer = await slice.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  if (bytes.length < 4) {
    return { isValid: false, mimeType: "", error: "File is too small or empty." };
  }

  // JPEG signature: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { isValid: true, mimeType: "image/jpeg" };
  }

  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return { isValid: true, mimeType: "image/png" };
  }

  // WEBP signature: RIFF (bytes 0-3) .... WEBP (bytes 8-11)
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes.length >= 12 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { isValid: true, mimeType: "image/webp" };
  }

  return {
    isValid: false,
    mimeType: "",
    error: "File format is not a verified JPEG, PNG, or WEBP image.",
  };
}
