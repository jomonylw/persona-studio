import { genAI, GEMINI_TEXT_MODEL_NAME } from '@/lib/gemini'
import { extractJson } from '@/lib/utils'
import { NextResponse } from 'next/server'
import { getPrompts, Locale } from '@/lib/prompts'
import { IStoryPlan } from '@/types'

const MODEL_NAME = GEMINI_TEXT_MODEL_NAME

export async function POST(req: Request) {
  try {
    const {
      plan,
      numPages,
      locale = 'en',
      model,
    } = (await req.json()) as {
      plan: Omit<IStoryPlan, 'pages'>
      numPages: number
      locale?: Locale
      model?: string
    }

    if (!plan || !numPages) {
      return NextResponse.json(
        { error: 'Plan and number of pages are required.' },
        { status: 400 },
      )
    }

    const prompts = getPrompts(locale)

    const prompt = prompts.storyPlan(plan, numPages)

    console.log('--- PROMPT FOR /api/inspire/story-plan ---', prompt)

    const result = await genAI.models.generateContent({
      model: model || MODEL_NAME,
      contents: prompt,
    })
    const responseText = result.text

    if (!responseText) {
      throw new Error('AI did not return any text.')
    }
    const cleanedJson = extractJson(responseText)
    if (!cleanedJson) {
      throw new Error('AI did not return a valid JSON object.')
    }

    const responseObject = JSON.parse(cleanedJson)
    return NextResponse.json(responseObject)
  } catch (error) {
    console.error('Error in /api/inspire/story-plan:', error)
    return NextResponse.json(
      { error: 'Failed to generate story plan.' },
      { status: 500 },
    )
  }
}
