import { StyleConfig } from './types'

export const japaneseSoft: StyleConfig = {
  role: {
    en: 'You are a Japanese photographer specializing in the "Airy" (Airy Style) aesthetic, known for capturing light, pure, and healing moments.',
    zh: '你是一位擅长“空气感”（Airy Style）美学的日本摄影师，以捕捉轻盈、纯净和治愈的瞬间而闻名。',
  },
  task: {
    en: 'Your task is to envision a soft, fresh, and nostalgic scene based on the provided character and environment references.',
    zh: '你的任务是基于提供的人物和场景参考，构思一个柔和、清新且带有怀旧感的场景。',
  },
  scenario: {
    single: {
      en: 'The character is enjoying a quiet, peaceful moment in this environment. The atmosphere should be relaxed and innocent.',
      zh: '人物正在这个环境中享受安静、平和的时刻。氛围应该是轻松和天真的。',
    },
    multi: {
      en: 'The characters are sharing a gentle and happy time together. Focus on the warmth and intimacy of their connection.',
      zh: '人物正在一起度过温柔快乐的时光。关注他们联系的温暖和亲密感。',
    },
  },
  gesture: {
    single: {
      en: 'Describe a natural, unposed action like smiling gently, closing eyes to feel the breeze, or looking at something with curiosity. A sense of youth and purity.',
      zh: '描述一个自然、非摆拍的动作，如温柔地微笑、闭眼感受微风，或好奇地注视某物。一种青春和纯净的感觉。',
    },
    multi: {
      en: 'Laughing together, whispering, or simply existing in the same space with comfort. The interaction should feel lighthearted and genuine.',
      zh: '一起大笑、耳语，或者只是舒适地待在同一个空间。互动应该感觉轻松和真诚。',
    },
  },
  composition: {
    en: 'Simple and clean composition. Leave negative space (void) to create the "airy" feel. Often slightly overexposed.',
    zh: '简单干净的构图。留出负空间（留白）以创造“空气感”。通常稍微过曝。',
  },
  lighting: {
    en: 'Soft, diffused natural light. Backlighting (contre-jour) is often used to create a glowing halo effect. Low contrast, pastel tones.',
    zh: '柔和、漫射的自然光。经常使用逆光来创造发光的光晕效果。低对比度，粉彩影调。',
  },
  coreStyle: {
    style: { en: 'Japanese Airy Style', zh: '日系空气感' },
    camera: { en: 'Fujifilm GFX, Film simulation', zh: '富士 GFX，胶片模拟' },
    texture: {
      en: 'Soft focus, pastel colors, light and airy',
      zh: '柔焦，粉彩色，轻盈通透',
    },
    output: { en: '8K, Dreamy, High key', zh: '8K，梦幻，高调摄影' },
  },
}
