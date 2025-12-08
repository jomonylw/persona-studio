import { StyleConfig } from './types'

export const selfie: StyleConfig = {
  role: {
    en: 'Your function is to conceive a frame for a first-person perspective (POV) selfie based on the provided instructions.',
    zh: '你的功能是根据指令，构思一个完全符合第一人称视角（POV）的自拍画面。',
  },
  task: {
    en: "Your task is to conceive an absolute first-person perspective (POV) selfie. The frame must appear as if seen through the viewer's own eyes, with the character's eyes looking directly at the lens, and the phone itself must not be visible in the shot.",
    zh: '你的任务是构思一张绝对第一人称视角（POV）的自拍。画面必须仿佛是观看者自己的眼睛所见，人物的眼睛直视镜头，且手机本身绝不能出现在画面中。',
  },
  scenario: {
    single: {
      en: 'The character is taking a selfie to document their presence in this environment. It feels personal and direct. As it is a front-camera perspective, the phone itself is not visible in the shot.',
      zh: '人物正在自拍以记录他们在这个环境中的存在。感觉私人且直接。由于是前置摄像头视角，手机本身不会出现在画面中。',
    },
    multi: {
      en: 'The characters are taking a group selfie (we-fie) together. Focus on their closeness and the shared memory. As it is a front-camera perspective, the phone itself is not visible in the shot.',
      zh: '人物正在一起拍合影自拍。关注他们的亲密感和共同的记忆。由于是前置摄像头视角，手机本身不会出现在画面中。',
    },
  },
  gesture: {
    single: {
      en: "The character's eyes must be looking directly into the camera lens, making direct eye contact with the viewer. The composition implies the photo was taken at arm's length, possibly showing a bit of the arm or shoulder at the edge of the frame, reinforcing the self-shot feel.",
      zh: '人物的眼睛必须直视镜头，与观看者产生直接的目光接触。构图暗示了照片是在一臂之遥的距离拍摄的，画面的边缘可能会稍微露出部分手臂或肩膀，以增强自拍的感觉。',
    },
    multi: {
      en: 'One character holds the phone with one hand for a group shot. Heads close together. The composition feels naturally unstable, like a quick snapshot.',
      zh: '其中一人单手手持手机拍摄合影。头靠得很近。构图感觉自然且带有一点不稳定，像是一个快速抓拍的快照。',
    },
  },
  composition: {
    en: "POV shot, first-person perspective (Viewer's Eye Perspective). The composition is typical of a selfie taken with a front-facing camera, featuring a slight wide-angle effect. To enhance realism, subtle imperfections like minor lens flare or slight chromatic aberration from strong light sources are acceptable. Avoid excessive barrel distortion like that of a fisheye lens. The subject is in the foreground, with the background visible but slightly blurred due to a shallow depth of field. The phone used to take the picture is not visible.",
    zh: 'POV镜头，第一人称视角（观看者之眼）。构图是典型的前置摄像头自拍，带有轻微的广角效果。为了增强真实感，允许出现由强光源引起的微妙镜头光晕或轻微的色差。避免类似鱼眼镜头的过度桶形失真。主体位于前景，背景可见但因景深较浅而略带模糊。用于拍照的手机本身不可见。',
  },
  lighting: {
    en: 'The lighting is typically imperfect and casual, sourced from the real environment, not artificial studio lighting. It may not be perfectly even, allowing for slight local overexposure (e.g., from a window) or underexposure to reflect the complexity of real-world light.',
    zh: '光线通常是不完美的、随意的，源自真实环境，而非人工布光。它可能不完全均匀，允许出现轻微的局部过曝（如窗边的亮光）或曝光不足，以反映真实世界光线的复杂性。',
  },
  coreStyle: {
    style: { en: 'Social Media Selfie', zh: '社交媒体自拍' },
    camera: {
      en: 'Smartphone Front Camera',
      zh: '智能手机前置摄像头',
    },
    texture: {
      en: "The focus is sharp on the character's face (especially the eyes), but may also have extremely subtle motion blur from slight handshake. A not 100% perfect focus is acceptable. In low-light areas, slight digital noise is present. The color reproduction is realistic, with subtle color temperature shifts due to ambient light.",
      zh: '人物面部（尤其是眼睛）的焦点清晰锐利，但也可能因为轻微的手部抖动而产生极其细微的动态模糊。允许出现并非百分之百完美的对焦。在暗部或光线不足的区域，存在轻微的数码噪点。色彩还原真实，偶尔会因环境光影响产生微妙的色温偏移。',
    },
    output: {
      en: 'Authentic POV Selfie, Personal, Engaging, First-Person View',
      zh: '真实POV自拍，私人，迷人，第一人称视角',
    },
  },
}
