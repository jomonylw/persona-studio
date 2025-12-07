import { StyleConfig } from './types'

export const selfie: StyleConfig = {
  role: {
    en: 'You are an expert in social media aesthetics, specializing in capturing authentic, engaging, and high-quality selfies that tell a story.',
    zh: '你是一位社交媒体美学专家，擅长捕捉真实、迷人且高质量的自拍，并通过自拍讲述故事。',
  },
  task: {
    en: 'Your task is to envision a natural yet stylized selfie based on the provided character and environment references.',
    zh: '你的任务是基于提供的人物和场景参考，构思一张自然但有风格的自拍。',
  },
  scenario: {
    single: {
      en: 'The character is taking a selfie to document their presence in this environment. It feels personal and direct.',
      zh: '人物正在自拍以记录他们在这个环境中的存在。感觉私人且直接。',
    },
    multi: {
      en: 'The characters are taking a group selfie (we-fie) together. Focus on their closeness and the shared memory.',
      zh: '人物正在一起拍合影自拍。关注他们的亲密感和共同的记忆。',
    },
  },
  gesture: {
    single: {
      en: 'Looking directly into the lens, holding the phone with one hand extended. The frame implies a slight handheld shake or tilt, capturing a spontaneous and authentic moment.',
      zh: '直视镜头，单手伸展手持手机自拍。画面暗示了轻微的手持抖动或倾斜，捕捉自发和真实的瞬间。',
    },
    multi: {
      en: 'One character holds the phone with one hand for a group shot. Heads close together. The composition feels naturally unstable, like a quick snapshot.',
      zh: '其中一人单手手持手机拍摄合影。头靠得很近。构图感觉自然且带有一点不稳定，像是一个快速抓拍的快照。',
    },
  },
  composition: {
    en: 'Wide-angle or slight fisheye distortion typical of front-facing cameras. The subject dominates the foreground, with the environment visible in the background.',
    zh: '典型的前置摄像头广角或轻微鱼眼畸变。主体占据前景主导地位，环境在背景中可见。',
  },
  lighting: {
    en: 'Natural light and environmental light, avoiding artificial studio lighting. Soft daylight or ambient light from the surroundings that fits the scene naturally.',
    zh: '自然光及环境光，非人工布光。使用柔和的日光或场景中的环境光，确保光感自然真实。',
  },
  coreStyle: {
    style: { en: 'Social Media Selfie', zh: '社交媒体自拍' },
    camera: {
      en: 'iPhone Front Camera, High Quality',
      zh: 'iPhone 前置摄像头，高质量',
    },
    texture: {
      en: 'Sharp eyes, slight motion blur or handheld shake, vibrant digital colors',
      zh: '眼部清晰，带有轻微动态模糊或手持抖动感，鲜艳的数码色彩',
    },
    output: {
      en: 'Authentic Handheld Selfie, Personal, Engaging',
      zh: '真实手持自拍，私人，迷人',
    },
  },
}
