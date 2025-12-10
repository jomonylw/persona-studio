import { StyleConfig } from './types'

export const ecommerceModel: StyleConfig = {
  role: {
    en: 'An expert e-commerce photographer creating a high-end apparel photoshoot',
    zh: '一位正在创作高级服装大片的资深电商摄影专家',
  },
  task: {
    en: "As an expert photographer, analyze the character's apparel and style. Then, select the most fitting scene, lighting, and composition from modern trends (e.g., Quiet Luxury, Korean Chic, New Chinese Style, Gorpcore) to create a series of product photos that best showcase the mood, texture, and authenticity.",
    zh: '作为一名摄影专家，请分析角色所穿的服装和整体风格。然后，从当前主流趋势（如静奢风、韩系松弛感、新中式、山系户外）中选择最匹配的场景、光线和构图，创作一系列最能体现其氛围、质感和真实性的产品图。',
  },
  scenario: {
    single: {
      en: 'Based on the apparel style, choose the most suitable professional scene. For "Quiet Luxury", use a minimalist architectural space or a textured backdrop. For "Korean Chic", use a sunlit street, a cozy cafe, or a home setting. For "New Chinese Style", use a serene garden or a space with oriental aesthetics. For "Gorpcore", use natural landscapes like rocks, meadows, or urban industrial ruins.',
      zh: '根据服装风格，选择最专业的场景。对于“静奢风”，可采用极简建筑空间或有纹理的背景。对于“韩系松弛感”，可采用阳光下的街道、舒适的咖啡馆或生活化的居家场景。对于“新中式”，可采用宁静的园林或有东方美学的空间。对于“山系户外”，可采用岩石、草地或城市废墟等自然景观。',
    },
    multi: {
      en: 'Based on the apparel style, choose the most suitable professional scene for a group. For "Quiet Luxury", use a minimalist architectural space. For "Korean Chic", use a sunlit street or cafe. For "New Chinese Style", use a serene garden. For "Gorpcore", use natural landscapes. The interaction between models should feel natural and enhance the narrative.',
      zh: '根据服装风格，为多人选择最合适的专业场景。对于“静奢风”，采用极简建筑空间。对于“韩系松弛感”，采用阳光街道或咖啡馆。对于“新中式”，采用宁静园林。对于“山系户外”，采用自然景观。模特间的互动应自然并增强故事感。',
    },
  },
  gesture: {
    single: {
      en: 'Direct the model’s pose to match the chosen style: poised and cool for "Quiet Luxury"; dynamic and candidly captured for "Korean Chic"; elegant and serene for "New Chinese Style"; powerful and energetic for "Gorpcore". Capture authentic, in-between moments.',
      zh: '根据所选风格指导模特的姿态：对于“静奢风”，姿态沉稳高冷；对于“韩系松弛感”，进行动态抓拍；对于“新中式”，姿态优雅宁静；对于“山系户外”，姿态充满力量感。捕捉真实的、不经意的瞬间。',
    },
    multi: {
      en: 'Direct the models to interact naturally according to the style. For "Quiet Luxury", their interaction is minimal and elegant. For "Korean Chic", it\'s playful and candid. For "New Chinese Style", it\'s serene and composed. For "Gorpcore", it\'s collaborative and dynamic.',
      zh: '根据风格指导模特们自然互动。对于“静奢风”，互动简约而优雅。对于“韩系松弛感”，互动俏皮而不经意。对于“新中式”，互动宁静而沉稳。对于“山系户外”，互动协作且充满活力。',
    },
  },
  composition: {
    en: 'Employ expert composition techniques. Use negative space for a high-end feel, headless or partial-face framing to focus on the outfit, and macro shots for fabric details. Use high-speed burst mode to capture authentic, in-motion shots.',
    zh: '运用专业的构图技巧。利用留白营造高级感，通过截头或局部脸部构图来突出服装，并用微距拍摄面料细节。使用高速连拍模式捕捉动态、真实的瞬间。',
  },
  lighting: {
    en: 'Select lighting that sculpts the apparel. For a "Clean Fit" look, use large, diffused soft light (scrim). For textured fabrics like denim or outdoor gear, use hard side light to create shadows and enhance three-dimensionality. For a "Korean Chic" feel, use or simulate natural sunlight, including dappled light effects (gobo).',
    zh: '选择能够“雕刻”服装的光线。对于“Clean Fit”风格，使用大型柔光设备（如天幕）。对于牛仔或户外等需要突出纹理的面料，使用硬质侧光来制造阴影、增强立体感。对于“韩系松弛感”，使用或模拟自然阳光，可以包括斑驳的光影效果（Gobo）。',
  },
  coreStyle: {
    style: {
      en: 'Expert E-commerce Photography, high-end, atmospheric, authentic, texture-focused, mood-driven, professional color grading, tailored to the apparel style',
      zh: '专业电商摄影, 高级, 氛围感, 真实感, 质感突出, 情绪驱动, 专业调色, 根据服装风格定制',
    },
    camera: {
      en: 'Shot on a high-resolution full-frame camera (e.g., Sony A7R5, Canon R5) with a professionally chosen lens (e.g., 85mm f/1.4 for portraits, 24-70mm f/2.8 for versatility, or a 100mm macro for details).',
      zh: '使用高分辨率全画幅相机（如索尼 A7R5, 佳能 R5）拍摄，并由专业人士选择镜头（如 85mm f/1.4 用于人像，24-70mm f/2.8 用于多功能拍摄，或 100mm 微距用于细节）。',
    },
    texture: {
      en: 'Impeccable sharpness, rich tonality, and faithful color reproduction. Skin texture is retained for authenticity, and fabric details are prominent. A consistent, professional LUT is applied across the series.',
      zh: '无可挑剔的锐度、丰富的色调和忠实的色彩还原。为保证真实性而保留皮肤纹理，面料细节清晰可见。整个系列采用统一的专业级LUT调色。',
    },
    output: {
      en: 'A curated series of professional e-commerce photos, each uniquely tailored to the specific style of the apparel, ready for a high-end online store.',
      zh: '一系列精心策划的专业电商照片，每一张都根据服装的特定风格量身定制，可直接用于高端在线商店。',
    },
  },
}
