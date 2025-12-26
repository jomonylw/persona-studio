import { IPersonAppearance } from '@/types'

// This provides a structured example for the AI to follow.
const examplePersonAppearanceEn: IPersonAppearance = {
  person_appearance: {
    basic_info: {
      name: 'Lin Yue (林悦)',
      nickname: 'Luna',
      perceived_age: '27-29',
      gender: 'Female',
      ethnicity: 'Chinese',
    },
    body: {
      height: {
        value: 169,
        unit: 'cm',
        description: 'Tall and well-proportioned',
      },
      build: 'slim fit',
      posture: 'straight backed',
    },
    head_and_face: {
      face_shape: 'diamond',
      skin: {
        tone: 'warm ivory',
        texture: 'matte finish',
        makeup: 'business daily',
      },
      hair: {
        color: 'chestnut brown',
        length: 'shoulder length',
        style: 'lob straight',
        bangs: false,
        description: 'Impeccably styled',
      },
      eyes: {
        color: 'dark brown',
        shape: 'almond',
        glasses: {
          is_wearing: false,
          style: null,
        },
        description: 'Focused and sharp gaze',
      },
      facial_hair: {
        has_hair: false,
        style: null,
      },
    },
    distinguishing_marks: [
      {
        type: 'earrings',
        location: 'ears',
        description: 'small pearl studs',
      },
    ],
    clothing_and_accessories: {
      style_vibe: 'business chic',
      top: {
        type: 'silk blouse',
        color: 'champagne',
        pattern: 'solid',
      },
      bottom: {
        type: 'pencil skirt',
        color: 'dark coffee',
        length: 'knee length',
      },
      footwear: {
        type: 'high heels',
        color: 'nude',
      },
      accessories: ['minimalist watch', 'leather tote bag', 'access card'],
    },
    expression_and_mood: {
      primary_emotion: 'professional',
      description: 'polite but distant smile',
    },
  },
}

// This provides a structured example for the AI to follow, in Chinese.
const examplePersonAppearanceZh: IPersonAppearance = {
  person_appearance: {
    basic_info: {
      name: '林悦 (Lin Yue)',
      nickname: '月神',
      perceived_age: '27-29岁',
      gender: '女性',
      ethnicity: '华人',
    },
    body: {
      height: {
        value: 169,
        unit: '厘米',
        description: '高挑匀称',
      },
      build: '苗条健美',
      posture: '身姿挺拔',
    },
    head_and_face: {
      face_shape: '菱形脸',
      skin: {
        tone: '暖象牙色',
        texture: '哑光质感',
        makeup: '商务日常妆',
      },
      hair: {
        color: '栗棕色',
        length: '及肩',
        style: '中长直发',
        bangs: false,
        description: '造型精致',
      },
      eyes: {
        color: '深棕色',
        shape: '杏眼',
        glasses: {
          is_wearing: false,
          style: null,
        },
        description: '目光专注而锐利',
      },
      facial_hair: {
        has_hair: false,
        style: null,
      },
    },
    distinguishing_marks: [
      {
        type: '耳环',
        location: '耳朵',
        description: '小珍珠耳钉',
      },
    ],
    clothing_and_accessories: {
      style_vibe: '商务时尚',
      top: {
        type: '真丝衬衫',
        color: '香槟色',
        pattern: '纯色',
      },
      bottom: {
        type: '铅笔裙',
        color: '深咖色',
        length: '及膝',
      },
      footwear: {
        type: '高跟鞋',
        color: '裸色',
      },
      accessories: ['简约手表', '皮革手提包', '门禁卡'],
    },
    expression_and_mood: {
      primary_emotion: '专业',
      description: '礼貌而疏远的微笑',
    },
  },
}

