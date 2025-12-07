import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { IStudioProject } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts a JSON object from a string that might be wrapped in markdown code blocks
 * or other text.
 * @param str The string to parse.
 * @returns The cleaned JSON string, or null if no valid JSON object is found.
 */
export function extractJson(str: string): string | null {
  const jsonRegex = /\{[\s\S]*\}/
  const match = str.match(jsonRegex)

  if (match) {
    return match[0]
  }

  return null
}

export const exportProject = async (projectState: IStudioProject) => {
  const zip = new JSZip()

  // 1. 创建 project.json，剥离掉图片数据
  const projectDataToSave: IStudioProject = {
    ...projectState,
    artStyleImage: projectState.artStyleImage
      ? 'file:assets/art-style-image.png'
      : undefined,
    characters: (projectState.characters || []).map((c) => ({
      ...c,
      imageUrl: c.imageUrl ? `file:assets/character-${c.id}.png` : undefined,
      referenceImage: c.referenceImage
        ? `file:assets/character-${c.id}-reference.png`
        : undefined,
      history: c.history?.map((h) => ({
        ...h,
        imageUrl: `file:assets/character-${c.id}-history-${h.id}.png`,
      })),
    })),
    environments: (projectState.environments || []).map((e) => ({
      ...e,
      imageUrl: e.imageUrl ? `file:assets/environment-${e.id}.png` : undefined,
      referenceImage: e.referenceImage
        ? `file:assets/environment-${e.id}-reference.png`
        : undefined,
      history: e.history?.map((h) => ({
        ...h,
        imageUrl: `file:assets/environment-${e.id}-history-${h.id}.png`,
      })),
    })),
    photos: (projectState.photos || []).map((p) => ({
      ...p,
      imageUrl: p.imageUrl ? `file:photos/photo-${p.id}.png` : undefined,
      referenceImage: p.referenceImage
        ? `file:photos/photo-${p.id}-reference.png`
        : undefined,
      history: p.history?.map((h) => ({
        ...h,
        imageUrl: `file:photos/photo-${p.id}-history-${h.id}.png`,
      })),
    })),
  }
  zip.file('project.json', JSON.stringify(projectDataToSave, null, 2))

  // 2. 添加所有图片资源
  const assetsFolder = zip.folder('assets')
  const photosFolder = zip.folder('photos')

  // 添加艺术风格参考图
  if (projectState.artStyleImage) {
    const response = await fetch(projectState.artStyleImage)
    const blob = await response.blob()
    assetsFolder?.file('art-style-image.png', blob)
  }

  // 添加素材图片
  for (const asset of [
    ...projectState.characters,
    ...projectState.environments,
  ]) {
    if (asset.imageUrl) {
      const response = await fetch(asset.imageUrl)
      const blob = await response.blob()
      assetsFolder?.file(`${asset.type}-${asset.id}.png`, blob)
    }
    if (asset.referenceImage) {
      const response = await fetch(asset.referenceImage)
      const blob = await response.blob()
      assetsFolder?.file(`${asset.type}-${asset.id}-reference.png`, blob)
    }
    // 添加素材历史图片
    if (asset.history) {
      for (const historyItem of asset.history) {
        const response = await fetch(historyItem.imageUrl)
        const blob = await response.blob()
        assetsFolder?.file(
          `${asset.type}-${asset.id}-history-${historyItem.id}.png`,
          blob,
        )
      }
    }
  }

  // 添加照片图片
  for (const photo of projectState.photos || []) {
    if (photo.imageUrl) {
      const response = await fetch(photo.imageUrl)
      const blob = await response.blob()
      photosFolder?.file(`photo-${photo.id}.png`, blob)
    }
    if (photo.referenceImage) {
      const response = await fetch(photo.referenceImage)
      const blob = await response.blob()
      photosFolder?.file(`photo-${photo.id}-reference.png`, blob)
    }
    // 添加照片历史图片
    if (photo.history) {
      for (const historyItem of photo.history) {
        const response = await fetch(historyItem.imageUrl)
        const blob = await response.blob()
        photosFolder?.file(
          `photo-${photo.id}-history-${historyItem.id}.png`,
          blob,
        )
      }
    }
  }

  // 3. 生成并下载 ZIP 文件
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, 'persona-project.zip')
  })
}

