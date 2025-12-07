import { ICharacterAsset, IEnvironmentAsset } from '@/types'
import {
  PhotoshootStyle,
  StyleConfig,
  candidStreet,
  cinematic,
  highFashion,
  japaneseSoft,
  cyberpunk,
  vintageFilm,
  bwArt,
  selfie,
  minimalist,
  professionalHeadshot,
  cctv,
  mirrorSelfie,
  portraitCloseup,
  fujiInstax,
} from './styles'

export type { PhotoshootStyle }

const getStyleConfig = (style: PhotoshootStyle): StyleConfig => {
  switch (style) {
    case 'cinematic':
      return cinematic
    case 'high_fashion':
      return highFashion
    case 'japanese_soft':
      return japaneseSoft
    case 'cyberpunk':
      return cyberpunk
    case 'vintage_film':
      return vintageFilm
    case 'bw_art':
      return bwArt
    case 'selfie':
      return selfie
    case 'minimalist':
      return minimalist
    case 'professional_headshot':
      return professionalHeadshot
    case 'cctv':
      return cctv
    case 'mirror_selfie':
      return mirrorSelfie
    case 'portrait_closeup':
      return portraitCloseup
    case 'fuji_instax':
      return fujiInstax
    case 'candid_street':
    default:
      return candidStreet
  }
}

const generatePrompt = (
  characters: ICharacterAsset[],
  environment: IEnvironmentAsset | undefined,
  aspectRatio: string,
  style: PhotoshootStyle = 'candid_street',
  lang: 'en' | 'zh',
  userIdea?: string,
): string => {
  const characterCount = characters.length
  const characterNames = characters.map((c) => c.name).join(', ')
  const environmentName = environment?.name || 'unspecified'
  const config = getStyleConfig(style)

  if (lang === 'zh') {
    const scenario =
      characterCount > 1 ? config.scenario.multi.zh : config.scenario.single.zh
    const gesture =
      characterCount > 1 ? config.gesture.multi.zh : config.gesture.single.zh

    const prompt = `
        ${config.role.zh}
        ${config.task.zh}
  
        **输入信息:**
        - **人物:** ${characterNames} (共 ${characterCount} 人，参考图已提供)
        - **场景:** ${environment ? `${environmentName} (参考图已提供)` : '无'}
        ${userIdea ? `- **用户想法:** ${userIdea}` : ''}
        - **画幅比例:** ${aspectRatio}
        - **摄影风格:** ${config.coreStyle.style.zh}
  
        **你的任务:**
        ${
          userIdea
            ? `请以用户的想法 "${userIdea}" 为核心，创作一个富有创意的摄影场景描述。你需要将用户的想法与我们提供的摄影风格 (${config.coreStyle.style.zh}) 融合。下面的要素可以作为你创作的参考，但核心是实现用户的想法。`
            : scenario
        }
  
        你的描述需要包含以下核心要素：
  
        1.  **场景情境 (Scenario):** ${gesture}
        2.  **构图与视角 (Composition & Angle):** ${config.composition.zh}
        3.  **光线氛围 (Atmospheric Lighting):** ${config.lighting.zh}
        4.  **姿态与动态 (Gesture & Motion):** 描述符合该风格的人物姿态。${
          characterCount > 1
            ? '重点在于人物间的互动。'
            : '捕捉人物的自然或特定状态。'
        }
        5.  **核心风格与质感 (Core Style & Texture):**
            - **风格:** ${config.coreStyle.style.zh}
            - **相机与器材:** ${config.coreStyle.camera.zh}
            - **质感:** ${config.coreStyle.texture.zh}
            - **最终效果:** ${config.coreStyle.output.zh}
        **输出要求:**
        - 直接输出最终的摄影指令，语言要充满艺术感和指导性。
        - 整体描述要符合"${config.coreStyle.style.zh}"的调性。
      `
    console.log(`Photoshoot Prompt (zh) [${style}]:`, prompt)
    return prompt
  }

  const scenario =
    characterCount > 1 ? config.scenario.multi.en : config.scenario.single.en
  const gesture =
    characterCount > 1 ? config.gesture.multi.en : config.gesture.single.en

  const prompt = `
    ${config.role.en}
    ${config.task.en}

    **Input Information:**
    - **Character(s):** ${characterNames} (${characterCount} in total, reference image provided)
    - **Scene:** ${
      environment ? `${environmentName} (Reference image provided)` : 'None'
    }
    ${userIdea ? `- **User's Idea:** ${userIdea}` : ''}
    - **Aspect Ratio:** ${aspectRatio}
    - **Photography Style:** ${config.coreStyle.style.en}

    **Your Task:**
    ${
      userIdea
        ? `Please create a creative photoshoot scene description centered around the user's idea: "${userIdea}". You need to blend the user's concept with the provided photography style (${config.coreStyle.style.en}). The elements below can serve as a reference for your creation, but the main goal is to bring the user's idea to life.`
        : scenario
    }

    Your description must include the following core elements:

    1.  **Scenario:** ${gesture}
    2.  **Composition & Angle:** ${config.composition.en}
    3.  **Atmospheric Lighting:** ${config.lighting.en}
    4.  **Gesture & Motion:** Describe the pose fitting this style. ${
      characterCount > 1
        ? 'Focus on the interaction between subjects.'
        : 'Capture the natural or specific state of the character.'
    }
    5.  **Core Style & Texture:**
        - **Style:** ${config.coreStyle.style.en}
        - **Camera & Gear:** ${config.coreStyle.camera.en}
        - **Texture:** ${config.coreStyle.texture.en}
        - **Final Output:** ${config.coreStyle.output.en}
    **Output Requirements:**
    - Directly output the final photography brief in artistic and evocative language.
    - The tone should fit the "${config.coreStyle.style.en}" aesthetic.
  `
  console.log(`Photoshoot Prompt (en) [${style}]:`, prompt)
  return prompt
}

export const photoshootPrompt = {
  en: (
    characters: ICharacterAsset[],
    environment: IEnvironmentAsset | undefined,
    aspectRatio: string,
    style: PhotoshootStyle = 'candid_street',
    userIdea?: string,
  ): string => {
    return generatePrompt(
      characters,
      environment,
      aspectRatio,
      style,
      'en',
      userIdea,
    )
  },
  zh: (
    characters: ICharacterAsset[],
    environment: IEnvironmentAsset | undefined,
    aspectRatio: string,
    style: PhotoshootStyle = 'candid_street',
    userIdea?: string,
  ): string => {
    return generatePrompt(
      characters,
      environment,
      aspectRatio,
      style,
      'zh',
      userIdea,
    )
  },
}

export const getArtStyleDescription = (
  style: PhotoshootStyle,
  locale: string,
): string => {
  const config = getStyleConfig(style)
  return locale === 'zh' ? config.coreStyle.style.zh : config.coreStyle.style.en
}

export const getStyles = (): PhotoshootStyle[] => [
  'candid_street',
  'cinematic',
  'high_fashion',
  'japanese_soft',
  'cyberpunk',
  'vintage_film',
  'bw_art',
  'selfie',
  'minimalist',
  'professional_headshot',
  'cctv',
  'mirror_selfie',
  'portrait_closeup',
  'fuji_instax',
]
