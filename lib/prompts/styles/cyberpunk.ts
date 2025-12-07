import { StyleConfig } from './types'

export const cyberpunk: StyleConfig = {
  role: {
    en: 'You are a visionary photographer capturing the dystopian yet mesmerizing beauty of a futuristic, high-tech world.',
    zh: '你是一位富有远见的摄影师，捕捉未来主义、高科技世界中反乌托邦却又迷人的美。',
  },
  task: {
    en: 'Your task is to envision a cyberpunk scene filled with neon lights and urban grit based on the provided character and environment references.',
    zh: '你的任务是基于提供的人物和场景参考，构思一个充满霓虹灯和城市砂砾感的赛博朋克场景。',
  },
  scenario: {
    single: {
      en: 'The character is a denizen of this high-tech city, perhaps a hacker, a mercenary, or a lonely soul navigating the neon streets.',
      zh: '人物是这座高科技城市的居民，可能是黑客、雇佣兵，或者是游荡在霓虹街道上的孤独灵魂。',
    },
    multi: {
      en: 'The characters are partners or rivals in this futuristic setting. Focus on the edgy and tense atmosphere around them.',
      zh: '人物是这个未来设定中的搭档或对手。关注他们周围前卫和紧张的氛围。',
    },
  },
  gesture: {
    single: {
      en: 'Cool, guarded, or intense poses. Interacting with technology or looking warily at the surroundings. Rain-soaked or illuminated by neon signs.',
      zh: '酷、戒备或激烈的姿势。与科技互动或警惕地观察周围环境。被雨水淋湿或被霓虹灯照亮。',
    },
    multi: {
      en: 'Exchange of data, a standoff, or planning a heist. The interaction should feel purposeful and part of the gritty underworld.',
      zh: '交换数据、对峙或策划行动。互动应该感觉有目的性，属于这个坚韧的地下世界。',
    },
  },
  composition: {
    en: 'Complex, layered composition. Use reflections in puddles or glass. High contrast between deep shadows and bright light sources.',
    zh: '复杂、分层的构图。利用水坑或玻璃的反射。深邃阴影与明亮光源之间的高对比度。',
  },
  lighting: {
    en: 'Artificial lighting. Neon pinks, blues, and purples. Hard, directional light. Bloom effects from light sources.',
    zh: '人造光。霓虹粉、蓝和紫。硬质定向光。光源的泛光（Bloom）效果。',
  },
  coreStyle: {
    style: { en: 'Cyberpunk Photography', zh: '赛博朋克摄影' },
    camera: {
      en: 'Sony A7S III, Night photography',
      zh: '索尼 A7S III，夜景摄影',
    },
    texture: {
      en: 'Digital noise, sharp details, vibrant neon colors',
      zh: '数码噪点，锐利细节，鲜艳霓虹色',
    },
    output: { en: '8K, Futuristic, Hyper-detailed', zh: '8K，未来感，超精细' },
  },
}
