import { locales } from '@/i18n'
import { finetunePrompt, finetuneWithReferencePrompt } from './prompts/finetune'
import { personAppearancePromptTranslator } from './prompts/person-appearance-translator'
import { photoPromptTranslator } from './prompts/photo-prompt-translator'
import { photoshootPrompt } from './prompts/photoshoot'
import { characterCardPrompt } from './prompts/character-card'
import { environmentPrompt } from './prompts/environment'

export type Locale = (typeof locales)[number]

// A structured object for English prompts
const getEnPrompts = (options?: { constraints?: string }) => ({
  finetune: finetunePrompt.en,
  finetuneWithReference: finetuneWithReferencePrompt.en,
  personAppearance: personAppearancePromptTranslator.en,
  photo: photoPromptTranslator.en,
  photoshoot: photoshootPrompt.en,
  characterCard: characterCardPrompt.en,
  environment: environmentPrompt.en,
})

// A structured object for Chinese prompts
const getZhPrompts = (options?: { constraints?: string }) => ({
  finetune: finetunePrompt.zh,
  finetuneWithReference: finetuneWithReferencePrompt.zh,
  personAppearance: personAppearancePromptTranslator.zh,
  photo: photoPromptTranslator.zh,
  photoshoot: photoshootPrompt.zh,
  characterCard: characterCardPrompt.zh,
  environment: environmentPrompt.zh,
})

/**
 * Retrieves the prompt object for a given locale.
 * @param locale The current locale ('en' or 'zh').
 * @param options An optional object with additional parameters for the prompts.
 * @returns The prompt object for the specified locale.
 */
export function getPrompts(locale: Locale, options?: { constraints?: string }) {
  if (locale === 'zh') {
    return getZhPrompts(options)
  }
  return getEnPrompts(options)
}
