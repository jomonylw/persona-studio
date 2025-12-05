import { genAI, GEMINI_TEXT_MODEL_NAME } from '@/lib/gemini'
import { extractJson } from '@/lib/utils'
import { NextResponse } from 'next/server'
import { getPrompts, Locale } from '@/lib/prompts'
import { IStoryPlan } from '@/types'

const MODEL_NAME = GEMINI_TEXT_MODEL_NAME

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      storyPlan,
      previousPagePrompts,
      locale = 'en',
      aspectRatio,
      model,
    } = body as {
      storyPlan: IStoryPlan
      previousPagePrompts: string[]
      locale?: Locale
      aspectRatio?: string
      model?: string
    }

    if (
      !storyPlan ||
      typeof storyPlan !== 'object' ||
      !Array.isArray(storyPlan.pages) ||
      storyPlan.pages.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "A valid story plan with a 'pages' array is required to generate a page prompt.",
        },
        { status: 400 },
      )
    }

    const prompts = getPrompts(locale)
    const nextPageNumber = previousPagePrompts.length + 1
    const targetPagePlan = storyPlan.pages.find(
      (p) => p.page === nextPageNumber,
    )

    if (!targetPagePlan) {
      return NextResponse.json(
        { error: `Could not find plan for page ${nextPageNumber}.` },
        { status: 400 },
      )
    }

    const prompt = prompts.page.base(
      nextPageNumber,
      storyPlan.detailedStorySummary,
      targetPagePlan.description,
      previousPagePrompts,
      aspectRatio,
    )

    console.log(
      '--- Final Prompt to be sent to Gemini API for page inspiration ---',
    )
    console.log(prompt)
    console.log(
      '-----------------------------------------------------------------',
    )

    const result = await genAI.models.generateContent({
      model: model || MODEL_NAME,
      contents: prompt,
    })
    const text = result.text
    console.log('--- Text returned from Gemini API ---')
    console.log(text)
    console.log('------------------------------------')
    if (!text) {
      throw new Error('AI did not return any text.')
    }
    const cleanedJson = extractJson(text)
    if (!cleanedJson) throw new Error('AI did not return valid JSON.')

    return NextResponse.json(JSON.parse(cleanedJson))
  } catch (error) {
    console.error('Error in /api/inspire/page:', error)
    return NextResponse.json(
      { error: 'Failed to generate page idea.' },
      { status: 500 },
    )
  }
}
