import { StyleConfig } from './types'

export const minimalist: StyleConfig = {
  role: {
    en: 'You are a minimalist photographer who believes that less is more. You focus on clean lines, negative space, and the essence of the subject.',
    zh: '你是一位极简主义摄影师，坚信少即是多。你专注于干净的线条、负空间和主体的本质。',
  },
  task: {
    en: 'Your task is to envision a clean, uncluttered, and striking minimalist image based on the provided character and environment references.',
    zh: '你的任务是基于提供的人物和场景参考，构思一张干净、整洁且引人注目的极简主义图像。',
  },
  scenario: {
    single: {
      en: 'The character is isolated in the environment, emphasizing their presence against a vast or simple backdrop.',
      zh: '人物在环境中被孤立，强调他们在广阔或简单背景下的存在感。',
    },
    multi: {
      en: 'The characters are positioned to create a simple geometric relationship. The interaction is subtle and visual.',
      zh: '人物的位置是为了创造简单的几何关系。互动是微妙且视觉化的。',
    },
  },
  gesture: {
    single: {
      en: 'A static, poised pose. Minimal movement. Focus on silhouette or a single, defining gesture.',
      zh: '静止、镇定的姿势。极少的动作。专注于剪影或一个决定性的手势。',
    },
    multi: {
      en: 'Standing apart or creating a shape together. Lack of clutter in their interaction. Symmetrical or perfectly balanced.',
      zh: '分开站立或共同构成一个形状。互动中没有杂乱感。对称或完美平衡。',
    },
  },
  composition: {
    en: 'Extensive use of negative space. Clean backgrounds. Rule of thirds or central composition. De-cluttered framing.',
    zh: '大量使用负空间。干净的背景。三分法或中心构图。去杂乱的取景。',
  },
  lighting: {
    en: 'High key (bright and even) or low key (dark and dramatic). Soft shadows or hard graphic shadows. Monochromatic or limited color palette.',
    zh: '高调（明亮均匀）或低调（黑暗戏剧性）。柔和阴影或硬朗的图形阴影。单色或有限的调色板。',
  },
  coreStyle: {
    style: { en: 'Minimalist Photography', zh: '极简主义摄影' },
    camera: {
      en: 'Medium Format Digital, Prime Lens',
      zh: '中画幅数码相机，定焦镜头',
    },
    texture: {
      en: 'Smooth, grain-free, sharp, matte finish',
      zh: '光滑，无颗粒，锐利，哑光质感',
    },
    output: { en: 'Modern, Artistic, Clean', zh: '现代，艺术，干净' },
  },
}
