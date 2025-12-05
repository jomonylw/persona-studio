import ProjectProvider from './project-provider'
import ProjectPage from './page-content'

export default function Home() {
  return (
    <ProjectProvider>
      <ProjectPage />
    </ProjectProvider>
  )
}
