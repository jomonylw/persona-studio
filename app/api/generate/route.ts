import { GEMINI_IMAGE_MODEL_NAME, genAI } from '@/lib/gemini'
import { Part } from '@google/genai'
import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { getPrompts, Locale } from '@/lib/prompts'
import {
  IAsset,
  IPersonAppearance,
  ICharacterAsset,
  IEnvironmentAsset,
} from '@/types'
import { photoPromptTranslator } from '@/lib/prompts/photo-prompt-translator'

// Define the expected request body structure
interface ContextAsset {
  image: string
  name: string
  type?: 'character' | 'environment' | 'style'
}

interface GenerationRequest {
  prompt: string
  characterDescriptor?: IPersonAppearance // New field for structured character data
  type?: 'finetune' | 'generate'
  locale?: Locale
  asset?: IAsset
  // Array of named assets for context (preferred over baseImages)
  referenceAssets?: ContextAsset[]
  // A single base64 encoded image to be finetuned/edited
  finetuneImage?: string
  // A single base64 encoded image for composition reference
  referenceImage?: string
  aspectRatio?: string
  resolution?: string
  model?: string

  // For photo generation
  photoPrompt?: string
  characters?: ICharacterAsset[]
  environment?: IEnvironmentAsset
  artStyle?: string
  environmentPrompt?: string
}

interface ImageConfig {
  aspectRatio?: string
  imageSize?: string
}

interface ApiConfig {
  imageConfig?: ImageConfig
}

// Helper function to compress an image
async function compressImage(base64Image: string): Promise<string> {
  try {
    const imageBuffer = Buffer.from(
      base64Image.includes(',') ? base64Image.split(',')[1] : base64Image,
      'base64',
    )

    // Get original image metadata
    const originalMetadata = await sharp(imageBuffer).metadata()

    // Compress and resize the image
    const compressedImageBuffer = await sharp(imageBuffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true }) // Resize to max 1024x1024
      .jpeg({ quality: 80 }) // Convert to JPEG with quality 80
      .toBuffer()

    // Get compressed image metadata
    const compressedMetadata = await sharp(compressedImageBuffer).metadata()

    return compressedImageBuffer.toString('base64')
  } catch (error) {
    console.error('Error compressing image:', error)
    // If compression fails, return the original image to avoid breaking the flow
    return base64Image.includes(',') ? base64Image.split(',')[1] : base64Image
  }
}

