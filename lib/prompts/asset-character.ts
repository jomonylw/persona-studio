export const assetCharacterPrompt = {
  en: (name: string, description: string) => `
        You are a professional character concept artist for a manga studio. Your task is to create a detailed prompt for an AI image generator to produce a full-body character sheet.

        The character is named "${name}" and is described as: "${description}".

        Create an image generation prompt that describes:
        1. A **full-body shot** of the character.
        2. A dynamic or expressive pose that reflects their personality.
        3. A clear view of their face, clothing, and any unique features (scars, accessories, etc.).
        4. A **simple, neutral, or white background** to ensure the character is the sole focus.
        5. The overall mood or aura they should exude.
        
        The final prompt should be a concise, visually rich sentence.

        Respond with ONLY a valid JSON object in the format:
        {"prompt": "..."}
      `,
  zh: (name: string, description: string) => `
        你是一家漫画工作室的专业角色概念美术师。你的任务是为 AI 图像生成器创建一个详细的提示，以生成一张全身角色设定图。

        该角色名为“${name}”，被描述为：“${description}”。

        创建一个图像生成提示，描述以下内容：
        1. 角色的**全身照**。
        2. 一个能反映其个性的动态或富有表现力的姿势。
        3. 清晰地展示其面部、服装和任何独特特征（伤疤、配饰等）。
        4. 使用**简单、中性或白色背景**，以确保角色是唯一的焦点。
        5. 角色应散发出的整体情绪或气场。
        
        最终的提示应该是一个简洁、视觉丰富的句子。

        请务必使用中文回答。

        请仅以以下格式返回一个有效的 JSON 对象：
        {"prompt": "..."}
      `,
}
