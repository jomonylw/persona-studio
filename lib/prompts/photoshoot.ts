import { ICharacterAsset, IEnvironmentAsset } from '@/types'

const generatePrompt = (
  characters: ICharacterAsset[],
  environment: IEnvironmentAsset,
  aspectRatio: string,
  lang: 'en' | 'zh',
): string => {
  const characterCount = characters.length
  const characterNames = characters.map((c) => c.name).join(', ')
  const environmentName = environment.name

  const singleCharacterScenarioZh = `偶然遇到了人物 ${characterNames} 出现在这个场景中。你需要构思一个指令，用于生成一张看起来完全是自然抓拍、而非刻意摆拍的照片。请专注于创造一个充满氛围和真实感的个人瞬间。`
  const multiCharacterScenarioZh = `偶然捕捉到了 ${characterNames} 一行 ${characterCount} 人在这个场景中的互动瞬间。你需要构思一个指令，用于生成一张看起来完全是自然抓拍、而非刻意摆拍的照片。请专注于他们之间真实、生动的关系和氛围。`
  const scenarioZh =
    characterCount > 1 ? multiCharacterScenarioZh : singleCharacterScenarioZh

  const singleCharacterGestureZh = `人物在做什么？（例如：在街角等待、匆匆走过、看着橱窗、与环境互动）。关键是“不经意”，人物的视线最好离开镜头。`
  const multiCharacterGestureZh = `他们在做什么？描述他们之间自然的互动（例如：热烈交谈、并肩而行、共享一个笑话、在人群中交换眼神）。关键是捕捉他们关系的真实状态，避免看向镜头。`
  const gestureZh =
    characterCount > 1 ? multiCharacterGestureZh : singleCharacterGestureZh

  if (lang === 'zh') {
    const prompt = `
      你是一位顶尖的街头纪实摄影师，擅长用徕卡相机捕捉城市中不经意的、充满故事感的瞬间。
      你的任务是基于提供的人物和场景参考图，构思一个电影质感的街头抓拍场景。

      **输入信息:**
      - **人物:** ${characterNames} (共 ${characterCount} 人，参考图已提供)
      - **场景:** ${environmentName} (参考图已提供)
      - **画幅比例:** ${aspectRatio}

      **你的任务:**
      想象你正在街头游走，${scenarioZh}

      你的描述需要包含以下核心要素：

      1.  **场景情境 (Scenario):** ${gestureZh}
      2.  **构图与视角 (Composition & Angle):** 采用纪实摄影的构图方式。${
        characterCount > 1
          ? '巧妙安排多个人物的位置，形成有层次和故事感的画面关系，避免呆板的并排站立。'
          : ''
      }可以是稍微倾斜的视角、透过某个物体（如窗户、人群）的窥视感，或者将人物巧妙地融入复杂的城市背景中，营造出纵深感和故事性。
      3.  **光线氛围 (Atmospheric Lighting):** 描述自然且有戏剧性的光线。例如：午后斜阳穿过小巷拉出的长影、霓虹灯在湿漉漉街道上的反射、阴天柔和的漫射光等。光线是情绪和氛围的关键。
      4.  **姿态与动态 (Gesture & Motion):** 捕捉人物最自然的姿态和动态瞬间。${
        characterCount > 1
          ? '强调人物间的互动姿态，如手势、身体朝向、眼神交流等。'
          : '可以是走路时扬起的衣角、一个不经意的回头、整理头发的手。'
      }强调“非摆拍”的、生活化的动作，可以带有轻微的动态模糊。
      5.  **核心风格与质感 (Core Style & Texture):**
          - **风格:** 纪实街头摄影 (Candid street photography)。
          - **相机与胶片:** 35mm胶片拍摄，Leica M6相机，柯达Portra 400胶卷。
          - **质感:** 丰富的颗粒感、电影般的色彩、高光和阴影部分的细节保留。
          - **最终效果:** 8K分辨率，超现实画质。

      **输出要求:**
      - 直接输出最终的摄影指令，语言要充满艺术感和指导性。
      - 避免使用“主光”、“补光”等棚拍术语，多使用描述自然光线的词汇。
      - 整体描述要像一个故事片段，而非技术参数列表。
    `
    console.log('Photoshoot Prompt (zh):', prompt)
    return prompt
  }

  const singleCharacterScenarioEn = `you coincidentally encounter the character ${characterNames} in this environment. You need to create a prompt to generate a photograph that looks completely candid and unposed. Focus on creating a moment filled with atmosphere and authenticity for a single person.`
  const multiCharacterScenarioEn = `you coincidentally capture a moment of interaction between ${characterNames}, a group of ${characterCount} people, in this scene. You need to create a prompt to generate a photograph that looks completely candid and unposed. Focus on the authentic, dynamic relationship and atmosphere between them.`
  const scenarioEn =
    characterCount > 1 ? multiCharacterScenarioEn : singleCharacterScenarioEn

  const singleCharacterGestureEn = `What is the character doing? (e.g., waiting at a street corner, walking briskly, looking into a shop window, interacting with the environment). The key is "spontaneous," with the character preferably looking away from the camera.`
  const multiCharacterGestureEn = `What are they doing? Describe their natural interaction (e.g., engaged in a lively conversation, walking side-by-side, sharing a laugh, exchanging a glance in a crowd). The key is to capture the genuine state of their relationship, avoiding any direct poses to the camera.`
  const gestureEn =
    characterCount > 1 ? multiCharacterGestureEn : singleCharacterGestureEn

  const prompt = `
    You are a top-tier candid street photographer, renowned for capturing spontaneous, story-rich moments in urban landscapes with your Leica camera.
    Your task is to envision a cinematic street photography scene based on the provided character and environment references.

    **Input Information:**
    - **Character(s):** ${characterNames} (${characterCount} in total, reference image provided)
    - **Scene:** ${environmentName} (Reference image provided)
    - **Aspect Ratio:** ${aspectRatio}

    **Your Task:**
    Imagine you are wandering the streets and ${scenarioEn}

    Your description must include the following core elements:

    1.  **Scenario:** ${gestureEn}
    2.  **Composition & Angle:** Use a documentary-style composition. ${
      characterCount > 1
        ? 'Cleverly arrange the multiple subjects to create a layered and narrative composition, avoiding stiff, side-by-side posing. '
        : ''
    }This could involve a slightly tilted angle, a voyeuristic shot through an object (like a window or a crowd), or cleverly placing the character(s) within a complex urban background to create depth and narrative.
    3.  **Atmospheric Lighting:** Describe natural and dramatic lighting. For example: long shadows cast by the late afternoon sun down an alley, reflections of neon signs on wet pavement, or the soft, diffused light of an overcast day. Light is key to mood and atmosphere.
    4.  **Gesture & Motion:** Capture the character(s) in their most natural gestures or moments of action. ${
      characterCount > 1
        ? 'Emphasize interactive gestures between the subjects, such as hand movements, body orientation, and eye contact. '
        : 'It could be the hem of a coat lifting while walking, a casual glance back, a hand brushing through hair. '
    }Emphasize unposed, real-life actions, incorporating a slight motion blur.
    5.  **Core Style & Texture:**
        - **Style:** Candid street photography.
        - **Camera & Film:** Shot on 35mm film, Leica M6, Kodak Portra 400.
        - **Texture:** Rich grainy texture, cinematic color palette, with detail retained in highlights and shadows.
        - **Final Output:** Photorealistic, 8K resolution.

    **Output Requirements:**
    - Directly output the final photography brief in artistic and evocative language.
    - Avoid studio terms like "key light" or "fill light." Instead, use descriptive words for natural light.
    - The overall description should read like a narrative snapshot, not a list of technical specs.
  `
  console.log('Photoshoot Prompt (en):', prompt)
  return prompt
}

export const photoshootPrompt = {
  en: (
    characters: ICharacterAsset[],
    environment: IEnvironmentAsset,
    aspectRatio: string,
  ): string => {
    return generatePrompt(characters, environment, aspectRatio, 'en')
  },
  zh: (
    characters: ICharacterAsset[],
    environment: IEnvironmentAsset,
    aspectRatio: string,
  ): string => {
    return generatePrompt(characters, environment, aspectRatio, 'zh')
  },
}
