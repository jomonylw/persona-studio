import { Locale } from '@/lib/prompts'

const prompts: {
  [key in Locale]: (
    genre: string,
    storySummary: string,
    colorStyle: string,
  ) => string
} = {
  en: (genre: string, storySummary: string, colorStyle: string) => `
    **Task:** You will perform a two-step analysis to define a manga's visual style.

    **Step 1: Analyze the Image**
    - Analyze the provided image *only*.
    - Describe its fundamental art style, focusing on:
        - Line Work (e.g., clean, sketchy, bold)
        - Color Palette (e.g., vibrant, muted, monochromatic)
        - Shading & Texture (e.g., cell-shaded, painterly, flat)
        - Overall Mood (e.g., dark, cheerful, energetic)
        - Character Design (e.g., realistic, anime, cartoonish)
        - Composition & Detail (e.g., simple, detailed, dynamic)
    - This description will populate the "artStyle" field.

    **Step 2: Create a Detailed Art Direction**
    - Now, combine the "artStyle" from Step 1 with the following story information.
    - Elaborate on the base style, suggesting specific visual techniques that would enhance the story's mood.
    - For example, suggest how to use dramatic shadows, speed lines, or soft backgrounds to fit the narrative.
    - This comprehensive description will populate the "detailedArtStyle" field.

    **Story Information:**
    - Genre: ${genre}
    - Summary: ${storySummary}
    - Color Style: ${colorStyle}

    Respond with ONLY a valid JSON object in the following format:
    {
      "artStyle": "A descriptive art style based *only* on the input image, e.g., 'Clean shonen style with dynamic action lines and expressive characters.'",
      "detailedArtStyle": "A more detailed and specific art style description that combines the base artStyle with the story information. E.g. 'To capture the somber mood of this ${genre} story, the style should use the base clean shonen style but with heavy, textured shadows and a muted, ${colorStyle} palette. Character expressions should be subtle but impactful to reflect the noir themes.'"
    }`,
  zh: (genre: string, storySummary: string, colorStyle: string) => `
    **任务:** 你将通过两步分析来定义漫画的视觉风格。

    **第一步：分析图片**
    - **仅**分析所提供的图片。
    - 描述其基础艺术风格，重点关注：
        - 线条风格 (例如：干净、手绘感、粗犷)
        - 色调 (例如：鲜艳、柔和、单色)
        - 阴影与质感 (例如：赛璐璐风格、油画感、平涂)
        - 整体氛围 (例如：黑暗、愉悦、充满活力)
        - 角色设计 (例如：写实、动漫、卡通)
        - 构图与细节 (例如：简洁、复杂、动态)
    - 这部分的描述将用于填充 "artStyle" 字段。

    **第二步：创建详细的艺术指导**
    - 现在，将第一步生成的 "artStyle" 与以下故事信息结合起来。
    - 在基础风格上进行详细阐述，提出能够增强故事氛围的具体视觉技术。
    - 例如，建议如何使用戏剧性的阴影、速度线或柔和的背景来贴合叙事。
    - 这份综合描述将用于填充 "detailedArtStyle" 字段。

    **故事信息:**
    - 类型: ${genre}
    - 摘要: ${storySummary}
    - 色彩风格: ${colorStyle}

    请务必使用中文回答。

    请仅以以下格式返回一个有效的 JSON 对象：
    {
      "artStyle": "（说明：仅对输入图片进行分析）一种描述性的艺术风格，例如：‘干净的少年漫画风格，具有动态的动作线条和富有表现力的角色。’",
      "detailedArtStyle": "（说明：结合 类型，故事摘要，色彩风格，artStyle 综合）一份更详细、更具体的艺术风格描述，其中融入了故事信息。例如：‘为了捕捉这部 ${genre} 故事的阴郁氛围，风格上应在干净的少年漫画风格基础上，使用厚重、有质感的阴影和柔和、${colorStyle} 的色调。角色的表情应该含蓄但有冲击力，以反映黑色电影的主题。’"
    }`,
}

export const getArtStylePrompt = (
  locale: Locale,
  genre: string,
  storySummary: string,
  colorStyle: string,
): string => {
  const promptGenerator = prompts[locale] || prompts.en
  return promptGenerator(genre, storySummary, colorStyle)
}
