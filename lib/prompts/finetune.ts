const en = (finetuneInstruction: string) => {
  return `
    **Image Finetuning Request**

    You are an expert digital artist. Your task is to edit an existing image based on a specific instruction.

    **Finetuning Instruction:**
    ${finetuneInstruction}

    **IMPORTANT:**
    - Apply the "Finetuning Instruction" to the provided image.
    - Do not drastically change the original image's composition unless specifically asked to.
    - Maintain the overall art style.
    - Return only the edited image.
  `.trim()
}

const zh = (finetuneInstruction: string) => {
  return `
    **图片微调请求**

    你是一位专业的数字艺术家。你的任务是根据一个具体的指令来编辑一张现有的图片。

    **微调指令:**
    ${finetuneInstruction}

    **重要提示:**
    - 将“微调指令”应用到提供的图片上。
    - 除非有明确要求，否则不要大幅改变原始图片的构图。
    - 保持整体艺术风格。
    - 只返回编辑后的图片。
  `.trim()
}

export const finetunePrompt = {
  en,
  zh,
}

const enWithReference = (finetuneInstruction: string) => {
  return `
    **Advanced Image Finetuning Request with Reference**

    You are an expert digital artist. Your task is to edit a "base image" based on a "finetuning instruction", while also using a "reference image" as visual context to better understand and execute the instruction.

    **Base Image:**
    [The user will provide the image to be edited]

    **Reference Image:**
    [The user will provide the reference image for visual context]

    **Finetuning Instruction:**
    ${finetuneInstruction}

    **Your Task:**
    1.  **Analyze all inputs:** Carefully examine the "base image", the "reference image", and the "finetuning instruction".
    2.  **Understand the Intent:** The "reference image" provides crucial visual context for the instruction. Your primary goal is to understand *why* the user provided this reference. It could be for art style, color palette, lighting, composition, character pose, a specific object's appearance, or any other visual element.
    3.  **Intelligent Application:** Based on the "finetuning instruction", intelligently extract the relevant visual elements from the "reference image" and apply them to the "base image".
        - If the instruction is "change the style to be more like this," you should focus on the art style, textures, and lighting of the reference.
        - If the instruction is "make the character adopt this pose," you should focus on the character's posture in the reference.
        - If the instruction is vague, use your artistic judgment to determine the most important aspects of the reference image to incorporate.
    4.  **Preserve Identity:** Maintain the core identity of the characters and objects in the "base image" unless the instruction explicitly asks to change them.
    5.  **Return only the final, edited image.**
  `.trim()
}

const zhWithReference = (finetuneInstruction: string) => {
  return `
    **带参考图的高级图片微调请求**

    你是一位专业的数字艺术家。你的任务是根据一个“微调指令”来编辑一张“基础图片”，同时使用一张“参考图”作为视觉上下文，以更好地理解和执行该指令。

    **基础图片:**
    [用户将提供需要编辑的图片]

    **参考图:**
    [用户将提供用于视觉上下文的参考图片]

    **微调指令:**
    ${finetuneInstruction}

    **你的任务:**
    1.  **分析所有输入：** 仔细检查“基础图片”、“参考图”和“微调指令”。
    2.  **理解意图：** “参考图”为指令提供了关键的视觉上下文。你的主要目标是理解用户*为什么*提供这张参考图。它可能用于参考艺术风格、调色板、光照、构图、角色姿势、特定物体的外观或任何其他视觉元素。
    3.  **智能应用：** 根据“微调指令”，智能地从“参考图”中提取相关的视觉元素，并将其应用到“基础图片”上。
        - 如果指令是“把风格变得更像这样”，你应该专注于参考图的艺术风格、纹理和光照。
        - 如果指令是“让角色摆出这个姿势”，你应该专注于参考图中角色的姿态。
        - 如果指令含糊不清，请运用你的艺术判断力来决定参考图中最重要的方面并加以融合。
    4.  **保持身份：** 保持“基础图片”中角色和物体的核心身份，除非指令明确要求更改它们。
    5.  **仅返回最终编辑好的图片。**
  `.trim()
}

export const finetuneWithReferencePrompt = {
  en: enWithReference,
  zh: zhWithReference,
}
