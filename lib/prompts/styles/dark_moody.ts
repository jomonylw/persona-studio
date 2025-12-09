import { StyleConfig } from './types'

export const darkMoody: StyleConfig = {
  role: {
    en: "You are a photographer who uses 'subtraction' to express emotion, specializing in the Dark & Moody style. You masterfully use large areas of shadow to hide distractions, forcing the viewer to focus on the illuminated subject, creating a quiet, melancholic, and cinematic texture.",
    zh: '你是一位通过“做减法”来表达情感的摄影师，专精于暗调情绪风格。你巧妙地利用大面积阴影隐藏干扰元素，迫使观众聚焦于被照亮的主体，从而营造出一种静谧、忧郁且富有电影感的质感。',
  },
  task: {
    en: 'Your task is to create a photograph that embodies the Dark & Moody style. It should feature dramatic light and shadow, a cinematic color palette, and a texture that feels both hazy and granular, based on the provided character and environment.',
    zh: '你的任务是创作一张体现暗调情绪风格的照片。它应基于提供的人物和环境，呈现戏剧性的光影、电影感的色调，以及既朦胧又带有颗粒感的质感。',
  },
  scenario: {
    single: {
      en: 'The character is captured in a moment of introspection or solitude, partially illuminated in a sea of shadows. The mood is quiet, melancholic, mysterious, and has a cinematic quality.',
      zh: '在无边的阴影中，人物于局部光亮处被捕捉，展现了一个内省或孤独的瞬间。情绪是静谧、忧郁、神秘且具有电影感的。',
    },
    multi: {
      en: 'The characters are enveloped in a scene with emotional weight and mystery. Their interaction is subtle, perhaps they are close but not touching, suggesting unspoken tension or a deep, complex connection, reminiscent of a scene from a Wong Kar-wai film.',
      zh: '人物被笼罩在一个充满情感重量和神秘感的场景中。他们的互动是微妙的，也许是靠近但未触碰，暗示着无言的紧张或深刻、复杂的联系，让人联想到王家卫电影中的某一帧。',
    },
  },
  gesture: {
    single: {
      en: 'Describe a subtle, melancholic pose. The character might be looking away towards a light source, be partially obscured by deep shadows, or their face is hidden but their silhouette is outlined by rim light. The expression is pensive, somber, or lost in thought.',
      zh: '描述一个微妙、忧郁的姿势。角色可能望向光源，或被深邃的阴影部分遮蔽，又或者脸部隐藏在黑暗中，仅由轮廓光勾勒出剪影。表情是沉思的、忧郁的，或若有所思。',
    },
    multi: {
      en: 'Describe their body language to create narrative ambiguity. Are they close but not touching, creating tension? Is one turning away, suggesting distance? Their gestures should hint at a complex, unspoken story.',
      zh: '描述他们的肢体语言以营造叙事上的模糊感。他们是靠近但未触碰，从而制造紧张感吗？其中一人是否转身离开，暗示着疏离？他们的姿态应暗示一个复杂且未言说的故事。',
    },
  },
  composition: {
    en: 'Emphasize "Shadow as Negative Space," using large dark areas to isolate the subject. Employ "Tight Framing" for emotional intimacy, focusing on details like eyes or hands. Use "Framing" (e.g., through a doorway) to create a voyeuristic feel, or "Rim Light" to create a mysterious silhouette. Center composition can be used for a formal, portrait-like feel.',
    zh: '强调“以影为白”，用大面积黑暗来隔离主体。采用“局部特写”来营造情感上的亲密感，聚焦于眼睛、手等细节。使用“框架式构图”（如透过门缝）制造窥视感，或利用“侧逆光”勾勒神秘轮廓。中心构图可用于营造庄重的肖像感。',
  },
  lighting: {
    en: 'Dominated by shadows (Low Key), with 70-80% of the frame in darkness. Use dramatic Chiaroscuro, but with a soft, diffused light source (like window light) to sculpt the subject. Highlights should have a soft "bloom" or "glow" effect. The key is to use shadow to hide distractions and guide the eye.',
    zh: '画面由阴影主导（低调），约70-80%的区域处于暗部。使用戏剧性的明暗对比，但光源本身是柔和的漫射光（如窗边光），以雕塑主体。高光部分应带有柔和的“光晕”或“辉光”效果。关键在于用阴影隐藏干扰元素，引导视线。',
  },
  coreStyle: {
    style: { en: 'Dark and Moody Photography', zh: '暗调情绪摄影' },
    camera: {
      en: 'Fujifilm X-T5 with a 50mm f/1.4 lens, or a Sony A7S III with an 85mm f/1.4 lens. A 1/4 Black Mist Filter is used to enhance the cinematic glow.',
      zh: '富士 X-T5 搭配 50mm f/1.4 镜头，或索尼 A7S III 搭配 85mm f/1.4 镜头。使用 1/4 黑柔滤镜来增强电影感光晕。',
    },
    texture: {
      en: 'Desaturated colors with a cinematic color grade (e.g., teal/blue or warm brown tones). Deep, matte blacks that are slightly lifted. A noticeable coarse grain is added to emulate high ISO film. Highlights are soft and blooming.',
      zh: '低饱和度色彩，并带有电影感的色调（如青蓝色调或暖褐色调）。深邃但略微提亮的哑光黑。添加明显的粗颗粒以模拟高感光度胶片。高光部分柔和且有溢出感。',
    },
    output: {
      en: 'A high-resolution photograph that feels like a still from a film. It is atmospheric, evocative, and emotionally resonant, with a strong sense of quiet, mystery, and depth.',
      zh: '一张高分辨率的照片，感觉像一帧电影。它富有氛围、引人遐想，并能引起情感共鸣，带有强烈的静谧、神秘和深邃感。',
    },
  },
}
