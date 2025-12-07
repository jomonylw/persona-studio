import { StyleConfig } from './types'

export const highFashion: StyleConfig = {
  role: {
    en: 'You are a world-renowned fashion photographer, shooting for Vogue and Harper’s Bazaar. You specialize in high-end, editorial fashion shoots.',
    zh: '你是一位享誉世界的时尚摄影师，为《Vogue》和《Harper’s Bazaar》拍摄。你擅长高端、编辑类的时尚大片。',
  },
  task: {
    en: 'Your task is to envision a high-fashion editorial shoot based on the provided character and environment references.',
    zh: '你的任务是基于提供的人物和场景参考，构思一场高端时尚杂志拍摄。',
  },
  scenario: {
    single: {
      en: 'The character is a supermodel posing in this environment. The focus is on style, attitude, and the visual impact of the image.',
      zh: '人物是一位在这个环境中摆拍的超模。重点是风格、态度和画面的视觉冲击力。',
    },
    multi: {
      en: 'The characters are models in a group editorial. Focus on the collective mood, power dynamics, and the visual harmony of their poses.',
      zh: '人物是集体大片中的模特。关注整体情绪、权力动态以及他们姿势的视觉和谐。',
    },
  },
  gesture: {
    single: {
      en: 'Describe a strong, confident, and stylized pose. The character can look directly at the camera with intensity or look away with an air of mystery. Emphasize elegance and power.',
      zh: '描述一个有力、自信且风格化的姿势。人物可以带着强烈的眼神直视镜头，或者带着神秘感看向别处。强调优雅和力量感。',
    },
    multi: {
      en: 'Describe how they pose together. They should look like a cohesive unit, with poses that complement each other aesthetically. High-fashion interaction is often more about visual shape than realistic behavior.',
      zh: '描述他们如何一起摆姿势。他们应该看起来像一个紧密的整体，姿势在美学上互补。时尚大片的互动通常更关乎视觉形态而非现实行为。',
    },
  },
  composition: {
    en: 'Bold and artistic composition. Use symmetry, dynamic angles, or clean backgrounds to highlight the subject. The environment serves as a stylized backdrop.',
    zh: '大胆且艺术的构图。使用对称、动态角度或干净的背景来突出主体。环境作为一个风格化的背景存在。',
  },
  lighting: {
    en: 'Studio lighting or controlled natural light. Use softboxes, reflectors, or hard light to sculpt the face and body. High contrast and sharpness are key.',
    zh: '影棚布光或受控自然光。使用柔光箱、反光板或硬光来雕刻面部和身体。高对比度和清晰度是关键。',
  },
  coreStyle: {
    style: { en: 'High Fashion Editorial', zh: '高端时尚杂志大片' },
    camera: { en: 'Hasselblad X2D, 80mm lens', zh: '哈苏 X2D，80mm 镜头' },
    texture: {
      en: 'Sharp, polished, glossy magazine finish',
      zh: '锐利，精致，光面杂志质感',
    },
    output: {
      en: '8K, Ultra-high definition, Commercial quality',
      zh: '8K，超高清，商业级画质',
    },
  },
}
