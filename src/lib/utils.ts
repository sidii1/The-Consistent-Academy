import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────────────────────
// Cloudinary Upload Utility
// Cloud name: dftodlkkt
// Uses unsigned upload presets configured in Cloudinary dashboard.
// ─────────────────────────────────────────────────────────────

const CLOUDINARY_CLOUD_NAME = "dftodlkkt";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Uploads a file to Cloudinary using an unsigned upload preset.
 * @param file - The File object to upload (image).
 * @param preset - The unsigned upload preset name (e.g., "cc_pfp", "cc_meeting").
 * @returns The secure URL of the uploaded image.
 * @throws Error if the upload fails or the response is malformed.
 */
export async function uploadToCloudinary(file: File, preset: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Cloudinary upload failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error("Cloudinary response did not include a secure_url.");
  }

  return data.secure_url;
}
