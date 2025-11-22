/**
 * Upload a file to Supabase storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name
 * @param filename - The filename to use for the upload
 * @returns The URL of the uploaded file or error information
 */
export async function uploadFileToStorage(
  file: File,
  bucket: string,
  filename: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Dynamically import the upload function to avoid issues with server/client boundaries
    const { uploadFile } = await import("@/lib/supabase/storage")
    const { url, error } = await uploadFile(file, bucket, filename)
    
    if (error) {
      return { url: null, error: error.message || "Upload failed" }
    }
    
    return { url, error: null }
  } catch (error) {
    console.error("File upload error:", error)
    return { url: null, error: "Failed to upload file" }
  }
}

/**
 * Generate a unique filename for file uploads
 * @param prefix - Prefix for the filename
 * @param identifier - Identifier to include in the filename (e.g., labelId)
 * @param extension - File extension
 * @returns A unique filename
 */
export function generateUniqueFilename(
  prefix: string,
  identifier: string,
  extension: string
): string {
  const timestamp = Date.now()
  const cleanIdentifier = identifier.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20)
  return `${prefix}-${timestamp}-${cleanIdentifier}.${extension}`
}