import { createServiceRoleClient } from '@/lib/supabase/admin'

// Upload file to Supabase Storage
export async function uploadFile(
  file: File,
  bucket: string,
  fileName: string
): Promise<{ url: string; error: Error | null }> {
  try {
    const supabase = await createServiceRoleClient()
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
      })
    
    if (error) {
      return { url: '', error }
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    return { url: publicUrl, error: null }
  } catch (error) {
    return { url: '', error: error as Error }
  }
}

// Delete file from Supabase Storage
export async function deleteFile(
  bucket: string,
  fileName: string
): Promise<{ error: Error | null }> {
  try {
    const supabase = await createServiceRoleClient()
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])
    
    if (error) {
      return { error }
    }
    
    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}