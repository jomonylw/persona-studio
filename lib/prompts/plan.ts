export const planPrompt = {
  en: (
    genre: string,
    storySummary: string,
    artStyle: string,
    colorStyle: string,
    numPages: number,
    hasArtStyleImage: boolean,
  ) => `
      You are a master manga editor and storyteller. Your task is to expand a basic idea into a dramatic and engaging plan for a ${numPages}-page one-shot manga.

      **Input Idea:**
      - Genre: ${genre}
      - Summary: ${storySummary}
      - Art Style: ${artStyle}
      - Color Style: ${colorStyle}

      **Your Task:**
      1.  **Detailed Story Summary:** Expand the summary into a compelling narrative (2-3 paragraphs) with clear stakes, character motivations, and a hint of the central conflict.
      2.  **Detailed Art Style:** ${
        hasArtStyleImage
          ? 'Analyze the provided reference image and describe its art style in detail, covering aspects like linework, shading, character design style, and overall mood. Then, suggest how to specifically apply this style to the story (e.g., "Apply the image’s sharp, high-contrast shading to emphasize the tension in the climax scene.").'
          : 'Elaborate on the art style, suggesting specific visual techniques that would enhance the story\'s mood (e.g., "heavy use of dramatic shadows and speed lines for action scenes," or "soft, detailed backgrounds for emotional moments").'
      }
      3.  **Characters & Environments:** List the essential characters and environments with descriptions that are concise but full of personality and visual cues.
      Respond with ONLY a valid JSON object in the specified format:
      {
        "detailedStorySummary": "...",
        "detailedArtStyle": "...",
        "characters": [{"name": "...", "description": "..."}],
        "environments": [{"name": "...", "description": "..."}]
      }
    `,
  zh: (
    genre: string,
    storySummary: string,
    artStyle: string,
    colorStyle: string,
    numPages: number,
    hasArtStyleImage: boolean,
  ) => `
      你是一位大师级的漫画编辑和故事讲述者。你的任务是将一个基本想法扩展成一个富有戏剧性和吸引力的 ${numPages} 页单篇漫画计划。

      **输入想法:**
      - 类型: ${genre}
      - 摘要: ${storySummary}
      - 艺术风格: ${artStyle}
      - 色彩风格: ${colorStyle}

      **你的任务:**
      1.  **详细故事摘要:** 将摘要扩展成一个引人入胜的叙述（2-3段），包含明确的风险、角色动机和核心冲突的暗示。
      2.  **详细艺术风格:** ${
        hasArtStyleImage
          ? '分析提供的参考图，并详细描述其艺术风格，涵盖线条、阴影、角色设计风格和整体氛围等方面。然后，建议如何将这种风格具体应用到故事中（例如，“运用图片中锐利、高对比度的阴影来强调高潮场景的紧张感”）。'
          : '详细阐述艺术风格，建议可以增强故事情绪的特定视觉技术（例如，“大量使用戏剧性的阴影和速度线来表现动作场面”，或“为情感时刻使用柔和、细腻的背景”）。'
      }
      3.  **角色与环境:** 列出基本角色和环境，描述要简洁但充满个性和视觉线索。
      请务必使用中文回答。
 
       请仅以指定的格式返回一个有效的 JSON 对象：
       {
         "detailedStorySummary": "...",
         "detailedArtStyle": "...",
         "characters": [{"name": "...", "description": "..."}],
         "environments": [{"name": "...", "description": "..."}]
       }
    `,
}
