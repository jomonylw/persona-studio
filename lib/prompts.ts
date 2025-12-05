import { locales } from '@/i18n'
import { foundationPrompt } from './prompts/foundation'
import { storyPlanPrompt } from './prompts/story-plan'
import { assetCharacterPrompt } from './prompts/asset-character'
import { assetEnvironmentPrompt } from './prompts/asset-environment'
import { pagePrompt, pageGenerationPrompt } from './prompts/page'
import { assetGenerationPrompt } from './prompts/asset'
import { planPrompt } from './prompts/plan'
import { finetunePrompt, finetuneWithReferencePrompt } from './prompts/finetune'

export type Locale = (typeof locales)[number]

// A structured object for English prompts
const getEnPrompts = (options?: { constraints?: string }) => ({
  foundation: foundationPrompt.en(options),
  storyPlan: storyPlanPrompt.en,
  asset: {
    character: assetCharacterPrompt.en,
    environment: assetEnvironmentPrompt.en,
    generation: assetGenerationPrompt.en,
  },
  page: {
    base: pagePrompt.en,
    generation: pageGenerationPrompt.en,
  },
  plan: planPrompt.en,
  finetune: finetunePrompt.en,
  finetuneWithReference: finetuneWithReferencePrompt.en,
})

// A structured object for Chinese prompts
const getZhPrompts = (options?: { constraints?: string }) => ({
  foundation: foundationPrompt.zh(options),
  storyPlan: storyPlanPrompt.zh,
  asset: {
    character: assetCharacterPrompt.zh,
    environment: assetEnvironmentPrompt.zh,
    generation: assetGenerationPrompt.zh,
  },
  page: {
    base: pagePrompt.zh,
    generation: pageGenerationPrompt.zh,
  },
  plan: planPrompt.zh,
  finetune: finetunePrompt.zh,
  finetuneWithReference: finetuneWithReferencePrompt.zh,
})

/**
 * Retrieves the prompt object for a given locale.
 * @param locale The current locale ('en' or 'zh').
 * @param options An optional object with additional parameters for the prompts.
 * @returns The prompt object for the specified locale.
 */
export function getPrompts(locale: Locale, options?: { constraints?: string }) {
  const prompts: Record<Locale, ReturnType<typeof getEnPrompts>> = {
    en: getEnPrompts(options),
    zh: getZhPrompts(options),
  }
  return prompts[locale] || prompts.en
}
