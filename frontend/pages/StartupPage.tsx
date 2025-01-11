import React, { useEffect, useState } from "react"
import StartupItems from "../components/StartupInfo/StartupItems"
import StartupDetails from "../components/StartupInfo/StartupDetails"
import { useCanister } from "@connect2ic/react"
import { Project } from "frontend/components/CommonTypes"
import { useParams } from "react-router-dom"

export default function StartupPage() {
  const [backend] = useCanister("backend")
  const [project, setProject] = useState<Project | undefined | null>(null)
  const {projectId} = useParams()

  useEffect(() => {
    async function getProjectByID(
      projectId: string,
    ): Promise<Project | undefined> {
      const resProjectByID: any[] | undefined | null =
        (await backend.getProjectByID(projectId)) as any[] | undefined | null
      return resProjectByID[0]
    }
    
    const resProjectByID = getProjectByID(projectId)
      .then((project) => {
        setProject(project)
        return project
      })
      .catch((error) => console.error(error))
  }, [])

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <StartupItems project={project} />
      <StartupDetails project={project} />
    </>
  )
}
