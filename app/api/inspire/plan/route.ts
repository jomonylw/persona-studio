import { genAI, GEMINI_TEXT_MODEL_NAME } from '@/lib/gemini'
import { extractJson } from '@/lib/utils'
import { NextResponse } from 'next/server'
import { getPrompts, Locale } from '@/lib/prompts'
import { Part } from '@google/genai'

const MODEL_NAME = GEMINI_TEXT_MODEL_NAME

export async function POST(req: Request) {
  try {
    const {
      genre,
      storySummary,
      artStyle,
      colorStyle,
      numPages,
      locale = 'en',
      artStyleImage,
      model,
    } = (await req.json()) as {
      genre: string
      storySummary: string
      artStyle: string
      colorStyle: string
      numPages: number
      locale?: Locale
      artStyleImage?: string
      model?: string
    }
    const prompts = getPrompts(locale)

    const prompt = prompts.plan(
      genre,
      storySummary,
      artStyle,
      colorStyle,
      numPages,
      !!artStyleImage,
    )

    console.log('--- PROMPT FOR /api/inspire/plan ---', prompt)

    const contents: Part[] = [{ text: prompt }]
    if (artStyleImage) {
      const parts = artStyleImage.split(',')
      const data = parts.length > 1 ? parts[1] : artStyleImage
      const mimeTypeMatch =
        parts.length > 1 ? parts[0].match(/data:(.*);base64/) : null
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg'
      const imagePart = {
        inlineData: {
          data: data,
          mimeType: mimeType,
        },
      }
      contents.push(imagePart)
    }

    // console.log("Prompt:", prompt);
    const result = await genAI.models.generateContent({
      model: model || MODEL_NAME,
      contents: contents,
    })
    const text = result.text
    if (!text) {
      throw new Error('AI did not return any text.')
    }
    const cleanedJson = extractJson(text)
    if (!cleanedJson) throw new Error('AI did not return valid JSON.')

    return NextResponse.json(JSON.parse(cleanedJson))
  } catch (error) {
    console.error('Error in /api/inspire/plan:', error)
    return NextResponse.json(
      { error: 'Failed to generate story plan.' },
      { status: 500 },
    )
  }
}
