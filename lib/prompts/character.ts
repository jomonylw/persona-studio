export const characterPrompt = {
  en: (userIdea?: string, hasImage?: boolean): string => {
    if (hasImage) {
      return `
You are an expert character designer. A user has provided a reference image and may have added some text ideas.
Your task is to analyze the image and text, then generate a rich, descriptive paragraph focusing on the character's **visual appearance**.
If the user provided an idea, use it as a guide, but prioritize the visual information from the image.

**User's Idea:** "${userIdea || 'No additional idea provided.'}"

**Analysis & Expansion Requirements:**
1.  **Analyze the Image:** Describe the character in the image, covering their identity (age, gender, ethnicity), physical appearance (build, posture), facial features (face shape, eyes, hair), fashion, and overall vibe.
2.  **Synthesize with User Idea:** If there's a user idea, merge it with the image details. The image is the primary source of truth; use the text to fill in gaps or refine details.
3.  **Create a Cohesive Paragraph:** Your output must be a single, evocative paragraph that paints a clear, detailed picture of the character.
`
    }
    if (userIdea) {
      return `
You are an expert character designer and creative writer. A user has provided a character concept and needs help elaborating on it to create a detailed visual profile.
Take the user's idea and expand it into a rich, descriptive paragraph that focuses heavily on the character's **visual appearance**.

**User's Idea:** "${userIdea}"

**Requirements for the expansion:**
1.  **Basic Identity:** Clearly imply or state name (if applicable), age, gender, and ethnicity.
2.  **Physical Appearance:** Describe height, body build, posture, and skin tone.
3.  **Facial Features:** Detail face shape, eyes, hair (color, style), and any makeup or facial hair.
4.  **Fashion & Style:** Describe their outfit, including top, bottom, shoes, and accessories. Mention the overall style vibe.
5.  **Vibe:** Capture their expression and primary mood.

Your output should be a single, cohesive, and evocative paragraph that paints a clear picture of the character, ready to be turned into a structured character card.
`
    } else {
      return `
You are an expert character designer and creative writer. Your task is to invent a unique random character concept.
Generate a rich, descriptive paragraph that focuses heavily on the character's **visual appearance**.

**Requirements for the description:**
1.  **Basic Identity:** Clearly imply or state a name, age, gender, and ethnicity.
2.  **Physical Appearance:** Describe height, body build, posture, and skin tone.
3.  **Facial Features:** Detail face shape, eyes, hair (color, style), and any makeup or facial hair.
4.  **Fashion & Style:** Describe their outfit, including top, bottom, shoes, and accessories. Mention the overall style vibe.
5.  **Vibe:** Capture their expression and primary mood.

Your output should be a single, cohesive, and evocative paragraph that paints a clear picture of the character, ready to be turned into a structured character card.
`
    }
  },
  zh: (userIdea?: string, hasImage?: boolean): string => {
    if (hasImage) {
      return `
你是一位专业的角色设计师。用户提供了一张参考图片，并可能附带了一些文字想法。
你的任务是分析图片和文字，然后生成一段丰富、具象的描述，重点在于角色的**视觉外貌**。
如果用户提供了想法，请将其作为指导，但优先考虑图片中的视觉信息。

**用户的想法:** "${userIdea || '未提供额外想法。'}"

**分析与扩展要求:**
1.  **分析图片:** 描述图片中的角色，涵盖其身份（年龄、性别、种族）、身体外貌（体型、体态）、面部特征（脸型、眼睛、发型）、时尚风格和整体气质。
2.  **与用户想法结合:** 如果有用户想法，请将其与图片细节融合。图片是主要信息来源；使用文字来填补空白或完善细节。
3.  **创建连贯的段落:** 你的输出必须是一个单一、富有画面感的段落，清晰、详细地描绘出角色形象。
`
    }
    if (userIdea) {
      return `
你是一位专业的角色设计师和创意作家。用户提供了一个人物概念，需要你帮助将其扩展为一个详细的视觉形象。
请根据用户的想法，将其扩展为一段丰富、具象的描述，重点在于角色的**视觉外貌**。

**用户的想法:** "${userIdea}"

**扩展要求:**
1.  **基本身份:** 明确暗示或说明姓名（如果适用）、年龄、性别和种族。
2.  **身体外貌:** 描述身高、体型、体态和肤色。
3.  **面部特征:** 详细描述脸型、眼睛、发型（颜色、款式）以及任何妆容或面部毛发。
4.  **时尚风格:** 描述他们的着装，包括上衣、下装、鞋子和配饰。提及整体风格氛围。
5.  **气质氛围:** 捕捉他们的表情和主要情绪。

你的输出应该是一个单一、连贯且富有画面感的段落，清晰地描绘出角色形象，以便后续转化为结构化的人物卡片。
`
    } else {
      return `
你是一位专业的角色设计师和创意作家。你的任务是构思一个独特的随机人物概念。
请生成一段丰富、具象的描述，重点在于角色的**视觉外貌**。

**描述要求:**
1.  **基本身份:** 明确暗示或说明一个姓名、年龄、性别和种族。
2.  **身体外貌:** 描述身高、体型、体态和肤色。
3.  **面部特征:** 详细描述脸型、眼睛、发型（颜色、款式）以及任何妆容或面部毛发。
4.  **时尚风格:** 描述他们的着装，包括上衣、下装、鞋子和配饰。提及整体风格氛围。
5.  **气质氛围:** 捕捉他们的表情和主要情绪。

你的输出应该是一个单一、连贯且富有画面感的段落，清晰地描绘出角色形象，以便后续转化为结构化的人物卡片。
`
    }
  },
}
