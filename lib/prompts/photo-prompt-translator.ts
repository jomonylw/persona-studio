import { ICharacterAsset, IEnvironmentAsset } from '@/types'

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
    photoPrompt: string,
    artStyle: string,
    environment?: IEnvironmentAsset,
  ): string => {
    const characterNames = characters.map((c) => c.name).join(', ')
    const finalPrompt = `
    **Master Prompt for Image Generation**

    **Input Information:**
    - **Character(s):** ${characterNames} (${characters.length} in total, reference image provided)
    - **Scene:** ${
      environment ? `${environment.name} (Reference image provided)` : 'None'
    }
    - **Overall Art Style:** ${artStyle}
    - **Core Image Description:** ${photoPrompt}

    **Instructions for AI:**
    - Create a single, coherent image that accurately depicts the scene, characters, and action described.
    - The environment should serve as the background for the core action.
    - Ensure the final image is dramatic, well-composed, and adheres to the specified art style.
  `
    return finalPrompt.trim()
  },
  zh: (
    characters: ICharacterAsset[],
    photoPrompt: string,
    artStyle: string,
    environment?: IEnvironmentAsset,
  ): string => {
    const characterNames = characters.map((c) => c.name).join('，')
    const finalPrompt = `
    **图像生成主提示词**
    
    **输入信息:**
    - **人物:** ${characterNames} (共 ${characters.length} 人，参考图已提供)
    - **场景:** ${environment ? `${environment.name} (参考图已提供)` : '无'}
    - **整体艺术风格:** ${artStyle}
    - **图像核心描述:** ${photoPrompt}

    **给AI的指令:**
    - 创建一个单一、连贯的图像，准确描绘所描述的场景、角色和动作。
    - 环境应作为核心行动的背景。
    - 确保最终图像富有戏剧性、构图精良，并符合指定的艺术风格。
  `
    return finalPrompt.trim()
  },
}
