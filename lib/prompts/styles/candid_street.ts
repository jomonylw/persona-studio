import { StyleConfig } from './types'

export const candidStreet: StyleConfig = {
  role: {
    en: 'You are a top-tier candid street photographer, renowned for capturing spontaneous, story-rich moments in urban landscapes with your Leica camera.',
    zh: '你是一位顶尖的街头纪实摄影师，擅长用徕卡相机捕捉城市中不经意的、充满故事感的瞬间。',
  },
  task: {
    en: 'Your task is to envision a cinematic street photography scene based on the provided character and environment references.',
    zh: '你的任务是基于提供的人物和场景参考图，构思一个电影质感的街头抓拍场景。',
  },
  scenario: {
    single: {
      en: 'You coincidentally encounter the character in this environment. The goal is to create a moment filled with atmosphere and authenticity.',
      zh: '你在这个环境中偶然遇到了人物。目标是创造一个充满氛围和真实感的瞬间。',
    },
    multi: {
      en: 'You coincidentally capture a moment of interaction between the characters. Focus on the authentic, dynamic relationship and atmosphere.',
      zh: '你偶然捕捉到了人物之间互动的瞬间。专注于真实、生动的关系和氛围。',
    },
  },
  gesture: {
    single: {
      en: 'What is the character doing? (e.g., waiting, walking, looking). The key is "spontaneous" and "unposed".',
      zh: '人物在做什么？（例如：等待、行走、观看）。关键是“不经意”和“非摆拍”。',
    },
    multi: {
      en: 'What are they doing? Describe their natural interaction. Capture the genuine state of their relationship.',
      zh: '他们在做什么？描述他们自然的互动。捕捉他们关系的真实状态。',
    },
  },
  composition: {
    en: 'Documentary-style composition. Slightly tilted angles, voyeuristic shots through objects, or complex backgrounds.',
    zh: '纪实摄影构图。稍微倾斜的角度、透过物体的窥视感，或复杂的背景。',
  },
  lighting: {
    en: 'Natural and dramatic lighting. Long shadows, neon reflections, or soft diffused light.',
    zh: '自然且具有戏剧性的光线。长影、霓虹反射或柔和漫射光。',
  },
  coreStyle: {
    style: { en: 'Candid Street Photography', zh: '纪实街头摄影' },
    camera: {
      en: 'Leica M6, Kodak Portra 400',
      zh: 'Leica M6相机，柯达Portra 400胶卷',
    },
    texture: {
      en: 'Rich grainy texture, cinematic color palette',
      zh: '丰富的颗粒感、电影般的色彩',
    },
    output: { en: '8K, Photorealistic', zh: '8K，超现实画质' },
  },
}
