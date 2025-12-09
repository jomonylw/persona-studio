import { genAI, GEMINI_TEXT_MODEL_NAME } from '@/lib/gemini'
import { NextResponse } from 'next/server'
import { getPrompts } from '@/lib/prompts'
import { Part } from '@google/genai'
import { compressImage } from '@/lib/image-utils'

const MODEL_NAME = GEMINI_TEXT_MODEL_NAME

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      userIdea?: string
      initialImage?: string
      model?: string
      locale?: 'en' | 'zh'
    }

    const { userIdea, initialImage, model, locale = 'en' } = body

    const prompts = getPrompts(locale)
    const prompt = prompts.character(userIdea, !!initialImage)
    console.log('Final Prompt for /api/inspire/character:', prompt)

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

    const result = await genAI.models.generateContent({
      model: model || MODEL_NAME,
      contents: [{ role: 'user', parts: contents }],
    })

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      throw new Error('AI did not return any text.')
    }

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Error in /api/inspire/character:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.'
    return NextResponse.json(
      {
        error: 'Failed to generate character idea.',
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
