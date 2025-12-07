export const environmentPrompt = {
  en: (prompt: string) =>
    [
      'A hyper-realistic raw photograph of an environment,',
      `"${prompt}"`,
      ', shot on a Sony A7R IV camera with a 35mm lens, f/8 aperture. Ultra-detailed raw photography, ISO 100, natural lighting. The image features high dynamic range, authentic surface textures, and realistic details. 8k resolution, sharp focus. NOT a painting, NOT a 3d render, NOT an illustration, no digital art style, no blur.',
    ].join(' '),
  zh: (prompt: string) =>
    [
      '一张超写实的环境摄影原片，',
      `“${prompt}”`,
      '，由索尼 Sony A7R IV 相机拍摄，搭配 35mm 镜头，f/8 光圈。超精细摄影原片，ISO 100，自然光线。画面具有高动态范围、真实的表面纹理和逼真的细节。8K分辨率，全焦清晰。严禁绘画风格，严禁3D渲染感，严禁插画风格，无数字艺术感，无模糊。',
    ].join(' '),
}
