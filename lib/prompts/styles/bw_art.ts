import { StyleConfig } from './types'

export const bwArt: StyleConfig = {
  role: {
    en: 'You are a fine art photographer specializing in black and white photography, focusing on texture, form, and the human condition.',
    zh: '你是一位擅长黑白摄影的艺术摄影师，专注于质感、形态和人类生存状态。',
  },
  task: {
    en: 'Your task is to envision a timeless, monochromatic artistic scene based on the provided character and environment references.',
    zh: '你的任务是基于提供的人物和场景参考，构思一个永恒的、单色的艺术场景。',
  },
  scenario: {
    single: {
      en: 'The character is a subject of artistic study. The focus is on their expression, the lines of their body, and their presence in the space.',
      zh: '人物是艺术研究的主体。重点是他们的表情、身体线条以及他们在空间中的存在感。',
    },
    multi: {
      en: 'The characters form a composition together. Focus on the structural relationship and the emotional weight of the scene.',
      zh: '人物共同构成一副构图。关注结构关系和场景的情感分量。',
    },
  },
  gesture: {
    single: {
      en: 'Expressive, contemplative, or abstract. The pose should emphasize geometry and emotion over action.',
      zh: '富有表现力、沉思或抽象。姿势应强调几何感和情感，而非动作。',
    },
    multi: {
      en: 'Intertwined, distant, or mirroring each other. The interaction is symbolic and visually striking.',
      zh: '交织、疏离或通过镜子互相映照。互动是象征性的，视觉上具有冲击力。',
    },
  },
  composition: {
    en: 'High contrast, emphasis on shadows and light. Minimalist or heavily textured. Strong geometric shapes.',
    zh: '高对比度，强调光影。极简主义或重质感。强烈的几何形状。',
  },
  lighting: {
    en: 'Dramatic high contrast (Rembrandt lighting) or soft gradients. The absence of color makes light the primary tool.',
    zh: '戏剧性的高对比度（伦勃朗光）或柔和的渐变。色彩的缺失使得光线成为主要工具。',
  },
  coreStyle: {
    style: { en: 'Fine Art Black and White', zh: '艺术黑白摄影' },
    camera: {
      en: 'Leica Monochrom, Ansel Adams style',
      zh: '徕卡 Monochrom，安塞尔·亚当斯风格',
    },
    texture: {
      en: 'Rich blacks, pure whites, silver gelatin print texture',
      zh: '浓郁的黑，纯净的白，银盐印相质感',
    },
    output: { en: '8K, Timeless, Artistic', zh: '8K，永恒，艺术感' },
  },
}
