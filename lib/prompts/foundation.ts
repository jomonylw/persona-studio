export const foundationPrompt = {
  en: (options?: { constraints?: string }) => ({
    prompt: `
      Generate a unique and fun manga story idea.
      ${
        options?.constraints
          ? `The user has provided the following ideas, constraints, or keywords to guide the generation: "${options.constraints}". Please incorporate these ideas naturally into your response.`
          : ''
      }
      Provide a genre, a short (one-paragraph) story summary, a suitable art style description, and a color style (either "Black and White" or "Colorized").
      
      Respond with ONLY a valid JSON object in the following format:
      {
        "genre": "e.g., Sci-Fi, Fantasy, Slice of Life",
        "storySummary": "A unique and fun one-paragraph story summary.",
        "artStyle": "A descriptive art style, e.g., 'Clean shonen style with dynamic action lines and expressive characters.'",
        "colorStyle": "Black and White"
      }
    `,
  }),
  zh: (options?: { constraints?: string }) => ({
    prompt: `
      生成一个独特有趣的漫画故事点子。
      ${
        options?.constraints
          ? `用户提供了以下想法、约束或关键词来指导生成：“${options.constraints}”。请将这些想法自然地融入你的回答中。`
          : ''
      }
      提供一个类型，一段简短的（一段式）故事摘要，一个合适的艺术风格描述，以及一种色彩风格（"Black and White" or "Colorized"）。

      请务必使用中文回答。

      请仅以以下格式返回一个有效的 JSON 对象：
      {
        "genre": "例如：科幻、奇幻、生活片段",
        "storySummary": "一个独特有趣的一段式故事摘要。",
        "artStyle": "一种描述性的艺术风格，例如：‘干净的少年漫画风格，具有动态的动作线条和富有表现力的角色。’",
        "colorStyle": "Black and White"
      }
    `,
  }),
}
