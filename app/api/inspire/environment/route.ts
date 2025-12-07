import { genAI, GEMINI_TEXT_MODEL_NAME } from '@/lib/gemini'
import { NextResponse } from 'next/server'
import { getPrompts } from '@/lib/prompts'
import { Part } from '@google/genai'

const MODEL_NAME = GEMINI_TEXT_MODEL_NAME

export async function POST(req: Request) {
  try {
    const {
      userIdea,
      model,
      locale = 'en',
    } = (await req.json()) as {
      userIdea?: string
      model?: string
      locale?: 'en' | 'zh'
    }

    const prompts = getPrompts(locale)
    const prompt = prompts.environmentText(userIdea || '')

    const contents: Part[] = [{ text: prompt }]

    const result = await genAI.models.generateContent({
      model: model || MODEL_NAME,
      contents: [{ role: 'user', parts: contents }],
    })

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      throw new Error('AI did not return any text.')
    }

    // Parse the JSON response from the LLM
    let environmentData
    try {
      // Clean up the response - remove markdown code blocks if present
      const cleanedText = text
        .replace(/```json\s*/g, '')
        .replace(/```\s*$/g, '')
        .trim()
      environmentData = JSON.parse(cleanedText)

      // Validate that we have the required fields
      if (!environmentData.name || !environmentData.prompt) {
        throw new Error('Invalid environment data structure')
      }
    } catch (parseError) {
      console.error('Failed to parse JSON response:', text)
      throw new Error('AI returned invalid JSON format')
    }

    return NextResponse.json(environmentData)
  } catch (error) {
    console.error('Error in /api/inspire/environment:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.'
    return NextResponse.json(
      {
        error: 'Failed to generate environment idea.',
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
