import { StyleConfig } from './types'

export const fujiInstax: StyleConfig = {
  role: {
    en: 'You are a professional photographer specializing in Fuji Instax instant film photography.',
    zh: '你是一位专门从事富士 Instax 立拍得胶片摄影的专业摄影师。',
  },
  task: {
    en: 'Your task is to generate a photo that perfectly captures the Fuji Instax aesthetic. The image should feature the signature high-contrast, direct-flash look. Pay close attention to the hard lighting, distinct color grading with greenish shadows, and the physical imperfections that give Instax photos their unique, tangible charm.',
    zh: '你的任务是生成一张完美捕捉富士 Instax 美学的照片。图像应该具有标志性的高对比度、直闪外观。请密切关注硬光、带有绿色阴影的独特颜色分级，以及赋予 Instax 照片独特、真实魅力的物理瑕疵。',
  },
  scenario: {
    single: {
      en: 'A single subject, captured in a candid, snapshot-style moment.',
      zh: '一个主体，以随意的快照风格捕捉。',
    },
    multi: {
      en: 'A group of friends captured in a candid, happy moment, perhaps at a party or a night out.',
      zh: '一群朋友在派对或夜晚外出时的欢乐瞬间被抓拍。',
    },
  },
  gesture: {
    single: {
      en: 'The subject has a spontaneous, natural expression, maybe looking directly at the camera as if caught by the flash.',
      zh: '主体表情自然生动，也许正对着镜头，像是被闪光灯捕捉到的瞬间。',
    },
    multi: {
      en: 'The subjects are interacting with each other, laughing or sharing a moment, with natural and unposed gestures.',
      zh: '主体之间正在互动，大笑或分享一个瞬间，姿态自然而不做作。',
    },
  },
  composition: {
    en: 'The composition should feel spontaneous and snapshot-like (candid shot), possibly with a slightly off-center framing. The image should be presented with a white border or within an instant film frame.',
    zh: '构图应该感觉像是随意的抓拍，可能会有轻微的偏离中心的取景。图像应带有白边或在拍立得相纸边框内。',
  },
  lighting: {
    en: 'Direct, hard flash photography is key. This should create overexposed highlights on the subject and hard shadows behind them. The background should fall off into darkness quickly. This applies even in daylight.',
    zh: '直接、硬朗的闪光灯是关键。这应该在主体上造成过曝的高光，并在其后形成硬朗的阴影。背景应迅速变暗。即使在白天也应如此。',
  },
  coreStyle: {
    style: {
      en: 'Fuji Instax Mini style, developed instant film, Polaroid style, direct flash, hard flash, high contrast, candid shot.',
      zh: '富士 Instax Mini 风格，已显影的即时胶片，宝丽来风格，直接闪光，硬闪光，高对比度，抓拍。',
    },
    camera: {
      en: 'Taken with a Fujifilm Instax Mini 11.',
      zh: '使用富士 Instax Mini 11 相机拍摄。',
    },
    texture: {
      en: 'Cool tones, greenish shadows, slightly desaturated but vibrant colors, film grain, soft focus, vignette, and possibly light leaks. The image should have a physical, analog quality, and might be slightly blurry.',
      zh: '冷色调，阴影偏绿，色彩饱和度略低但鲜艳，胶片颗粒，柔焦，暗角，可能还有漏光。图像应具有物理的、模拟的质感，并且可能略微模糊。',
    },
    output: {
      en: 'A high-quality digital photograph that perfectly mimics the look and feel of a Fuji Instax print, complete with its characteristic white border, color shifts, and textures from direct flash.',
      zh: '一张高质量的数字照片，完美模仿富士 Instax 打印品的外观和感觉，完整再现其特有的白边、色彩偏移和直闪带来的纹理。',
    },
  },
}
