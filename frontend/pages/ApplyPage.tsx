import React, { useContext, useEffect, useState } from "react"
import BannerApply from "../components/Apply/BannerApply"
import StartupForms from "../components/Apply/StartupForms"
import ProyectForms from "../components/Apply/ProyectForms"
import ColecctionForm from "../components/Apply/ColecctionForm"
import { useCanister } from "@connect2ic/react"
import { EstadoContext } from "../components/utils/estadoContex"
import { getRoleStartup, isUserRoleStartup } from "../components/CommonHelpers"

export default function ApplyPage() {
  const [backend] = useCanister("backend")
  const [hasStartupProject, setHasStartupProject] = useState<boolean>(false)
  const { currentUser, setCurrentUser } = useContext(EstadoContext)

  useEffect(() => {
    const hasRoleStartupProject = async (
      startupId: string,
    ): Promise<boolean> => {
      const resProjectsByStartup = (await backend.getProjectsByStartup(
        startupId,
      )) as string[][]
      setHasStartupProject(resProjectsByStartup.flat().length > 0)
      return resProjectsByStartup.length > 0
    }

    hasRoleStartupProject(getRoleStartup(currentUser.roles)[0]).then(resHasRoleStartupProject => console.log(resHasRoleStartupProject)).catch(error => console.error(error))
    // setHasStartupProject(await hasRoleStartupProject(getRoleStartup(currentUser.roles)[0]))
  }, [currentUser])

  return (
    <>
      {!window.location.pathname.startsWith("/Dashboard") && <BannerApply />}
      {window.location.pathname.startsWith("/Dashboard") && <br />}
      {currentUser?.verified["Success"] === true &&
        !isUserRoleStartup(currentUser.roles) && <StartupForms />}
      <br />
      {window.location.pathname.startsWith("/Dashboard") && (
        <>
          {isUserRoleStartup(currentUser.roles) && !hasStartupProject && <ProyectForms />}
          <br />
          {isUserRoleStartup(currentUser.roles) && hasStartupProject && <ColecctionForm />}
        </>
      )}
    </>
  )
}
