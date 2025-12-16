export async function uploadRemoteImage(
  supabase: any,
  fileUrl: string,
  destinationPath: string,
  contentType = 'image/jpeg'
) {
  const response = await fetch(fileUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch remote image: ${response.status} ${response.statusText}`)
  }

  const buffer = await response.arrayBuffer()

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(destinationPath, buffer, {
      contentType,
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(destinationPath)
  return publicUrl
}
