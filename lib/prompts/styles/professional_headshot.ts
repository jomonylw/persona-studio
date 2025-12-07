import { StyleConfig } from './types'

export const professionalHeadshot: StyleConfig = {
  role: {
    en: 'You are a professional portrait photographer, expert in lighting and capturing the best features of your subject for corporate or casting purposes.',
    zh: '你是一位专业的人像摄影师，擅长布光并捕捉拍摄对象最完美的特征，用于商务或试镜用途。',
  },
  task: {
    en: 'Your task is to envision a polished, high-quality headshot or portrait based on the provided character and environment references.',
    zh: '你的任务是基于提供的人物和场景参考，构思一张精致、高质量的头像或肖像照。',
  },
  scenario: {
    single: {
      en: 'The character is posing for a professional profile picture or portfolio shot. The environment is a blurred background.',
      zh: '人物正在拍摄专业的个人头像或作品集照片。环境作为虚化的背景存在。',
    },
    multi: {
      en: 'The characters are posing for a team introduction or a cast photo. They look professional and cohesive.',
      zh: '人物正在拍摄团队介绍或剧组照。他们看起来专业且有凝聚力。',
    },
  },
  gesture: {
    single: {
      en: 'Looking directly at the camera with a confident, approachable, or serious expression depending on their role. Slight head tilt or shoulder turn.',
      zh: '直视镜头，根据角色展现自信、亲切或严肃的表情。轻微的歪头或侧肩。',
    },
    multi: {
      en: 'Standing close, perhaps overlapping shoulders slightly. Uniform expressions and eyelines. Structured posing.',
      zh: '站得很近，可能肩膀轻微重叠。统一的表情和视线。结构化的姿势。',
    },
  },
  composition: {
    en: 'Classic portrait composition. Head and shoulders or waist-up. Shallow depth of field to separate subject from background. Sharp focus on eyes.',
    zh: '经典肖像构图。头肩照或半身照。浅景深将主体与背景分离。焦点锐利地对准眼睛。',
  },
  lighting: {
    en: 'Studio quality lighting. Rembrandt, Loop, or Butterfly lighting patterns. Softbox or beauty dish used for flattering skin tones. Catchlights in eyes.',
    zh: '影棚级布光。伦勃朗光、环形光或蝴蝶光。使用柔光箱或雷达罩来美化肤色。眼中有眼神光。',
  },
  coreStyle: {
    style: { en: 'Professional Studio Portrait', zh: '专业影棚肖像' },
    camera: {
      en: 'Canon EOS R5, 85mm Portrait Lens',
      zh: '佳能 EOS R5，85mm 人像镜头',
    },
    texture: {
      en: 'Smooth skin, sharp details, creamy bokeh, high fidelity',
      zh: '平滑皮肤，锐利细节，奶油般散景，高保真',
    },
    output: {
      en: 'Commercial, Polished, Trustworthy',
      zh: '商业感，精致，值得信赖',
    },
  },
}
