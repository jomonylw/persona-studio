// Example JSON structure for English environment output
const exampleEnvironmentEn = {
  name: 'Neon-lit Cyberpunk Alleyway',
  prompt:
    'A narrow, rain-slicked alleyway in a futuristic metropolis where towering holographic advertisements cast colorful reflections on wet pavement. Steam rises from manholes, mixing with the glow of neon signs in both English and Japanese. The atmosphere is moody and atmospheric, with dramatic lighting from above creating deep shadows between towering skyscrapers.',
}

// Example JSON structure for Chinese environment output
const exampleEnvironmentZh = {
  name: '霓虹闪烁的赛博朋克小巷',
  prompt:
    '一条狭窄、雨水湿滑的巷子，位于未来主义大都市中，高耸的全息广告牌在湿漉漉的路面上投射出五彩斑斓的倒影。蒸汽从井盖中升起，与霓虹招牌的光芒混合在一起，既有英文也有日文。氛围忧郁而富有情调，戏剧性的光线从上方洒下，在高耸的摩天大楼之间创造出深邃的阴影。',
}

export const environmentTextPrompt = {
  en: (userIdea?: string): string => {
    const userIdeaText = userIdea ? `\n**User's Idea:** "${userIdea}"` : ''
    const finalGenerationText = userIdea
      ? `Now, generate the environment concept for the user's idea: "${userIdea}".`
      : 'Now, generate a random environment concept.'

    return `
You are an expert world-builder and descriptive writer. Your task is to take a user's input (${userIdea ? 'a high-level idea' : ''}${userIdea ? '' : 'or create a random concept'}) and expand it into a structured environment description.
${userIdeaText}

${userIdea ? 'Based on this idea' : 'Create a unique environment'}, please generate a JSON object that STRICTLY follows the structure and format of the example below. Fill in every field with creative, consistent, and plausible details that bring the environment to life.

**JSON Structure to Follow:**
\`\`\`json
${JSON.stringify(exampleEnvironmentEn, null, 2)}
\`\`\`

**Instructions:**
1.  **Adhere to the Schema:** The output MUST be a single, valid JSON object. Do not add any text or explanations outside of the JSON structure.
2.  **Be Creative and Consistent:** The details in each field should logically connect and build a cohesive image of the environment. For example, the atmosphere should match the environment type and mood.
3.  **Language:** Use English for all field values.
4.  **Completeness:** Fill out both the "name" and "prompt" fields as demonstrated in the example.
5.  **Name Field:** Create a short, catchy title/name for the environment (3-8 words).
6.  **Prompt Field:** Generate a rich, descriptive paragraph that focuses heavily on the environment's visual and sensory details, including core identity, key elements, atmosphere & mood, sensory details, and overall vibe.

${finalGenerationText}
`
  },
  zh: (userIdea?: string): string => {
    const userIdeaText = userIdea ? `\n**用户的想法:** "${userIdea}"` : ''
    const finalGenerationText = userIdea
      ? `现在，请为用户的想法生成环境概念：“${userIdea}”。`
      : '现在，请生成一个随机的环境概念。'

    return `
你是一位专业的世界构建师和描述性作家。你的任务是根据用户提供的输入（${userIdea ? '一个高级概念' : ''}${userIdea ? '' : '或创建一个随机概念'}），将其扩展为一个结构化的环境描述。
${userIdeaText}

${userIdea ? '请根据这个想法' : '创建一个独特的环境'}，生成一个严格遵循以下示例结构和格式的 JSON 对象。请用富有创意、连贯一致且合乎逻辑的细节填充每一个字段，让环境栩栩如生。

**需要遵循的 JSON 结构:**
\`\`\`json
${JSON.stringify(exampleEnvironmentZh, null, 2)}
\`\`\`

**指令:**
1.  **遵守结构:** 输出必须是一个单一、有效的 JSON 对象。不要在 JSON 结构之外添加任何文本或解释。
2.  **创意与一致性:** 每个字段中的细节都应在逻辑上相互关联，共同构建一个统一的环境形象。例如，氛围应与环境类型和情绪相匹配。
3.  **语言:** 所有字段的值请使用中文。
4.  **完整性:** 请像示例中那样填写"name"和"prompt"两个字段。
5.  **名称字段:** 为环境创建一个简短、吸引人的标题/名称（3-8个字）。
6.  **提示字段:** 生成一段丰富、具象的描述，重点在于环境的视觉和感官细节，包括核心特征、关键元素、氛围与情调、感官细节和整体氛围。

${finalGenerationText}
`
  },
}
