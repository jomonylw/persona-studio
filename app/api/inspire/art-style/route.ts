import { NextRequest, NextResponse } from 'next/server'
import { genAI, GEMINI_TEXT_MODEL_NAME } from '@/lib/gemini'
import { Locale } from '@/lib/prompts'
import { extractJson } from '@/lib/utils'
import { getArtStylePrompt } from '@/lib/prompts/art-style'

export async function POST(req: NextRequest) {
  try {
    const {
      image,
      locale = 'en',
      genre,
      storySummary,
      colorStyle,
      model,
    } = (await req.json()) as {
      image: string
      locale: Locale
      genre: string
      storySummary: string
      colorStyle: string
      model?: string
    }

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required.' },
        { status: 400 },
      )
    }

    const prompt = getArtStylePrompt(locale, genre, storySummary, colorStyle)
    const parts = image.split(',')
    const data = parts.length > 1 ? parts[1] : image
    const mimeTypeMatch =
      parts.length > 1 ? parts[0].match(/data:(.*);base64/) : null
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg'
    const imagePart = {
      inlineData: {
        data: data,
        mimeType: mimeType,
      },
    }

    const result = await genAI.models.generateContent({
      model: GEMINI_TEXT_MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }, imagePart] }],
    })
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      throw new Error('AI did not return any text.')
    }
    const cleanedJson = extractJson(text)
    if (!cleanedJson) {
      // Fallback for safety, but the prompt expects JSON.
      return NextResponse.json({ artStyle: text })
    }

    return NextResponse.json(JSON.parse(cleanedJson))
  } catch (error) {
    console.error('Error in art-style generation:', error)
    return NextResponse.json(
      { error: 'Failed to generate art style description.' },
      { status: 500 },
    )
  }
}
