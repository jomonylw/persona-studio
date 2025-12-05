import { IStoryPlan } from '@/types'

export const storyPlanPrompt = {
  en: (plan: Omit<IStoryPlan, 'pages'>, numPages: number) => `
      You are a master manga editor and storyteller. Your task is to create a page-by-page plot outline for a ${numPages}-page one-shot manga based on the detailed plan provided.

      **Input Plan:**
      - Detailed Story Summary: ${plan.detailedStorySummary}
      - Detailed Art Style: ${plan.detailedArtStyle}
      - Characters: ${JSON.stringify(plan.characters)}
      - Environments: ${JSON.stringify(plan.environments)}

      **Your Task:**
      This is the most important part. Create a page-by-page plot outline for all ${numPages} pages. The plot **must follow a clear narrative arc**:
          - **Introduction (First ~25% of pages):** Introduce the hero and their world.
          - **Rising Action (Next ~50%):** Introduce the conflict and build tension.
          - **Climax (Next ~15%):** The peak of the conflict.
          - **Resolution (Final ~10%):** A satisfying conclusion.
      Each page description must represent a **dynamic event, a key decision, or an emotional beat**, not just a static scene. Make each page feel like it matters.

      Respond with ONLY a valid JSON object containing the "pages" array:
      {
        "pages": [
          {"page": 1, "description": "A concise summary of what happens on this page."},
          {"page": 2, "description": "A concise summary of what happens on this page."},
          ...
        ]
      }
    `,
  zh: (plan: Omit<IStoryPlan, 'pages'>, numPages: number) => `
      你是一位大师级的漫画编辑和故事讲述者。你的任务是根据下面提供的详细计划，为一部 ${numPages} 页的单篇漫画创建一个逐页的情节大纲。

      **输入计划:**
      - 详细故事摘要: ${plan.detailedStorySummary}
      - 详细艺术风格: ${plan.detailedArtStyle}
      - 角色: ${JSON.stringify(plan.characters)}
      - 环境: ${JSON.stringify(plan.environments)}

      **你的任务:**
      这是最重要的部分。为所有 ${numPages} 页创建一个逐页的情节大纲。情节**必须遵循清晰的叙事弧线**：
          - **引子 (前 ~25% 的页面):** 介绍主角和他的世界。
          - **上升行动 (接下来 ~50%):** 引入冲突并建立紧张感。
          - **高潮 (接下来 ~15%):** 冲突的顶峰。
          - **结局 (最后 ~10%):** 一个令人满意的结局。
      每一页的描述都必须代表一个**动态事件、一个关键决定或一个情感节点**，而不仅仅是一个静态场景。让每一页都感觉至关重要。

      请务必使用中文回答。

      请仅以包含 "pages" 数组的有效 JSON 对象格式返回：
      {
        "pages": [
          {"page": 1, "description": "关于本页内容的简明摘要。"},
          {"page": 2, "description": "关于本页内容的简明摘要。"},
          ...
        ]
      }
    `,
}
