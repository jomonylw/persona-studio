import { IAsset, IMangaPage } from '@/types'

export const pagePrompt = {
  en: (
    nextPageNumber: number,
    detailedStorySummary: string,
    targetPageDescription: string,
    previousPagePrompts: string[],
    aspectRatio: string = '1:1',
  ) => `
      You are a manga panel layout artist. Your task is to describe the panels for page ${nextPageNumber}.
      
      **Page Aspect Ratio:** ${aspectRatio}. Adjust your panel layout to best fit this ratio. For example, a wide ratio (16:9) might suit fewer, wider panels, while a tall ratio (9:16) might suit more, vertically stacked panels.
      **Overall Story:** ${detailedStorySummary}
      **The main plot point for this page is:** "${targetPageDescription}"
      **Previous Page Content:** ${
        previousPagePrompts[previousPagePrompts.length - 1] ||
        'This is the first page.'
      }

      Based on the rhythm and information density of this page's plot, create a sequence of 3 to 5 panels to tell the story. **You should judge for yourself whether 3, 4, or 5 panels is most appropriate; do not imitate the number of panels in the example.** For each panel, combine the shot (e.g., close-up, wide shot), the action, and any dialogue into a single, detailed string description. The panel composition should be dynamic and guide the reader's eye effectively across the page, making good use of the ${aspectRatio} aspect ratio.
      
      **Example (for description style and format only; the number of panels is just for reference):**
      - Panel 1: Wide shot of Kenji entering the neon-lit market, his silhouette contrasting against the colorful signs. Dialogue: Kenji (to himself): "I have to find her."
      - Panel 2: Close-up on a shadowy figure emerging from the crowd, eyes gleaming with menace.
      - Panel 3: Medium shot of Kenji's determined expression as he steps forward confidently.
      
      Panel Layout: A large horizontal panel at the top, with two smaller square panels underneath.
      
      Your response MUST be a single, valid JSON object, with no other text before or after it.
      {"panel": ["Panel 1: [Detailed description of shot and action]. Dialogue: [Character: '...']", "Panel 2: [Detailed description of shot and action, no dialogue].", ...], "layout": "A clear description of how the panels are arranged on the page."}
    `,
  zh: (
    nextPageNumber: number,
    detailedStorySummary: string,
    targetPageDescription: string,
    previousPagePrompts: string[],
    aspectRatio: string = '1:1',
  ) => `
      你是一位漫画分镜布局美术师。你的任务是为第 ${nextPageNumber} 页描述分镜。

      **页面宽高比:** ${aspectRatio}。请根据这个比例来最佳地调整你的分镜布局。例如，宽比例（16:9）可能适合较少、较宽的分镜，而高比例（9:16）则可能适合更多、垂直堆叠的分镜。
      **整体故事:** ${detailedStorySummary}
      **本页主要情节:** “${targetPageDescription}”
      **前一页内容:** ${
        previousPagePrompts[previousPagePrompts.length - 1] || '这是第一页。'
      }

      请根据本页情节的节奏和信息量，创作一个由 3 到 5 个分镜组成的序列来讲述故事。**你应该自主判断采用3、4还是5个分镜最合适，不必模仿示例中的数量。**对于每个分镜，请将镜头（例如：特写、远景）、动作和任何对话合并成一个单一的、详细的字符串描述。分镜构图应该充满动感，能有效地引导读者的视线，并充分利用 ${aspectRatio} 的宽高比。
      
      **示例（仅用于展示描述风格和格式，分镜数量仅为参考）：**
      - 分镜1：远景，健司进入霓虹灯闪烁的市场，他的剪影与彩色招牌形成鲜明对比。对话：健司（自言自语）：“我必须找到她。”
      - 分镜2：特写，一个阴影中的人从人群中走出，眼中闪烁着危险的光芒。
      - 分镜3：中景，健司坚定的表情，他自信地向前迈步。
      
      分镜排版：页面顶部是一个横跨整个页面的大分镜，下面并排跟着两个较小的方形分镜。
      
      请务必使用中文回答。

      你的回答必须是一个有效的JSON对象，前后不能有任何其他文字。
      {"panel": ["分镜1：[镜头和动作的详细描述]。对话：[角色：'台词...']", "分镜2：[镜头和动作的详细描述，无对话]。", ...], "layout": "清晰地描述分镜在页面上的排列方式。"}
    `,
}

