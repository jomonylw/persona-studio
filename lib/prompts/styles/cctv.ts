import { StyleConfig } from './types'

export const cctv: StyleConfig = {
  role: {
    en: 'You are viewing the world through the lens of a security camera (CCTV). You observe from a high angle, detached and objective.',
    zh: '你正透过监控摄像头（CCTV）的镜头观察世界。你从高角度观察，保持疏离和客观。',
  },
  task: {
    en: 'Your task is to envision a surveillance footage still based on the provided character and environment references. It should feel grainy, low-res, and real.',
    zh: '你的任务是基于提供的人物和场景参考，构思一张监控录像截图。它应该感觉颗粒感强、低分辨率且真实。',
  },
  scenario: {
    single: {
      en: 'The character is unknowingly being watched as they move through the environment. A sense of surveillance or mystery.',
      zh: '人物在穿过环境时不知不觉地被监视着。一种监视感或神秘感。',
    },
    multi: {
      en: 'The characters are captured in a moment of interaction from a security feed. It looks like evidence or a secret observation.',
      zh: '人物互动的瞬间被监控画面捕捉到。看起来像是证据或秘密观察。',
    },
  },
  gesture: {
    single: {
      en: 'Walking, waiting, or acting suspiciously. Usually seen from above (high angle). Face might be obscured or seen in profile.',
      zh: '行走、等待或行迹可疑。通常从上方（高角度）观看。面部可能被遮挡或只能看到侧面。',
    },
    multi: {
      en: 'Exchanging items, whispering, or passing each other. The high angle distorts the perspective slightly.',
      zh: '交换物品、耳语或擦肩而过。高角度轻微扭曲了透视。',
    },
  },
  composition: {
    en: 'High angle, wide shot looking down. Fisheye distortion common. Time stamp or overlay graphics (REC, date) implied in the aesthetic.',
    zh: '高角度，俯视广角。鱼眼畸变常见。美学上暗示有时间戳或覆盖图形（录制中、日期）。',
  },
  lighting: {
    en: 'Harsh, unflattering artificial light or infrared night vision (monochrome green or bw). Shadows are stark and directionless.',
    zh: '刺眼、不美化的人造光或红外夜视（单色绿或黑白）。阴影生硬且没有方向感。',
  },
  coreStyle: {
    style: { en: 'CCTV Surveillance Footage', zh: '监控录像画面' },
    camera: {
      en: 'Security Camera, Low Resolution Sensor',
      zh: '安防摄像头，低分辨率传感器',
    },
    texture: {
      en: 'Pixelated, video artifacts, scanlines, digital noise',
      zh: '像素化，视频伪影，扫描线，数码噪点',
    },
    output: {
      en: 'Gritty, Realism, Found Footage',
      zh: '粗糙，现实主义，伪纪录片感',
    },
  },
}
