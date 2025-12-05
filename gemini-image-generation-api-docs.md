# Gemini (Nano Banana 🍌) 图像生成 API 完整文档

本指南详细介绍了如何使用 Gemini API 的图像生成与处理功能。您可以使用文本、图像或两者结合的方式向 Gemini 发出提示，以前所未有的灵活度创建、修改和迭代视觉内容。

## 功能概览

- **文生图 (Text-to-Image):** 根据简单或复杂的文本描述生成高质量图像。
- **图+文生图 (Image + Text-to-Image):** 提供图像并使用文本提示添加、移除或修改元素、更改风格或调整色彩。
- **多图到图 (Multi-Image to Image):** 使用多张输入图像合成新场景，或将一张图像的风格迁移到另一张。
- **迭代优化:** 通过对话在多轮互动中逐步优化图像。
- **高保真文本呈现:** 准确生成包含清晰易读且位置合理的文本的图像，非常适合用于徽标、图表和海报。

**注意:** 所有生成的图片都包含 [SynthID 水印](https://ai.google.dev/responsible/docs/safeguards/synthid?hl=zh-cn)。

---

## 模型选择

- **Gemini 3 Pro Image Preview (Nano Banana Pro 预览版):** 专为专业素材制作和复杂指令而设计。具有 Google 搜索接地、默认“思考”过程和高达 4K 分辨率的特点。
- **Gemini 2.5 Flash Image (Nano Banana):** 旨在提供快速高效的体验，适用于批量、低延迟的任务，并生成 1024 像素分辨率的图片。

---

## 核心功能

### 1. 图像生成（文生图）

根据描述性提示生成图像。

**JavaScript 示例:**

```javascript
import { GoogleGenAI } from '@google/genai'
import * as fs from 'node:fs'

async function main() {
  const ai = new GoogleGenAI({})
  const prompt =
    'Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme'
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
  })
  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text)
    } else if (part.inlineData) {
      const imageData = part.inlineData.data
      const buffer = Buffer.from(imageData, 'base64')
      fs.writeFileSync('gemini-native-image.png', buffer)
      console.log('Image saved as gemini-native-image.png')
    }
  }
}
main()
```

---

### 2. 图像编辑（图+文生图）

上传 base64 编码的图片，并结合文本提示进行修改。

**JavaScript 示例:**

```javascript
import { GoogleGenAI } from '@google/genai'
import * as fs from 'node:fs'

async function main() {
  const ai = new GoogleGenAI({})
  const imagePath = 'path/to/your/cat_image.png' // 修改为你的图片路径
  const imageData = fs.readFileSync(imagePath)
  const base64Image = imageData.toString('base64')
  const prompt = [
    {
      text: 'Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation',
    },
    { inlineData: { mimeType: 'image/png', data: base64Image } },
  ]
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
  })
  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text)
    } else if (part.inlineData) {
      const imageData = part.inlineData.data
      const buffer = Buffer.from(imageData, 'base64')
      fs.writeFileSync('gemini-native-image.png', buffer)
      console.log('Image saved as gemini-native-image.png')
    }
  }
}
main()
```

---

### 3. 多轮图像修改

通过聊天或多轮对话来迭代生成和修改图片。

**JavaScript 示例:**

```javascript
import { GoogleGenAI } from '@google/genai'
import * as fs from 'node:fs'

async function main() {
  const ai = new GoogleGenAI({})
  const chat = ai.chats.create({
    model: 'gemini-3-pro-image-preview',
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      tools: [{ googleSearch: {} }],
    },
  })

  const message1 =
    'Create a vibrant infographic that explains photosynthesis...'
  let response1 = await chat.sendMessage({ message: message1 })
  // ... (循环并保存图片)

  const message2 = 'Update this infographic to be in Spanish.'
  let response2 = await chat.sendMessage({ message: message2 })
  // ... (循环并保存新图片)
}
main()
```

---

## Gemini 3 Pro 图片功能新特性

- **最多 14 张参考图片:** 最多可混合使用 14 张参考图片（6 张高保真对象图片，5 张人像照片）。
- **使用 Google 搜索建立依据:** 根据实时信息（如天气、股市）生成图片。
- **生成高达 4K 分辨率的图片:** 在 `generation_config` 中指定 `image_size` 为 `2K` 或 `4K`。
- **思考过程:** 模型会利用“思考”过程来处理复杂提示，生成临时“思维图像”以优化最终输出。

---

## 批量生成图片

使用 [批量 API](https://ai.google.dev/gemini-api/docs/models/batch-api?hl=zh-cn) 可获得更高的速率限制，但需要等待最长 24 小时才能获得回复。您可以使用内嵌请求或 JSONL 输入文件。

---

## 提示指南和策略

- **描述场景，而非罗列关键字。**
- **具体化、提供上下文和意图。**
- **迭代和优化。**
- **使用分步指令。**
- **使用“语义负面提示”。**
- **控制镜头（使用摄影语言）。**

---

## 限制

- **语言:** 最佳性能语言包括英语、西班牙语、日语、中文、印地语。
- **输入:** 不支持音频或视频输入。
- **水印:** 所有生成的图片都包含 [SynthID 水印](https://ai.google.dev/responsible/docs/safeguards/synthid?hl=zh-cn)。

---

## 可选配置

### 输出类型

`response_modalities=['Image']` 可配置为仅返回图片。

### 宽高比

在 `image_config` 中设置 `aspect_ratio`，如 `16:9`。

| 宽高比 | Gemini 2.5 Flash 分辨率 | Gemini 3 Pro (1K/2K/4K)           |
| :----- | :---------------------- | :-------------------------------- |
| 1:1    | 1024x1024               | 1024x1024 / 2048x2048 / 4096x4096 |
| 16:9   | 1344x768                | 1376x768 / 2752x1536 / 5504x3072  |
| ...    | ...                     | ...                               |

---

## 何时使用 Imagen

| 特性         | Imagen                           | Gemini 原生图片                                           |
| :----------- | :------------------------------- | :-------------------------------------------------------- |
| **优势**     | 擅长高质量、特定风格的图片生成。 | **默认建议。** 灵活性高，情境理解能力强，支持对话式编辑。 |
| **可用性**   | 全面推出                         | 预览版                                                    |
| **延迟**     | 低                               | 较高                                                      |
| **费用**     | 按图片计费                       | 基于 Token                                                |
| **推荐任务** | 对图片质量、风格有高要求的任务。 | 需要文本与图片无缝融合、多图组合、精细编辑的任务。        |
