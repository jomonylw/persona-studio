import { extractJson } from '@/lib/utils'
import { NextResponse } from 'next/server'
import { getPrompts } from '@/lib/prompts'
import { IPersonAppearance } from '@/types'
import { Part } from '@google/genai'
import { compressImage } from '@/lib/image-utils'
import { generateContent } from '@/lib/llm'

export async function POST(req: Request) {
  try {
    const {
      userIdea,
      initialImage,
      model,
      locale = 'en',
    } = (await req.json()) as {
      userIdea: string
      initialImage?: string
      model?: string
      locale?: 'en' | 'zh'
    }

    // Allow empty userIdea if an image is provided
    if (!userIdea && !initialImage) {
      return NextResponse.json(
        { error: 'User idea or image is required.' },
        { status: 400 },
      )
    }

    const prompts = getPrompts(locale)
    // Ensure userIdea is at least an empty string
    const prompt = prompts.characterCard(userIdea || '', !!initialImage)

    const contents: Part[] = [{ text: prompt }]

    if (initialImage) {
      const compressedImage = await compressImage(initialImage)
      contents.push({
        inlineData: {
          data: compressedImage,
          mimeType: 'image/jpeg',
        },
      })
    }

    const text = await generateContent({
      model,
      contents: [{ role: 'user', parts: contents }],
    })

    const cleanedJson = extractJson(text)
    if (!cleanedJson) {
      console.error('Failed to extract JSON from AI response:', text)
      throw new Error('AI did not return valid JSON.')
    }

    // Validate if the parsed object matches the IPersonAppearance structure
    const responseObject: IPersonAppearance = JSON.parse(cleanedJson)

    return NextResponse.json(responseObject)
  } catch (error) {
    console.error('Error in /api/inspire/character-card:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.'
    return NextResponse.json(
      {
        error: 'Failed to generate character card.',
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
