import { StyleConfig } from './types'

export const vintageFilm: StyleConfig = {
  role: {
    en: 'You are a nostalgic photographer using a 90s point-and-shoot camera to capture memories for a family album. Embrace the amateur, authentic feel.',
    zh: '你是一位怀旧摄影师，正在用90年代的傻瓜相机为家庭相册捕捉记忆。请拥抱那种业余、真实的感觉。',
  },
  task: {
    en: 'Your task is to envision a retro, lo-fi, and sentimental scene based on the provided character and environment, capturing the essence of 80s-90s vernacular photography.',
    zh: '你的任务是基于提供的人物和场景参考，构思一个复古、低保真且充满情感的场景，捕捉80-90年代家庭快照（Vernacular Photography）的精髓。',
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
    en: 'Imperfect, amateur composition. Centered subjects, maybe slightly blurry. Noticeable field curvature, where the center is relatively sharp but the edges are softer. Low acutance, no sharp edges.',
    zh: '不完美、业余的构图。主体居中，可能稍微模糊。有明显的场曲，中心相对清晰而边缘画质更柔和。低锐度，没有锐利的边缘。',
  },
  lighting: {
    en: 'Imperfect, natural lighting. Could be indoor window light or soft overcast daylight. The light is handled in an amateur way, resulting in a narrow dynamic range with clipped highlights and crushed blacks. Halation and glow around bright areas are common.',
    zh: '不完美的自然光。可能是室内窗户光，或阴天的柔和日光。光线处理方式很业余，导致动态范围狭窄，高光溢出，暗部细节丢失。亮区周围常见光晕和辉光。',
  },
  coreStyle: {
    style: {
      en: '80s-90s Vernacular Photography, Family Snapshot Aesthetic, Chemical Aging Effect',
      zh: '80-90年代家庭快照，纪实美学，化学老化效果',
    },
    camera: {
      en: '35mm Point-and-Shoot Camera with a low-resolution plastic or resin lens',
      zh: '带有低解析度塑料或树脂镜头的35毫米傻瓜相机',
    },
    texture: {
      en: 'Image defined by optical limitations. Colors are slightly faded due to chemical aging, with a hint of a magenta/red cast. Highlights shifted to creamy yellow. Waxy skin texture. Heavy, clumpy dye clouds (luminance grain), not digital noise. Loss of detail in shadows. Physical artifacts like ink stains, mold spots, and scratches.',
      zh: '由光学局限性定义的画质。色彩因化学老化而轻微褪色，带有一丝洋红/红色调。高光偏向奶油黄色。蜡质皮肤质感。沉重、结块的染料云团（亮度颗粒），而非数码噪点。暗部细节丢失。存在墨迹、霉斑和划痕等物理瑕疵。',
    },
    output: {
      en: 'Lo-fi aesthetic, Nostalgic, Authentic, Imperfect, Sentimental, Chemically Aged',
      zh: '低保真美学，怀旧，真实，不完美，充满情感，化学老化感',
    },
  },
}
