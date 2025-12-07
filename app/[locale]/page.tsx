import ProjectProvider from './project-provider'
import ProjectPage from './page-content'
import { GEMINI_TEXT_MODEL_NAME, GEMINI_IMAGE_MODEL_NAME } from '@/lib/gemini'

export default function Home() {
  return (
    <ProjectProvider
      textModel={GEMINI_TEXT_MODEL_NAME}
      imageModel={GEMINI_IMAGE_MODEL_NAME}
    >
      <ProjectPage />
    </ProjectProvider>
  )
}
