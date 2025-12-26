import { NextResponse } from 'next/server'
import { getPrompts, Locale } from '@/lib/prompts'
import { PhotoshootStyle } from '@/lib/prompts/photoshoot'
import { ICharacterAsset, IEnvironmentAsset } from '@/types'
import { Part } from '@google/genai'
import { compressImage } from '@/lib/image-utils'
import { generateContent } from '@/lib/llm'

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
    // console.log(
    //   'Sending to Gemini in photoshoot:',
    //   JSON.stringify([{ role: 'user', parts: sanitizedContents }], null, 2),
    // )

    const eventText = await generateContent({
      model,
      contents: [{ role: 'user', parts: contents }],
    })

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
