import React, { useEffect, useState } from "react"
import StartupItems from "../components/StartupInfo/StartupItems"
import StartupDetails from "../components/StartupInfo/StartupDetails"
import { useCanister } from "@connect2ic/react"
import { Startup } from "frontend/components/CommonTypes"
import { useParams } from "react-router-dom"

export default function StartupPage() {
  const [backend] = useCanister("backend")
  const [startup, setStartup] = useState<Startup | undefined | null>(null)
  const {startupId} = useParams()

  useEffect(() => {
    async function getStartUpByID(
      startupId: string,
    ): Promise<Startup | undefined> {
      const resStartUpByID: Startup | undefined | null =
        (await backend.getStartUpByID(startupId)) as Startup | undefined | null
      return resStartUpByID
    }
    
    const resStartUpByID = getStartUpByID(startupId)
      .then((startup) => {
        setStartup(startup[0])
        return startup[0]
      })
      .catch((error) => console.error(error))
  }, [])

  if (!startup) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <StartupItems startup={startup} />
      <StartupDetails startup={startup} />
    </>
  )
}
