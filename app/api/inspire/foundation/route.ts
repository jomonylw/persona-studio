import { genAI, GEMINI_TEXT_MODEL_NAME } from '@/lib/gemini'
import { extractJson } from '@/lib/utils'
import { NextResponse } from 'next/server'
import { getPrompts, Locale } from '@/lib/prompts'

const MODEL_NAME = GEMINI_TEXT_MODEL_NAME

export async function POST(req: Request) {
  try {
    const {
      locale = 'en',
      constraints,
      model,
    } = (await req.json()) as {
      locale?: Locale
      constraints?: string
      model?: string
    }
    const prompts = getPrompts(locale, { constraints })

    const prompt = prompts.foundation.prompt
    const result = await genAI.models.generateContent({
      model: model || MODEL_NAME,
      contents: prompt,
    })
    const text = result.text
    if (!text) {
      throw new Error('AI did not return any text.')
    }
    const cleanedJson = extractJson(text)
    // console.log(cleanedJson);
    if (!cleanedJson) throw new Error('AI did not return valid JSON.')

    return NextResponse.json(JSON.parse(cleanedJson))
  } catch (error) {
    console.error('Error in /api/inspire/foundation:', error)
    return NextResponse.json(
      { error: 'Failed to generate foundation idea.' },
      { status: 500 },
    )
  }
}
