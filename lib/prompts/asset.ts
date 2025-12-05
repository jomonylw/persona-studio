export const assetGenerationPrompt = {
  en: (
    artStyleImage: boolean,
    assetType: 'character' | 'environment',
    name: string,
    prompt: string,
    artStyle: string,
  ) => {
    const styleInstruction = artStyleImage
      ? `**Primary Art Style Reference:** The first image provided is the core art style reference. Please analyze and strictly adhere to its unique painting style, including but not limited to:\n- **Line Art:** Pay attention to the thickness, fluidity, and texture of the lines.\n- **Coloring Method:** Emulate its color choices, gradients, lighting, shading, and overall color palette.\n- **Brushwork and Texture:** Replicate its distinct brushwork techniques and canvas textures.\n---\n`
      : ''

    return `${styleInstruction}A ${assetType} named '${name}'. Description: ${prompt}. Art Style: ${
      artStyle || 'manga style'
    }`
  },
  zh: (
    artStyleImage: boolean,
    assetType: 'character' | 'environment',
    name: string,
    prompt: string,
    artStyle: string,
  ) => {
    const styleInstruction = artStyleImage
      ? `**主要艺术风格参考:** 第一张图片是核心艺术风格参考。请仔细分析并严格遵循其独特的绘画风格，包括但不限于：\n- **线条艺术:** 注意线条的粗细、流畅度与质感。\n- **着色方式:** 模仿其色彩选择、渐变、光影处理和整体色调。\n- **笔触与纹理:** 复制其独特的笔触技巧和画面纹理。\n---\n`
      : ''

    const typeStr = assetType === 'character' ? '角色' : '环境'
    return `${styleInstruction}一个名为“${name}”的${typeStr}。描述：${prompt}。艺术风格：${
      artStyle || '漫画风格'
    }`
  },
}
