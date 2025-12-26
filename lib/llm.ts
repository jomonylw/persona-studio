import { genAI, GEMINI_TEXT_MODEL_NAME } from '@/lib/gemini'
import { Part } from '@google/genai'

interface GenerateOptions {
  model?: string
  contents: { role: string; parts: Part[] }[]
  temperature?: number
}

/**
 * Cleans the model response by removing thinking process blocks.
 * Supports <think>...</think> tags.
 */
function cleanResponse(text: string): string {
  // Remove <think>...</think> content (including newlines)
  // The regex [\s\S] matches any character including newlines
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
}

/**
 * A wrapper around genAI.models.generateContent that:
 * 1. Aggregates all text parts from the response.
 * 2. Cleans out "thinking" process tags.
 * 3. Handles basic errors.
 */
export async function generateContent(
  options: GenerateOptions,
): Promise<string> {
  const modelName = options.model || GEMINI_TEXT_MODEL_NAME

  try {
    console.log('--- LLM Request ---')
    console.log(`Model: ${modelName}`)
    console.log(
      'Contents:',
      JSON.stringify(
        options.contents.map((c) => ({
          role: c.role,
          parts: c.parts.map((p) => {
            if (p.text) return { text: p.text }
            if (p.inlineData)
              return {
                inlineData: {
                  mimeType: p.inlineData.mimeType,
                  data: '[BASE64_IMAGE_DATA_TRUNCATED]',
                },
              }
            return p
          }),
        })),
        null,
        2,
      ),
    )
    console.log('-------------------')

    const result = await genAI.models.generateContent({
      model: modelName,
      contents: options.contents,
      config: {
        temperature: options.temperature,
      },
    })

    // Aggregate all parts
    const parts = result.candidates?.[0]?.content?.parts || []
    let fullText = ''

    console.log('--- LLM Response Parts ---')
    parts.forEach((part, index) => {
      // Create a copy of the part for logging to modify it safely
      const partToLog = { ...part }

      // Remove thoughtSignature from logs if present to keep logs clean
      if ('thoughtSignature' in partToLog) {
        delete (partToLog as any).thoughtSignature
      }

      console.log(`Part ${index}:`, JSON.stringify(partToLog, null, 2))

      // Check for "thought" property (Gemini Thinking models)
      // Use type assertion or 'in' check for robustness
      const isThought = 'thought' in part && (part as any).thought === true

      if (isThought) {
        console.log(`Part ${index} identified as thought process, skipping.`)
        return
      }

      if (part.text) {
        fullText += part.text
      }
    })
    console.log('--------------------------')

    if (!fullText) {
      throw new Error('AI did not return any text.')
    }

    console.log('--- Raw LLM Response ---')
    console.log(fullText)
    console.log('------------------------')

    // Clean the response
    const cleanedText = cleanResponse(fullText)

    console.log('--- Cleaned LLM Response ---')
    console.log(cleanedText)
    console.log('----------------------------')

    return cleanedText
  } catch (error) {
    console.error(`Error generating content with model ${modelName}:`, error)
    throw error // Re-throw to let the caller handle specific API errors if needed
  }
}
