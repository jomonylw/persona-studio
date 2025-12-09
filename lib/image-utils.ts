import sharp from 'sharp'

/**
 * Compresses a base64 encoded image.
 * It resizes the image to a maximum of 1024x1024, converts it to JPEG with 80% quality.
 * If compression fails, it returns the original base64 data (without the data URI scheme).
 * @param base64Image The base64 encoded image string (can be with or without data URI scheme).
 * @returns A Promise that resolves to the compressed base64 encoded image string (without data URI scheme).
 */
export async function compressImage(base64Image: string): Promise<string> {
  try {
    // Ensure we have pure base64 data
    const pureBase64 = base64Image.includes(',')
      ? base64Image.split(',')[1]
      : base64Image
    const imageBuffer = Buffer.from(pureBase64, 'base64')
    const originalSize = imageBuffer.length
    const originalMetadata = await sharp(imageBuffer).metadata()

    // Compress and resize the image
    const compressedImageBuffer = await sharp(imageBuffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true }) // Resize to max 1024x1024
      .jpeg({ quality: 80 }) // Convert to JPEG with quality 80
      .toBuffer()
    const compressedSize = compressedImageBuffer.length
    const compressedMetadata = await sharp(compressedImageBuffer).metadata()

    console.log(
      `Image compressed:
       Original: ${originalMetadata.width}x${originalMetadata.height}, ${(originalSize / 1024).toFixed(2)} KB
       Compressed: ${compressedMetadata.width}x${compressedMetadata.height}, ${(compressedSize / 1024).toFixed(2)} KB
       Reduction: ${(((originalSize - compressedSize) / originalSize) * 100).toFixed(2)}%`,
    )

    return compressedImageBuffer.toString('base64')
  } catch (error) {
    console.error('Error compressing image:', error)
    // If compression fails, return the original image to avoid breaking the flow
    return base64Image.includes(',') ? base64Image.split(',')[1] : base64Image
  }
}