export const importProject = async (file: File): Promise<IStudioProject> => {
  console.log('importProject: Starting...')
  const zip = await JSZip.loadAsync(file)
  console.log('importProject: ZIP file loaded.')
  const projectFile = zip.file('project.json')

  if (!projectFile) {
    console.error('importProject: project.json not found in ZIP.')
    throw new Error('Invalid project file: project.json not found.')
  }
  console.log('importProject: project.json found.')

  const projectData: IStudioProject = JSON.parse(
    await projectFile.async('string'),
  )
  console.log('importProject: project.json parsed.', projectData)

  // 异步加载所有图片并替换 file: 占位符
  const loadImage = async (path: string | null | undefined) => {
    if (!path || !path.startsWith('file:')) {
      return path
    }
    const filePath = path.substring(5)
    console.log(`importProject: Loading image - ${filePath}`)
    const imageFile = zip.file(filePath)
    if (imageFile) {
      const blob = await imageFile.async('blob')
      const objectURL = URL.createObjectURL(blob)
      console.log(
        `importProject: Image loaded successfully - ${filePath} -> ${objectURL}`,
      )
      return objectURL
    }
    console.warn(`importProject: Image file not found - ${filePath}`)
    return undefined
  }

  projectData.artStyleImage = await loadImage(projectData.artStyleImage)

  projectData.characters = await Promise.all(
    (projectData.characters || []).map(async (c) => ({
      ...c,
      imageUrl: (await loadImage(c.imageUrl)) || undefined,
      referenceImage: (await loadImage(c.referenceImage)) || undefined,
      history: c.history
        ? await Promise.all(
            c.history.map(async (h) => ({
              ...h,
              imageUrl: (await loadImage(h.imageUrl))!,
            })),
          )
        : undefined,
    })),
  )

  projectData.environments = await Promise.all(
    (projectData.environments || []).map(async (e) => ({
      ...e,
      imageUrl: (await loadImage(e.imageUrl)) || undefined,
      referenceImage: (await loadImage(e.referenceImage)) || undefined,
      history: e.history
        ? await Promise.all(
            e.history.map(async (h) => ({
              ...h,
              imageUrl: (await loadImage(h.imageUrl))!,
            })),
          )
        : undefined,
    })),
  )

  projectData.photos = await Promise.all(
    (projectData.photos || []).map(async (p) => {
      const photoHistory = p.history
        ? await Promise.all(
            p.history.map(async (h) => ({
              ...h,
              imageUrl: (await loadImage(h.imageUrl))!,
            })),
          )
        : undefined

      return {
        ...p,
        imageUrl: (await loadImage(p.imageUrl)) || undefined,
        referenceImage: (await loadImage(p.referenceImage)) || undefined,
        history: photoHistory,
      }
    }),
  )

  console.log(
    'importProject: All data processed. Returning final project data.',
  )
  return projectData
}

/**
 * Converts any image URL (data:, blob:, http:, etc.) to a pure Base64 string.
 * @param url The URL of the image to convert.
 * @returns A Promise that resolves to the pure Base64 string.
 */
export const urlToPureBase64 = async (
  url: string | undefined,
): Promise<string | undefined> => {
  if (!url) return undefined
  if (url.startsWith('data:')) {
    return url.split(',')[1]
  }
  // For blob URLs or other URLs, fetch and convert
  const response = await fetch(url)
  const blob = await response.blob()
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
  return dataUrl.split(',')[1]
}

/**
 * Generates a UUID.
 * It tries to use the built-in crypto.randomUUID() if available (in secure contexts),
 * otherwise falls back to a Math.random()-based implementation.
 * @returns A UUID string.
 */
export const generateUUID = () => {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for non-secure contexts
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
