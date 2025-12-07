import { StyleConfig } from './types'

export const mirrorSelfie: StyleConfig = {
  role: {
    en: 'You are an expert in realistic, slice-of-life photography, specializing in mirror selfies that capture authentic, unposed moments in natural indoor lighting.',
    zh: '你是一位精通生活纪实摄影的专家，尤其擅长通过镜子自拍，在自然的室内光线下捕捉真实、不经意的瞬间。',
  },
  task: {
    en: 'Your task is to generate a detailed, realistic prompt for a mirror selfie, based on the provided character and a home/bathroom environment.',
    zh: '你的任务是根据提供的人物和一个居家/洗手间环境，生成一个细节丰富、效果真实的镜中自拍提示词。',
  },
  scenario: {
    single: {
      en: 'The character is taking a selfie in the mirror, holding their smartphone. The focus is on the reflection. The scene feels intimate and unstaged.',
      zh: '人物正拿着手机在镜子前自拍。焦点在镜中的影像上，场景感觉私密且毫无摆拍痕迹。',
    },
    multi: {
      en: 'The characters are taking a group selfie in a large mirror. The composition is casual and captures their interaction naturally.',
      zh: '人物们正在一面大镜子前拍摄合照。构图随意，自然地捕捉了他们之间的互动。',
    },
  },
  gesture: {
    single: {
      en: 'Holding a smartphone, with the phone itself partially obscuring the face or body in the reflection. The pose is relaxed and natural, looking at their reflection in the mirror.',
      zh: '手持智能手机，手机本身在镜中影像里部分遮挡了脸或身体。姿势放松自然，眼神看着镜中的自己。',
    },
    multi: {
      en: 'One character holds the phone to capture the group in the mirror. Their poses are casual, interacting with each other rather than looking directly at the camera.',
      zh: '由一名角色手持手机，将整个团体摄入镜中。他们的姿态随意，互相之间在互动，而不是直视镜头。',
    },
  },
  composition: {
    en: "View from the mirror's perspective, often slightly high-angled. The composition is centered on the subject's reflection. The smartphone's rear camera is visible in the reflection. Natural smartphone depth of field, with a deep focus; the background is clear and not artificially blurred.",
    zh: '从镜子的视角拍摄，通常是轻微的俯拍角度。构图以主体在镜中的影像为中心。智能手机的后置摄像头在倒影中可见。景深为手机自然景深，焦点深；背景清晰可辨，无人为模糊效果。',
  },
  lighting: {
    en: 'Soft, diffused daylight from a large window with sheer curtains to one side of the lens. White balance is neutral (around 5200K).',
    zh: '光线来自镜头一侧的大窗户，透过薄纱窗帘形成的柔和漫射日光。白平衡为中性（约 5200K）。',
  },
  coreStyle: {
    style: { en: 'Realistic Mirror Selfie', zh: '写实镜中自拍' },
    camera: {
      en: 'Smartphone rear camera pointed at mirror, 26mm equivalent focal length, f/1.8, ISO 100',
      zh: '智能手机后置摄像头对镜拍摄，26mm 等效焦距，f/1.8，ISO 100',
    },
    texture: {
      en: 'Natural skin texture without beauty filters or airbrushing, sharp focus on the reflection, deep depth of field',
      zh: '无美颜滤镜或磨皮的自然皮肤纹理，焦点清晰地落在镜中影像上，景深大',
    },
    output: {
      en: 'Authentic Slice-of-Life, Unposed, High-Quality Mirror Selfie',
      zh: '真实生活切片，无摆拍，高质量镜中自拍',
    },
  },
}
