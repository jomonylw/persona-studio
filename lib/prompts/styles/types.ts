export type PhotoshootStyle =
  | 'candid_street'
  | 'cinematic'
  | 'high_fashion'
  | 'japanese_soft'
  | 'cyberpunk'
  | 'vintage_film'
  | 'bw_art'
  | 'selfie'
  | 'minimalist'
  | 'professional_headshot'
  | 'cctv'
  | 'mirror_selfie'
  | 'portrait_closeup'
  | 'fuji_instax'

export interface StyleConfig {
  role: {
    en: string
    zh: string
  }
  task: {
    en: string
    zh: string
  }
  scenario: {
    single: { en: string; zh: string }
    multi: { en: string; zh: string }
  }
  gesture: {
    single: { en: string; zh: string }
    multi: { en: string; zh: string }
  }
  composition: {
    en: string
    zh: string
  }
  lighting: {
    en: string
    zh: string
  }
  coreStyle: {
    style: { en: string; zh: string }
    camera: { en: string; zh: string }
    texture: { en: string; zh: string }
    output: { en: string; zh: string }
  }
}
