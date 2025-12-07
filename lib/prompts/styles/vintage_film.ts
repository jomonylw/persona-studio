import { StyleConfig } from './types'

export const vintageFilm: StyleConfig = {
  role: {
    en: 'You are a nostalgic photographer using vintage cameras to capture memories that feel like they belong to a family album from the 90s.',
    zh: '你是一位怀旧摄影师，使用老式相机捕捉感觉像是属于90年代家庭相册的记忆。',
  },
  task: {
    en: 'Your task is to envision a retro, lo-fi, and sentimental scene based on the provided character and environment references.',
    zh: '你的任务是基于提供的人物和场景参考，构思一个复古、低保真且充满情感的场景。',
  },
  scenario: {
    single: {
      en: 'A candid snapshot of the character from the past. It feels personal, imperfect, and full of memory.',
      zh: '人物过去的一张抓拍快照。感觉私人、不完美且充满回忆。',
    },
    multi: {
      en: 'A group photo or a candid moment between friends/family. It captures the raw connection and the vibe of a specific era.',
      zh: '一张合影或朋友/家人之间的抓拍瞬间。捕捉原始的联系和特定时代的氛围。',
    },
  },
  gesture: {
    single: {
      en: 'Looking at the camera with a genuine smile, or caught off guard. Peace signs, awkward poses, or completely natural relaxation.',
      zh: '带着真诚的微笑看着镜头，或者猝不及防被拍到。比耶、尴尬的姿势或完全自然的放松。',
    },
    multi: {
      en: 'Hugging, playing, or posing awkwardly together. The focus is on the "snapshot" aesthetic, not perfection.',
      zh: '拥抱、打闹或尴尬地一起摆姿势。重点是“快照”美学，而不是完美。',
    },
  },
  composition: {
    en: 'Imperfect composition. Maybe slightly blurry, centered subjects, or flash photography style. Feels authentic and amateur in a charming way.',
    zh: '不完美的构图。可能稍微模糊、主体居中或闪光灯摄影风格。以一种迷人的方式感觉真实和业余。',
  },
  lighting: {
    en: 'Direct flash, harsh sunlight, or warm tungsten indoors. Light leaks and vignetting are common.',
    zh: '直射闪光灯、强烈的阳光或室内温暖的钨丝灯。漏光和暗角很常见。',
  },
  coreStyle: {
    style: { en: 'Vintage Film Snapshot', zh: '复古胶片快照' },
    camera: {
      en: 'Polaroid, Disposable Camera, VHS effect',
      zh: '宝丽来，一次性相机，VHS 效果',
    },
    texture: {
      en: 'Heavy grain, color shifts, faded tones, light leaks',
      zh: '重颗粒，色偏，褪色色调，漏光',
    },
    output: {
      en: 'Lo-fi aesthetic, Nostalgic, Authentic',
      zh: '低保真美学，怀旧，真实',
    },
  },
}
