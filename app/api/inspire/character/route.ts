import { NextResponse } from 'next/server'
import { getPrompts } from '@/lib/prompts'
import { Part } from '@google/genai'
import { compressImage } from '@/lib/image-utils'
import { generateContent } from '@/lib/llm'

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
    // console.log('Final Prompt for /api/inspire/character:', prompt)

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
