import React, { useEffect, useState } from "react"
import StartupItems from "../components/StartupInfo/StartupItems"
import StartupDetails from "../components/StartupInfo/StartupDetails"
import JoinDiscord from "../components/home/JoinDiscord"
import { useCanister } from "@connect2ic/react"
import { Startup } from "frontend/components/CommonTypes"

export default function StartupPage() {
  const [backend] = useCanister("backend")
  const [startup, setStartup] = useState<Startup | undefined | null>()

  useEffect(() => {
    const resStartUpByID = getStartUpByID("ST237888")
      .then((startup) => {
        setStartup(startup[0])
        return startup[0]
      })
      .catch((error) => console.error(error))
  }, [])

  async function getStartUpByID(
    startupId: string,
  ): Promise<Startup | undefined> {
    const resStartUpByID: Startup | undefined | null =
      (await backend.getStartUpByID(startupId)) as Startup | undefined | null
    return resStartUpByID
  }

  return (
    <>
      {/* <StartupItems startup={startup[0]} />
    <StartupDetails startup={startup[0]} /> */}
      <StartupItems startup={startup} />
      <StartupDetails startup={startup} />
    </>
  )
}
