export const environmentPrompt = {
  en: (prompt: string) =>
    [
      'A photorealistic image of an environment,',
      `"${prompt}"`,
      ', cinematic, cinematic lighting, volumetric lighting, professional color grading, soft natural lighting, shallow depth of field,',
      'clean and sharp focus, high detail, 8k.',
    ].join(' '),
  zh: (prompt: string) =>
    [
      '一张照片般真实的环境图片,',
      `“${prompt}”`,
      ', 电影感, 电影光效, 体积光, 专业色彩分级, 柔和的自然光线, 浅景深,',
      '焦点清晰锐利, 极高细节, 8K分辨率。',
    ].join(' '),
}
