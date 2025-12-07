/**
 * =================================================================
 * Core Interfaces for Persona Studio
 * =================================================================
 */

/**
 * Represents a single generation/finetuning instance of an image.
 * This is a reusable utility type.
 */
export interface IImageHistory {
  id: string
  imageUrl: string
  prompt: string // The final prompt used for this specific generation
  createdAt: string
}

/**
 * =================================================================
 * Character Asset Interfaces (Structured Persona)
 * =================================================================
 */

export interface IPersonAppearance {
  person_appearance: {
    basic_info: {
      name: string
      nickname?: string
      perceived_age: string
      gender: 'Female' | 'Male' | 'Other' | '女性' | '男性' | '其他'
      ethnicity: string
    }
    body: {
      height: {
        value: number
        unit: 'cm' | 'ft' | '厘米' | '英尺'
        description?: string
      }
      build: string
      posture?: string
    }
    head_and_face: {
      face_shape: string
      skin: {
        tone: string
        texture?: string
        makeup?: string
      }
      hair: {
        color: string
        length: string
        style: string
        bangs?: boolean
        description?: string
      }
      eyes: {
        color: string
        shape: string
        glasses?: {
          is_wearing: boolean
          style?: string | null
        }
        description?: string
      }
      facial_hair?: {
        has_hair: boolean
        style?: string | null
      }
    }
    distinguishing_marks?: {
      type: string
      location: string
      description: string
    }[]
    clothing_and_accessories: {
      style_vibe: string
      top?: {
        type: string
        color: string
        pattern?: string
      }
      bottom?: {
        type: string
        color: string
        length?: string
      }
      footwear?: {
        type: string
        color: string
      }
      accessories?: string[]
    }
    expression_and_mood: {
      primary_emotion: string
      description?: string
    }
  }
}

/**
 * =================================================================
 * Core Asset & Project Interfaces
 * =================================================================
 */

// Discriminated union for different asset types
export type IAsset = ICharacterAsset | IEnvironmentAsset

/**
 * Represents a user-generated character asset with structured data.
 */
export interface ICharacterAsset {
  id: string
  name: string
  type: 'character'
  descriptor: IPersonAppearance // Structured data for the character
  imageUrl?: string // URL to the generated portrait
  history?: IImageHistory[]
  selectedHistoryId?: string
  referenceImage?: string | null
}

/**
 * Represents a user-generated environment asset.
 */
export interface IEnvironmentAsset {
  id: string
  name: string
  type: 'environment'
  prompt: string // Detailed description of the environment
  imageUrl?: string // URL to the generated image
  history?: IImageHistory[]
  selectedHistoryId?: string
  referenceImage?: string | null
}

/**
 * Represents a single generated photo, which is a composition of assets.
 */
export interface IPhoto {
  id: string
  prompt: string // The user's prompt for the action/story in the photo
  characterIds: string[] // IDs of characters used in the photo
  environmentId?: string // ID of the environment used
  imageUrl?: string // The final generated image URL
  history?: IImageHistory[]
  selectedHistoryId?: string
  referenceImage?: string | null // Optional reference image for pose/composition
}

/**
 * Represents the entire state of a single Persona Studio project.
 * This is the structure that will be saved and loaded.
 */
export interface IStudioProject {
  // From Asset Library
  characters: ICharacterAsset[]
  environments: IEnvironmentAsset[]

  // From Photoshoot Studio
  photos: IPhoto[]

  // Global Generation Settings
  artStyle: string // A general art style prompt (e.g., "cinematic, hyperrealistic")
  artStyleImage?: string | null // An image to use as a style reference
  aspectRatio: string
  resolution: string
  textModel?: string
  imageModel?: string

  // Metadata
  version: string
  createdAt: string
}

/**
 * =================================================================
 * Type definition for internationalization messages
 * =================================================================
 */
import zh from '@/messages/zh.json'

export type IntlMessages = typeof zh
