import { StyleConfig } from './types'

export const japaneseFilm: StyleConfig = {
  role: {
    en: 'You are a film director, capturing moments with the quiet, narrative depth of Japanese cinema. Your shots tell a story, focusing on emotion, atmosphere, and the beauty of imperfection.',
    zh: '你是一位电影导演，用日本电影般安静而富有叙事深度的镜头捕捉瞬间。你的镜头会讲故事，注重情感、氛围和不完美中的美感。',
  },
  task: {
    en: 'Your task is to create a scene with a cinematic, slightly melancholic, and beautifully understated feel, inspired by Japanese film aesthetics. The image should feel like a captured memory, full of unspoken stories.',
    zh: '你的任务是创造一个具有电影感、略带忧郁、且含蓄优美的场景，其灵感来源于日本电影美学。画面应该像一段被捕捉的记忆，充满无言的故事。',
  },
  scenario: {
    single: {
      en: 'A quiet, introspective moment. The character is lost in thought, perhaps looking out a rain-streaked window, standing on an empty train platform, or walking through a serene, slightly overgrown landscape.',
      zh: '一个安静、内省的时刻。角色陷入沉思，也许是望着挂着雨痕的窗户，站在空无一人的站台上，或走在宁静且略显杂乱的风景中。',
    },
    multi: {
      en: 'A subtle interaction between characters that hints at a deeper story. Shared glances across a quiet room, quiet companionship on a park bench, or a moment of unspoken understanding during a shared, simple meal.',
      zh: '角色之间微妙的互动，暗示着更深层的故事。在安静的房间里交换眼神，在公园长椅上安静地陪伴，或是在一顿简单的饭食中达成无言的理解。',
    },
  },
  gesture: {
    single: {
      en: 'Natural, unposed, and thoughtful. A hand gently resting on a windowsill, a distant gaze, a back turned to the camera, or a simple, everyday action performed with quiet intention.',
      zh: '自然、不经意且充满思绪。一只手轻轻搭在窗台上，遥望的眼神，背对镜头的身影，或是一个带着安静意图的简单日常动作。',
    },
    multi: {
      en: 'Minimalist interaction, emphasizing emotional distance or closeness. Characters might be near each other but not directly engaging, creating a sense of shared space and unspoken emotion.',
      zh: '极简的互动，强调情感上的疏离或亲近。角色可能彼此靠近但没有直接交流，营造出共享空间和无言情感的感觉。',
    },
  },
  composition: {
    en: 'Embrace negative space to create a sense of quiet and loneliness. Use framing (through windows, doorways) to add depth and a sense of voyeurism. Employ a "slice of life" perspective with casual, snapshot-like angles, and use foreground elements (like plants or a cup) to create layers. Asymmetrical balance is key.',
    zh: '拥抱留白，营造宁静和孤独感。利用框式构图（通过窗户、门框）来增加深度和窥视感。采用“生活切片”的视角，使用随意、快照般的角度，并利用前景元素（如植物、杯子）来创造层次感。非对称平衡是关键。',
  },
  lighting: {
    en: 'Soft, diffused natural light is essential. Think overcast days, the gentle light of golden hour, or light filtering through shoji screens or dusty windows. Shadows are soft and full of cool tones. Look for subtle halation (a soft glow) around high-contrast edges and light sources.',
    zh: '柔和、漫射的自然光至关重要。想象一下阴天、黄金时刻的柔光，或是透过和纸门或布满灰尘的窗户过滤进来的光线。阴影柔和且充满冷色调。在高对比度边缘和光源周围寻找微妙的光晕（Halation）。',
  },
  coreStyle: {
    style: {
      en: 'Japanese Film Cinema, Slice of Life, Wabi-sabi aesthetic',
      zh: '日式电影感，生活切片，侘寂美学',
    },
    camera: {
      en: 'Shot on 35mm film. Emulate the look of a classic rangefinder or SLR like a Leica M6, Contax G2, or Nikon FM2. Use a 35mm or 50mm prime lens. The film stock is crucial: emulate Fujifilm Pro 400H for its iconic green-blue tones, or CineStill 800T for a more dramatic, blue-tinted look with red halation.',
      zh: '使用35毫米胶片拍摄。模拟经典旁轴或单反相机的质感，如徕卡M6、康泰时G2或尼康FM2。使用35mm或50mm定焦镜头。胶卷至关重要：模拟富士Pro 400H以获得其标志性的青绿色调，或使用CineStill 800T以获得更具戏剧性、带有红色光晕的蓝色调外观。',
    },
    texture: {
      en: 'Visible but fine film grain. A soft-focus, not tack-sharp, feel. The dynamic range is compressed, with no pure blacks or whites, details are lost in shadows and highlights. The color palette is muted and desaturated, with a characteristic blue or cyan tint in the shadows and mid-tones, while skin tones and highlights retain a gentle warmth.',
      zh: '可见但细腻的胶片颗粒。柔焦、非锐利的感觉。动态范围被压缩，没有纯黑或纯白，细节在阴影和高光中丢失。色调柔和且饱和度低，在阴影和中间调中有标志性的蓝色或青色调，而肤色和高光则保留着柔和的温暖感。',
    },
    output: {
      en: 'Cinematic, Emotional, Nostalgic, Understated, Quiet, Introspective, Serene',
      zh: '电影感，情绪化，怀旧，含蓄，安静，内省，宁静',
    },
  },
}