export const characterCardPrompt = {
  en: (userIdea: string, withImage: boolean): string => {
    const userIdeaText = userIdea ? `\n**User's Idea:** "${userIdea}"` : ''
    const referenceImageText = withImage
      ? '\n**Reference Image:** A reference image is provided. Analyze it carefully to capture visual details such as appearance, clothing, and mood.'
      : ''
    const baseInstruction = userIdea
      ? `Based on this idea`
      : `Based on the reference image`
    const instructionWithImage =
      withImage && userIdea
        ? `${baseInstruction} and the image`
        : baseInstruction
    const finalGenerationText = userIdea
      ? `Now, generate the character card for the user's idea: "${userIdea}".`
      : 'Now, generate the character card based on the provided reference image.'

    return `
You are an expert creative character designer. Your task is to take a user's input (${userIdea ? 'a high-level idea' : ''}${userIdea && withImage ? ' and ' : ''}${withImage ? 'a reference image' : ''}) and expand it into a detailed, structured character description.
${userIdeaText}${referenceImageText}

${instructionWithImage}, please generate a JSON object that STRICTLY follows the structure and format of the example below. Fill in every field with creative, consistent, and plausible details that bring the character to life.

**JSON Structure to Follow:**
\`\`\`json
${JSON.stringify(examplePersonAppearanceEn, null, 2)}
\`\`\`

**Instructions:**
1.  **Adhere to the Schema:** The output MUST be a single, valid JSON object. Do not add any text or explanations outside of the JSON structure.
2.  **Be Creative and Consistent:** The details in each field should logically connect and build a cohesive image of the character. For example, the clothing style should match the character's profession and personality.
3.  **Language:** Use English for all field values. You can include other languages in parentheses for names if appropriate, like in the example.
4.  **Completeness:** Fill out all fields as demonstrated in the example.

**Important:** If you need to think or plan your response, please enclose your internal thought process within <think> and </think> tags. The final output for the user must be outside these tags.

${finalGenerationText}
`
  },
  zh: (userIdea: string, withImage: boolean): string => {
    const userIdeaText = userIdea ? `\n**用户的想法:** "${userIdea}"` : ''
    const referenceImageText = withImage
      ? '\n**参考图片:** 已提供一张参考图。请仔细分析它，以捕捉外貌、服装和情绪等视觉细节。'
      : ''
    const baseInstruction = userIdea ? `请根据这个想法` : `请根据这张参考图片`
    const instructionWithImage =
      withImage && userIdea ? `${baseInstruction}和图片` : baseInstruction
    const finalGenerationText = userIdea
      ? `现在，请为用户的想法生成人物卡片：“${userIdea}”。`
      : '现在，请根据提供的参考图片生成人物卡片。'

    return `
你是一位专业的创意角色设计师。你的任务是根据用户提供的输入（${userIdea ? '一个高级概念' : ''}${userIdea && withImage ? '和' : ''}${withImage ? '一张参考图' : ''}），将其扩展为一个详细、结构化的角色描述。
${userIdeaText}${referenceImageText}

${instructionWithImage}，生成一个严格遵循以下示例结构和格式的 JSON 对象。请用富有创意、连贯一致且合乎逻辑的细节填充每一个字段，让角色栩栩如生。

**需要遵循的 JSON 结构:**
\`\`\`json
${JSON.stringify(examplePersonAppearanceZh, null, 2)}
\`\`\`

**指令:**
1.  **遵守结构:** 输出必须是一个单一、有效的 JSON 对象。不要在 JSON 结构之外添加任何文本或解释。
2.  **创意与一致性:** 每个字段中的细节都应在逻辑上相互关联，共同构建一个统一的角色形象。例如，服装风格应与角色的职业和个性相匹配。
3.  **语言:** 所有字段的值请使用中文。如果合适，可以在名称等字段中使用括号包含其他语言，如示例所示。
4.  **完整性:** 请像示例中那样填写所有字段。

**重要提示:** 如果你需要思考或规划你的回答，请将你的内部思考过程包裹在 <think> 和 </think> 标签中。用户的最终输出必须在这些标签之外。

${finalGenerationText}
`
  },
}
