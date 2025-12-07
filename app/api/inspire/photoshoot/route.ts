import { NextResponse } from 'next/server'
import { genAI, GEMINI_IMAGE_MODEL_NAME } from '@/lib/gemini'
import { getPrompts, Locale } from '@/lib/prompts'
import { PhotoshootStyle } from '@/lib/prompts/photoshoot'
import { ICharacterAsset, IEnvironmentAsset } from '@/types'
import { Part } from '@google/genai'
import sharp from 'sharp'

// Helper function to compress an image
async function compressImage(base64Image: string): Promise<string> {
  try {
    const imageBuffer = Buffer.from(
      base64Image.includes(',') ? base64Image.split(',')[1] : base64Image,
      'base64',
    )
    const compressedImageBuffer = await sharp(imageBuffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer()
    return compressedImageBuffer.toString('base64')
  } catch (error) {
    console.error('Error compressing image:', error)
    return base64Image.includes(',') ? base64Image.split(',')[1] : base64Image
  }
}

export async function POST(req: Request) {
  try {
    const {
      characters,
      environment,
      locale = 'en',
      model,
      aspectRatio,
      style = 'candid_street',
      userIdea,
    }: {
      characters: ICharacterAsset[]
      environment?: IEnvironmentAsset
      locale?: Locale
      model?: string
      aspectRatio: string
      style?: PhotoshootStyle
      userIdea?: string
    } = await req.json()

    if (!characters) {
      return NextResponse.json(
        { error: 'Characters are required.' },
        { status: 400 },
      )
    }

    // --- Compress Images ---
    const compressionPromises: Promise<void>[] = []
    for (const character of characters) {
      if (character.imageUrl) {
        compressionPromises.push(
          compressImage(character.imageUrl).then((compressed) => {
            character.imageUrl = compressed
          }),
        )
      }
    }
    if (environment && environment.imageUrl) {
      compressionPromises.push(
        compressImage(environment.imageUrl).then((compressed) => {
          environment.imageUrl = compressed
        }),
      )
    }
    await Promise.all(compressionPromises)

    const prompts = getPrompts(locale)
    const prompt = prompts.photoshoot(
      characters,
      environment,
      aspectRatio,
      style,
      userIdea,
    )

    const contents: Part[] = [{ text: prompt }]

    // Add character images
    for (const character of characters) {
      if (character.imageUrl) {
        contents.push({ text: `Reference for character: ${character.name}` })
        // After compression, the image is just the base64 data
        contents.push({
          inlineData: {
            data: character.imageUrl,
            mimeType: 'image/jpeg', // We converted to JPEG during compression
          },
        })
      }
    }

    // Add environment image
    if (environment && environment.imageUrl) {
      contents.push({ text: `Reference for environment: ${environment.name}` })
      // After compression, the image is just the base64 data
      contents.push({
        inlineData: {
          data: environment.imageUrl,
          mimeType: 'image/jpeg', // We converted to JPEG during compression
        },
      })
    }

    const sanitizedContents = contents.map((part) => {
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
      'Sending to Gemini in photoshoot:',
      JSON.stringify([{ role: 'user', parts: sanitizedContents }], null, 2),
    )

    const result = await genAI.models.generateContent({
      model: model || GEMINI_IMAGE_MODEL_NAME,
      contents: [{ role: 'user', parts: contents }],
    })

    const eventText = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!eventText) {
      throw new Error('No event text returned from the API.')
    }

    return NextResponse.json({ prompt: eventText })
  } catch (error) {
    console.error('Error in /api/inspire/photoshoot:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.'
    return NextResponse.json(
      { error: 'Failed to generate random event.', details: errorMessage },
      { status: 500 },
    )
  }
}
