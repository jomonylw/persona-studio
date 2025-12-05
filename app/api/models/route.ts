import { genAI } from '@/lib/gemini'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const models = await genAI.models.list()

    const textModels: string[] = []
    const imageModels: string[] = []

    for await (const model of models) {
      let modelName = model.name
      if (modelName && typeof modelName === 'string') {
        if (modelName.startsWith('models/')) {
          modelName = modelName.substring('models/'.length)
        }
        // Basic filtering logic, can be adjusted
        if (
          modelName.includes('text') ||
          (modelName.includes('flash') && !modelName.includes('image')) ||
          (modelName.includes('pro') &&
            !modelName.includes('image') &&
            !modelName.includes('banana'))
        ) {
          textModels.push(modelName)
        } else if (
          modelName.includes('image') ||
          modelName.includes('banana')
        ) {
          imageModels.push(modelName)
        }
      }
    }

    return NextResponse.json({
      textModels: textModels.sort(),
      imageModels: imageModels.sort(),
    })
  } catch (error) {
    console.error('Failed to fetch models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 },
    )
  }
}