export async function POST(req: Request) {
  try {
    const body: GenerationRequest = await req.json()
    const {
      prompt: initialPrompt,
      characterDescriptor,
      type = 'generate',
      locale = 'en',
      asset,
      aspectRatio,
      resolution,
      model,
      // for photo generation
      photoPrompt,
      characters,
      environment,
      artStyle,
      environmentPrompt,
    } = body
    let { finetuneImage, referenceImage } = body
    const { referenceAssets } = body

    // --- 1. Validate Input & Generate Prompt ---
    let prompt = initialPrompt

    // This is a photo generation request
    if (photoPrompt && characters) {
      const resolvedArtStyle =
        artStyle ||
        (locale === 'zh' ? '电影感, 超写实' : 'cinematic, hyperrealistic')

      prompt =
        locale === 'zh'
          ? photoPromptTranslator.zh(
              characters,
              photoPrompt,
              resolvedArtStyle,
              environment,
            )
          : photoPromptTranslator.en(
              characters,
              photoPrompt,
              resolvedArtStyle,
              environment,
            )
    }
    // This is a single character descriptor generation
    else if (characterDescriptor) {
      const prompts = getPrompts(locale)
      prompt = prompts.personAppearance(characterDescriptor)
    } else if (environmentPrompt) {
      const prompts = getPrompts(locale)
      prompt = prompts.environment(environmentPrompt)
    }

    // --- 1b. Validate Input ---
    if (!prompt) {
      return NextResponse.json(
        { error: 'A prompt or character descriptor is required.' },
        { status: 400 },
      )
    }

    // --- 2. Compress Images ---
    const compressionPromises: Promise<void>[] = []

    if (finetuneImage) {
      compressionPromises.push(
        compressImage(finetuneImage).then((compressed) => {
          finetuneImage = compressed
        }),
      )
    }

    if (referenceImage) {
      compressionPromises.push(
        compressImage(referenceImage).then((compressed) => {
          referenceImage = compressed
        }),
      )
    }

    if (referenceAssets && referenceAssets.length > 0) {
      compressionPromises.push(
        Promise.all(
          referenceAssets.map(async (asset) => {
            asset.image = await compressImage(asset.image)
          }),
        ).then(() => {
          // No assignment needed as we modified the objects in place
        }),
      )
    }

    await Promise.all(compressionPromises)

    // --- 3. Construct the Multi-Modal Prompt ---
    // The final prompt sent to the API will be an array of "parts"
    const promptParts: Part[] = []

    // If this is a finetuning request, add the image to be edited
    if (finetuneImage) {
      promptParts.push({ text: 'Base image to be edited or finetuned:' })
      promptParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: finetuneImage,
        },
      })
    }

    // If a composition reference image is provided, add it
    if (referenceImage) {
      promptParts.push({
        text: 'Image for reference (composition, character pose, etc.):',
      })
      promptParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: referenceImage,
        },
      })
    }

    // If named reference assets are provided, add them with labels
    if (referenceAssets && referenceAssets.length > 0) {
      referenceAssets.forEach((asset) => {
        promptParts.push({
          text: `Reference for ${asset.name || 'Context'}:`,
        })
        promptParts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: asset.image,
          },
        })
      })
    }

    // Then add the textual prompt
    let finalPromptText = prompt
    if (type === 'finetune' && asset) {
      const prompts = getPrompts(locale)
      const finetuneInstruction = prompt
      if (referenceImage) {
        finalPromptText = prompts.finetuneWithReference(finetuneInstruction)
      } else {
        finalPromptText = prompts.finetune(finetuneInstruction)
      }
    }

    promptParts.push({ text: `Generation instructions: ${finalPromptText}` })

    console.log('Final prompt text:', finalPromptText)

    // --- 4. Call the Gemini API ---

    const config: ApiConfig = {}
    const imageConfig: ImageConfig = {}

    console.log(
      `Received settings - Aspect Ratio: ${aspectRatio}, Resolution: ${resolution}`,
    )

    if (aspectRatio && aspectRatio !== 'Auto') {
      imageConfig.aspectRatio = aspectRatio
    }
    if (resolution && resolution !== '1K') {
      imageConfig.imageSize = resolution
    }

    if (Object.keys(imageConfig).length > 0) {
      config.imageConfig = imageConfig
    }

    const sanitizedPromptParts = promptParts.map((part) => {
      if (part.inlineData) {
        return {
          inlineData: {
            mimeType: part.inlineData.mimeType,
            data: part.inlineData.data
              ? `${part.inlineData.data.substring(0, 100)}...`
              : '[...null...]',
          },
        }
      }
      return part
    })

    console.log(
      'Final prompt parts:',
      JSON.stringify(sanitizedPromptParts, null, 2),
    )

    const result = await genAI.models.generateContent({
      model: model || GEMINI_IMAGE_MODEL_NAME,
      contents: promptParts,
      config,
    })

    // --- 5. Process the Response ---
    const firstCandidate = result.candidates?.[0]

    if (
      !firstCandidate ||
      !firstCandidate.content ||
      !firstCandidate.content.parts ||
      firstCandidate.content.parts.length === 0
    ) {
      throw new Error('No content returned from the API.')
    }

    // Find the part that contains the generated image data
    const imagePart = firstCandidate.content.parts.find(
      (part: Part) => !!part.inlineData,
    )

    if (!imagePart || !imagePart.inlineData) {
      throw new Error('No image data found in the API response.')
    }

    const imageData = imagePart.inlineData.data

    // --- 6. Send the Image Data Back to the Client ---
    // We send the raw base64 data, the client will prepend the data URI scheme.
    const imageUrl = `data:image/jpeg;base64,${imageData}`
    return NextResponse.json({ imageUrl: imageUrl })
  } catch (error) {
    console.error('Error in /api/generate:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.'
    return NextResponse.json(
      { error: 'Failed to generate image.', details: errorMessage },
      { status: 500 },
    )
  }
}
