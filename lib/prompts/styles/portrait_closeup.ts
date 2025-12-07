import { StyleConfig } from './types'

export const portraitCloseup: StyleConfig = {
  role: {
    en: 'You are a portrait photographer specializing in capturing intimate and expressive close-up shots.',
    zh: '你是一位专门拍摄亲密且富有表现力的特写镜头的人像摄影师。',
  },
  task: {
    en: 'Your task is to envision a powerful and emotional close-up portrait based on the provided character and environment references.',
    zh: '你的任务是基于提供的人物和场景参考，构思一张富有感染力和情感的特写肖像。',
  },
  scenario: {
    single: {
      en: 'The character is in a moment of introspection or emotional expression. The environment is secondary, serving to enhance the mood.',
      zh: '人物正处于自省或情感表达的瞬间。环境是次要的，仅用于增强氛围。',
    },
    multi: {
      en: 'The characters are sharing an intimate moment, their faces close together, conveying a strong emotional connection.',
      zh: '人物正在分享一个亲密的时刻，他们的脸庞靠得很近，传达出一种强烈的情感联系。',
    },
  },
  gesture: {
    single: {
      en: 'Subtle facial expressions are key. A slight smile, a thoughtful gaze, a single tear. Minimal body language.',
      zh: '微妙的面部表情是关键。一丝微笑、沉思的凝视、一颗眼泪。身体语言极少。',
    },
    multi: {
      en: 'A gentle touch, a shared gaze, heads tilted towards each other. The interaction is subtle yet powerful.',
      zh: '轻柔的触摸、共同的凝视、头向彼此倾斜。互动微妙而有力。',
    },
  },
  composition: {
    en: 'Extreme close-up or close-up. The frame is tightly focused on the face or part of the face. Eyes are often the central focus. Asymmetrical framing.',
    zh: '大特写或特写。画面紧凑地聚焦于面部或面部的一部分。眼睛通常是中心焦点。不对称构图。',
  },
  lighting: {
    en: 'Natural or soft studio light that accentuates facial features and creates a specific mood. Soft shadows and gentle highlights.',
    zh: '自然光或柔和的影棚光，突显面部特征并营造特定氛围。柔和的阴影和温和的高光。',
  },
  coreStyle: {
    style: { en: 'Intimate Portrait Closeup', zh: '私密人像特写' },
    camera: {
      en: 'Sony A7R IV, 100mm Macro Lens',
      zh: '索尼 A7R IV，100mm 微距镜头',
    },
    texture: {
      en: 'Detailed skin texture, sharp focus on eyes, soft bokeh, emotional depth',
      zh: '细腻的皮肤纹理，锐利的眼部对焦，柔和的散景，富有情感深度',
    },
    output: {
      en: 'Expressive, Intimate, Emotional',
      zh: '富有表现力，亲密，情感丰富',
    },
  },
}