export const pageGenerationPrompt = {
  en: (
    artStyleImage: boolean,
    storySummary: string,
    artStyle: string,
    currentPage: number,
    aspectRatio: string,
    generationPrompt: string,
    recentPages: IMangaPage[],
    selectedAssets: IAsset[],
  ) => {
    let imageIndex = 1
    const instructions: string[] = []

    if (artStyleImage) {
      instructions.push(
        `Image ${imageIndex} is the primary art style reference. Please analyze and strictly adhere to its unique painting style, including line art, coloring method, and brushwork.`,
      )
      imageIndex++
    }

    selectedAssets.forEach((asset) => {
      instructions.push(
        `Image ${imageIndex} is the reference for the ${asset.type} "${asset.name}". You MUST strictly follow this image to ensure consistency in appearance.`,
      )
      imageIndex++
    })

    if (recentPages.length > 0) {
      const start = imageIndex
      const end = imageIndex + recentPages.length - 1
      const range =
        start === end ? `Image ${start}` : `Images ${start} to ${end}`
      instructions.push(
        `${range} are previous manga pages for story continuity. Ensure the characters, clothing, and environments in your generated page are consistent with them.`,
      )
    }

    const visualReferenceGuide =
      instructions.length > 0
        ? `\n\n---\n**Visual Reference Guide:**\n${instructions.join('\n')}`
        : ''

    return `
      **Manga Page Generation**
      **Story Summary:** ${storySummary}
      **Art Style:** ${artStyle}
      **Page Number:** ${currentPage}
      **Aspect Ratio:** ${aspectRatio}
      **Page Description (with panels):** ${generationPrompt}
      
      Create a single, cohesive manga page that follows the Page Description.
      ${visualReferenceGuide}
    `.trim()
  },
  zh: (
    artStyleImage: boolean,
    storySummary: string,
    artStyle: string,
    currentPage: number,
    aspectRatio: string,
    generationPrompt: string,
    recentPages: IMangaPage[],
    selectedAssets: IAsset[],
  ) => {
    let imageIndex = 1
    const instructions: string[] = []

    if (artStyleImage) {
      instructions.push(
        `第 ${imageIndex} 张图片是核心艺术风格参考。请仔细分析并严格遵循其独特的绘画风格，包括线条艺术、着色方式和笔触纹理。`,
      )
      imageIndex++
    }

    selectedAssets.forEach((asset) => {
      instructions.push(
        `第 ${imageIndex} 张图片是 ${asset.type} “${asset.name}” 的参考图。在绘制时，你必须严格遵循这张图，以确保其外观、服装和整体风格的一致性。`,
      )
      imageIndex++
    })

    if (recentPages.length > 0) {
      const start = imageIndex
      const end = imageIndex + recentPages.length - 1
      const range =
        start === end ? `第 ${start} 张` : `第 ${start} 到 ${end} 张`
      instructions.push(
        `${range}图片是前一页漫画，用于故事连续性。请确保你生成的页面中的角色、服装和环境与前一页保持一致。`,
      )
    }

    const visualReferenceGuide =
      instructions.length > 0
        ? `\n\n---\n**视觉参考指南:**\n${instructions.join('\n')}`
        : ''

    return `
      **漫画页面生成**
      **故事摘要:** ${storySummary}
      **艺术风格:** ${artStyle}
      **页码:** ${currentPage}
      **宽高比:** ${aspectRatio}
      **页面描述（含分镜）:** ${generationPrompt}

      图片中文字内容请务必使用中文。
      
      请创建一个单一、连贯的漫画页面，遵循页面描述。
      ${visualReferenceGuide}
    `.trim()
  },
}
