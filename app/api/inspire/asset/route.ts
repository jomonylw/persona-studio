import { genAI, GEMINI_TEXT_MODEL_NAME } from '@/lib/gemini'
import { extractJson } from '@/lib/utils'
import { NextResponse } from 'next/server'
import { getPrompts, Locale } from '@/lib/prompts'

const MODEL_NAME = GEMINI_TEXT_MODEL_NAME

export async function POST(req: Request) {
  try {
    const {
      assetType,
      name,
      description,
      locale = 'en',
      model,
    } = (await req.json()) as {
      assetType: 'character' | 'environment'
      name: string
      description: string
      locale?: Locale
      model?: string
    }
    const prompts = getPrompts(locale)

    let prompt: string
    if (assetType === 'character') {
      prompt = prompts.asset.character(name, description)
    } else {
      // assetType === 'environment'
      prompt = prompts.asset.environment(name, description)
    }
    // console.log("prompt:", prompt);
    const result = await genAI.models.generateContent({
      model: model || MODEL_NAME,
      contents: prompt,
    })
    const text = result.text
    if (!text) {
      throw new Error('AI did not return any text.')
    }
    const cleanedJson = extractJson(text)
    if (!cleanedJson) throw new Error('AI did not return valid JSON.')

    const responseObject = JSON.parse(cleanedJson)
    return NextResponse.json(responseObject)
  } catch (error) {
    console.error('Error in /api/inspire/asset:', error)
    return NextResponse.json(
      { error: 'Failed to generate asset idea.' },
      { status: 500 },
    )
  }
}
