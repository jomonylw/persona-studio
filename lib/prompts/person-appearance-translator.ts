import { IPersonAppearance } from '@/types'

/**
 * Translates a structured IPersonAppearance object into a detailed,
 * human-readable string suitable for an image generation prompt.
 * @param descriptor - The IPersonAppearance object.
 * @returns A detailed string describing the character.
 */
export const personAppearancePromptTranslator = {
  en: (descriptor: IPersonAppearance): string => {
    const { person_appearance: pa } = descriptor
    if (!pa) return ''

    const parts: string[] = []

    // Basic Info
    const basicInfoParts = [
      `A portrait of ${pa.basic_info.name}`,
      pa.basic_info.nickname ? `(known as ${pa.basic_info.nickname})` : '',
      `, a ${pa.basic_info.perceived_age}-year-old ${pa.basic_info.ethnicity} ${pa.basic_info.gender}.`,
    ]
    parts.push(basicInfoParts.filter(Boolean).join(' '))

    // Face and Head
    const faceParts: string[] = []
    if (pa.head_and_face.face_shape) {
      faceParts.push(`a ${pa.head_and_face.face_shape} face shape`)
    }
    if (pa.head_and_face.skin.tone) {
      faceParts.push(`with ${pa.head_and_face.skin.tone} skin`)
    }
    if (pa.head_and_face.skin.texture) {
      faceParts.push(`which has a ${pa.head_and_face.skin.texture} texture`)
    }
    if (pa.head_and_face.skin.makeup) {
      faceParts.push(`wearing ${pa.head_and_face.skin.makeup} makeup`)
    }
    if (faceParts.length > 0) {
      parts.push(`She has ${faceParts.join(', ')}.`)
    }

    // Hair
    const hairParts: string[] = []
    hairParts.push(
      `${pa.head_and_face.hair.length} ${pa.head_and_face.hair.style} hair in a ${pa.head_and_face.hair.color} color`,
    )
    if (pa.head_and_face.hair.bangs === false) {
      hairParts.push('with no bangs')
    } else if (pa.head_and_face.hair.bangs === true) {
      hairParts.push('with bangs')
    }
    if (pa.head_and_face.hair.description) {
      hairParts.push(`(${pa.head_and_face.hair.description})`)
    }
    parts.push(`Her hair is ${hairParts.join(' ')}.`)

    // Eyes
    const eyeParts: string[] = []
    eyeParts.push(
      `${pa.head_and_face.eyes.shape}-shaped, ${pa.head_and_face.eyes.color} eyes`,
    )
    if (pa.head_and_face.eyes.description) {
      eyeParts.push(`that look ${pa.head_and_face.eyes.description}`)
    }
    if (pa.head_and_face.eyes.glasses?.is_wearing) {
      eyeParts.push(
        `She is wearing ${pa.head_and_face.eyes.glasses.style || 'glasses'}.`,
      )
    }
    parts.push(`She has ${eyeParts.join(' ')}.`)

    // Facial Hair
    if (pa.head_and_face.facial_hair?.has_hair) {
      parts.push(
        `She has ${pa.head_and_face.facial_hair.style || 'facial hair'}.`,
      )
    }

    // Body
    const bodyParts: string[] = []
    if (pa.body.height.value) {
      const heightDesc = pa.body.height.description
        ? ` (${pa.body.height.description})`
        : ''
      bodyParts.push(
        `a height of ${pa.body.height.value}${pa.body.height.unit}${heightDesc}`,
      )
    }
    if (pa.body.build) {
      bodyParts.push(`a ${pa.body.build} build`)
    }
    if (pa.body.posture) {
      bodyParts.push(`and ${pa.body.posture} posture`)
    }
    if (bodyParts.length > 0) {
      parts.push(`Her physique is characterized by ${bodyParts.join(', ')}.`)
    }

    // Clothing
    parts.push(
      `Her clothing style is ${pa.clothing_and_accessories.style_vibe}.`,
    )
    const clothingItems: string[] = []
    if (pa.clothing_and_accessories.top) {
      const topParts = [
        pa.clothing_and_accessories.top.color,
        pa.clothing_and_accessories.top.pattern,
        pa.clothing_and_accessories.top.type,
      ]
      clothingItems.push(topParts.filter(Boolean).join(' '))
    }
    if (pa.clothing_and_accessories.bottom) {
      const bottomParts = [
        pa.clothing_and_accessories.bottom.color,
        pa.clothing_and_accessories.bottom.length,
        pa.clothing_and_accessories.bottom.type,
      ]
      clothingItems.push(bottomParts.filter(Boolean).join(' '))
    }
    if (pa.clothing_and_accessories.footwear) {
      clothingItems.push(
        `with ${pa.clothing_and_accessories.footwear.color} ${pa.clothing_and_accessories.footwear.type}`,
      )
    }
    if (clothingItems.length > 0) {
      parts.push(`She is wearing ${clothingItems.join(', ')}.`)
    }

    // Accessories
    if (
      pa.clothing_and_accessories.accessories &&
      pa.clothing_and_accessories.accessories.length > 0
    ) {
      parts.push(
        `Accessorized with: ${pa.clothing_and_accessories.accessories.join(', ')}.`,
      )
    }

    // Distinguishing Marks
    if (pa.distinguishing_marks && pa.distinguishing_marks.length > 0) {
      const marks = pa.distinguishing_marks
        .map((m) => `${m.type} (${m.description}) on her ${m.location}`)
        .join(', ')
      parts.push(`Notable features include: ${marks}.`)
    }

    // Expression and Mood
    parts.push(
      `Her expression is ${pa.expression_and_mood.primary_emotion}, with a ${pa.expression_and_mood.description}.`,
    )

    // Combine all parts into a single, coherent prompt.
    const finalPrompt = [
      'A high-quality, detailed portrait of',
      parts.join(' '),
      'in a realistic, everyday life scene,',
      'Style:',
      pa.clothing_and_accessories.style_vibe,
      'hyperrealistic, soft skin, micro-details,',
      'subtle asymmetry, slight imperfections, natural skin texture, pores,',
      'soft natural lighting, shallow depth of field,',
      'clean and sharp focus, extremely high detail, 8k.',
      'shot on a Leica M6 with a 50mm f/1.4 lens,',
    ].join(' ')

    return finalPrompt
  },
  zh: (descriptor: IPersonAppearance): string => {
    const { person_appearance: pa } = descriptor
    if (!pa) return ''

    const parts: string[] = []

    // Basic Info
    const basicInfoParts = [
      `${pa.basic_info.name}的专业照片`,
      pa.basic_info.nickname ? `(人称“${pa.basic_info.nickname}”)` : '',
      `，一位${pa.basic_info.perceived_age}岁的${pa.basic_info.ethnicity}${pa.basic_info.gender}。`,
    ]
    parts.push(basicInfoParts.filter(Boolean).join(''))

    // Face and Head
    const faceParts: string[] = []
    if (pa.head_and_face.face_shape) {
      faceParts.push(`脸型为${pa.head_and_face.face_shape}`)
    }
    if (pa.head_and_face.skin.tone) {
      faceParts.push(`肤色是${pa.head_and_face.skin.tone}`)
    }
    if (pa.head_and_face.skin.texture) {
      faceParts.push(`皮肤纹理为${pa.head_and_face.skin.texture}`)
    }
    if (pa.head_and_face.skin.makeup) {
      faceParts.push(`化着${pa.head_and_face.skin.makeup}妆`)
    }
    if (faceParts.length > 0) {
      parts.push(`她${faceParts.join('，')}。`)
    }

    // Hair
    const hairParts: string[] = []
    hairParts.push(
      `有着${pa.head_and_face.hair.color}的${pa.head_and_face.hair.length}${pa.head_and_face.hair.style}发型`,
    )
    if (pa.head_and_face.hair.bangs === false) {
      hairParts.push('没有刘海')
    } else if (pa.head_and_face.hair.bangs === true) {
      hairParts.push('有刘海')
    }
    if (pa.head_and_face.hair.description) {
      hairParts.push(`(${pa.head_and_face.hair.description})`)
    }
    parts.push(`她的头发${hairParts.join(' ')}。`)

    // Eyes
    const eyeParts: string[] = []
    eyeParts.push(
      `${pa.head_and_face.eyes.shape}的${pa.head_and_face.eyes.color}眼睛`,
    )
    if (pa.head_and_face.eyes.description) {
      eyeParts.push(`眼神${pa.head_and_face.eyes.description}`)
    }
    if (pa.head_and_face.eyes.glasses?.is_wearing) {
      eyeParts.push(`戴着${pa.head_and_face.eyes.glasses.style || '眼镜'}。`)
    }
    parts.push(`她有${eyeParts.join('，')}。`)

    // Facial Hair
    if (pa.head_and_face.facial_hair?.has_hair) {
      parts.push(`她有${pa.head_and_face.facial_hair.style || '面部毛发'}。`)
    }

    // Body
    const bodyParts: string[] = []
    if (pa.body.height.value) {
      const heightDesc = pa.body.height.description
        ? ` (${pa.body.height.description})`
        : ''
      bodyParts.push(
        `身高${pa.body.height.value}${pa.body.height.unit}${heightDesc}`,
      )
    }
    if (pa.body.build) {
      bodyParts.push(`身材${pa.body.build}`)
    }
    if (pa.body.posture) {
      bodyParts.push(`姿态${pa.body.posture}`)
    }
    if (bodyParts.length > 0) {
      parts.push(`她的体格特征是${bodyParts.join('，')}。`)
    }

    // Clothing
    parts.push(`她的穿着风格是${pa.clothing_and_accessories.style_vibe}。`)
    const clothingItems: string[] = []
    if (pa.clothing_and_accessories.top) {
      const topParts = [
        pa.clothing_and_accessories.top.color,
        pa.clothing_and_accessories.top.pattern,
        pa.clothing_and_accessories.top.type,
      ]
      clothingItems.push(`一件${topParts.filter(Boolean).join('的')}`)
    }
    if (pa.clothing_and_accessories.bottom) {
      const bottomParts = [
        pa.clothing_and_accessories.bottom.color,
        pa.clothing_and_accessories.bottom.length,
        pa.clothing_and_accessories.bottom.type,
      ]
      clothingItems.push(`一条${bottomParts.filter(Boolean).join('的')}`)
    }
    if (pa.clothing_and_accessories.footwear) {
      clothingItems.push(
        `配上${pa.clothing_and_accessories.footwear.color}的${pa.clothing_and_accessories.footwear.type}`,
      )
    }
    if (clothingItems.length > 0) {
      parts.push(`她穿着${clothingItems.join('，')}。`)
    }

    // Accessories
    if (
      pa.clothing_and_accessories.accessories &&
      pa.clothing_and_accessories.accessories.length > 0
    ) {
      parts.push(
        `配饰有：${pa.clothing_and_accessories.accessories.join('，')}。`,
      )
    }

    // Distinguishing Marks
    if (pa.distinguishing_marks && pa.distinguishing_marks.length > 0) {
      const marks = pa.distinguishing_marks
        .map((m) => `位于${m.location}的${m.type}(${m.description})`)
        .join('，')
      parts.push(`显著特征包括：${marks}。`)
    }

    // Expression and Mood
    parts.push(
      `她的表情是${pa.expression_and_mood.primary_emotion}，带着${pa.expression_and_mood.description}的神态。`,
    )

    // Combine all parts into a single, coherent prompt.
    // Combine all parts into a single, coherent prompt.
    const finalPrompt = [
      '一张高质量、细节丰富的半身人像特写, 在真实的生活场景中, 主体是',
      parts.join(' '),
      '风格:',
      pa.clothing_and_accessories.style_vibe,
      '超写实, 柔软的皮肤, 微观细节,',
      '微妙的不对称, 轻微的瑕疵, 自然的皮肤纹理, 真实的毛孔,',
      '柔和的自然光线, 浅景深,',
      '焦点清晰锐利, 极高细节, 8K分辨率,',
      '使用 Leica M6 相机和 50mm f/1.4 镜头拍摄,',
    ].join(' ')
    return finalPrompt
  },
}
