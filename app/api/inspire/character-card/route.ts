import { genAI, GEMINI_TEXT_MODEL_NAME } from '@/lib/gemini'
import { extractJson } from '@/lib/utils'
import { NextResponse } from 'next/server'
import { getPrompts } from '@/lib/prompts'
import { IPersonAppearance } from '@/types'
import { Part } from '@google/genai'

const MODEL_NAME = GEMINI_TEXT_MODEL_NAME

export async function POST(req: Request) {
  try {
    const {
      userIdea,
      image,
      model,
      locale = 'en',
    } = (await req.json()) as {
      userIdea: string
      image?: string
      model?: string
      locale?: 'en' | 'zh'
    }

    // Allow empty userIdea if an image is provided
    if (!userIdea && !image) {
      return NextResponse.json(
        { error: 'User idea or image is required.' },
        { status: 400 },
      )
    }

    const prompts = getPrompts(locale)
    // Ensure userIdea is at least an empty string
    const prompt = prompts.characterCard(userIdea || '', !!image)

    const contents: Part[] = [{ text: prompt }]

    if (image) {
      const parts = image.split(',')
      const data = parts.length > 1 ? parts[1] : image
      const mimeTypeMatch =
        parts.length > 1 ? parts[0].match(/data:(.*);base64/) : null
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg'
      contents.push({
        inlineData: {
          data: data,
          mimeType: mimeType,
        },
      })
    }

    const result = await genAI.models.generateContent({
      model: model || MODEL_NAME,
      contents: [{ role: 'user', parts: contents }],
    })

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      throw new Error('AI did not return any text.')
    }

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
