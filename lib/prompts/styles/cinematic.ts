import { StyleConfig } from './types'

export const cinematic: StyleConfig = {
  role: {
    en: 'You are a master cinematographer and film still photographer, known for creating emotionally charged, visually stunning scenes reminiscent of high-budget cinema.',
    zh: '你是一位大师级的电影摄影指导和剧照摄影师，以创作充满情感张力、视觉效果震撼的电影质感画面而闻名。',
  },
  task: {
    en: 'Your task is to envision a cinematic movie still based on the provided character and environment references.',
    zh: '你的任务是基于提供的人物和场景参考，构思一张具有电影质感的剧照。',
  },
  scenario: {
    single: {
      en: 'The character is the protagonist of a film scene taking place in this environment. Focus on narrative depth and emotional resonance.',
      zh: '人物是该场景中电影片段的主角。请专注于叙事深度和情感共鸣。',
    },
    multi: {
      en: 'The characters are in a pivotal scene of a movie. Focus on the dramatic tension and relationship dynamics between them.',
      zh: '人物处于电影的关键场景中。请专注于他们之间的戏剧张力和关系动态。',
    },
  },
  gesture: {
    single: {
      en: 'What is the protagonist doing? Describe a subtle but meaningful action or a moment of stillness that conveys their internal state. Avoid looking directly at the camera unless it breaks the fourth wall intentionally.',
      zh: '主角在做什么？描述一个微妙但意味深长的动作，或者一个传达内心状态的静止瞬间。避免直视镜头，除非是有意打破第四面墙。',
    },
    multi: {
      en: 'How are they interacting? Describe the blocking and body language that reveals their conflict, alliance, or shared moment. Focus on the subtext of their interaction.',
      zh: '他们如何互动？描述揭示他们冲突、结盟或共享时刻的走位和肢体语言。关注互动的潜台词。',
    },
  },
  composition: {
    en: 'Use a cinematic composition, such as the rule of thirds, leading lines, or a shallow depth of field (bokeh) to isolate the subject. The framing should feel deliberate and wide-screen (anamorphic).',
    zh: '使用电影构图，如三分法、引导线或浅景深（散景）来突出主体。构图应感觉经过深思熟虑，具有宽银幕（变形镜头）感。',
  },
  lighting: {
    en: 'Cinematic lighting. Use motivated lighting, chiaroscuro (contrast between light and dark), or color contrast (e.g., teal and orange) to set the mood. The lighting should be dramatic and storytelling.',
    zh: '电影级布光。使用有动机的光线、明暗对照法（chiaroscuro）或色彩对比（如青橙色调）来设定基调。光线应具有戏剧性和叙事性。',
  },
  coreStyle: {
    style: { en: 'Cinematic Movie Still', zh: '电影剧照' },
    camera: {
      en: 'Arri Alexa, Anamorphic lens',
      zh: 'Arri Alexa 摄影机，变形镜头',
    },
    texture: {
      en: 'Fine grain, high dynamic range, cinematic color grading',
      zh: '细腻颗粒，高动态范围，电影级调色',
    },
    output: { en: '8K, Ultra-realistic, Widescreen', zh: '8K，超写实，宽银幕' },
  },
}
