import { ICharacterAsset, IEnvironmentAsset } from '@/types'
import { personAppearancePromptTranslator } from './person-appearance-translator'

/**
 * Combines character, environment, and a story prompt into a detailed image generation prompt.
 * @param characters - An array of character assets to be included in the photo.
 * @param environment - The environment asset for the background.
 * @param photoPrompt - A user-provided prompt describing the action or story.
 * @param artStyle - The general art style for the image.
 * @returns A detailed, structured prompt for the image generation model.
 */
export const photoPromptTranslator = {
  en: (
    characters: ICharacterAsset[],
    environment: IEnvironmentAsset,
    photoPrompt: string,
    artStyle: string,
  ): string => {
    const characterDescriptions = characters
      .map((character) => {
        const appearancePrompt = personAppearancePromptTranslator.en(
          character.descriptor,
        )
        return `Character "${character.name}": ${appearancePrompt}`
      })
      .join('\n')

    const environmentDescription = `Environment: ${environment.prompt}`

    const sceneComposition = `
    **Scene Composition:**
    - **Setting:** ${environment.name}. ${environmentDescription}
    - **Characters Present:** ${characters.map((c) => c.name).join(', ')}
    - **Core Action/Story:** ${photoPrompt}
  `

    const finalPrompt = `
    **Master Prompt for Image Generation**

    **Overall Art Style:** ${artStyle}

    **Scene Details:**
    ${sceneComposition}

    **Character Details:**
    ${characterDescriptions}

    **Instructions for AI:**
    - Create a single, coherent image that accurately depicts the scene, characters, and action described.
    - Pay close attention to the detailed descriptions of each character's appearance and clothing.
    - The environment should serve as the background for the core action.
    - Ensure the final image is dramatic, well-composed, and adheres to the specified art style.
  `

    return finalPrompt.trim()
  },
  zh: (
    characters: ICharacterAsset[],
    environment: IEnvironmentAsset,
    photoPrompt: string,
    artStyle: string,
  ): string => {
    const characterDescriptions = characters
      .map((character) => {
        const appearancePrompt = personAppearancePromptTranslator.zh(
          character.descriptor,
        )
        return `角色 "${character.name}": ${appearancePrompt}`
      })
      .join('\n')

    const environmentDescription = `环境: ${environment.prompt}`

    const sceneComposition = `
    **场景构成:**
    - **地点:** ${environment.name}. ${environmentDescription}
    - **在场角色:** ${characters.map((c) => c.name).join('，')}
    - **核心行动/故事:** ${photoPrompt}
  `

    const finalPrompt = `
    **图像生成主提示词**

    **整体艺术风格:** ${artStyle}

    **场景细节:**
    ${sceneComposition}

    **角色细节:**
    ${characterDescriptions}

    **给AI的指令:**
    - 创建一个单一、连贯的图像，准确描绘所描述的场景、角色和动作。
    - 密切关注每个角色外观和服装的详细描述。
    - 环境应作为核心行动的背景。
    - 确保最终图像富有戏剧性、构图精良，并符合指定的艺术风格。
  `

    return finalPrompt.trim()
  },
}
