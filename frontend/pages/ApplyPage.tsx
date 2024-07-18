import React, { useContext, useEffect, useState } from "react"
import BannerApply from "../components/Apply/BannerApply"
import StartupForms from "../components/Apply/StartupForms"
import ProyectForms from "../components/Apply/ProyectForms"
import ColecctionForm from "../components/Apply/ColecctionForm"
import { useCanister } from "@connect2ic/react"
import { EstadoContext } from "../components/utils/estadoContex"
import { getRoleStartup, isUserRoleStartup } from "../components/CommonHelpers"
import { useToast } from "@chakra-ui/react"

export default function ApplyPage() {
  const [backend] = useCanister("backend")
  const [hasStartupProject, setHasStartupProject] = useState<boolean>(false)
  const { currentUser, setCurrentUser } = useContext(EstadoContext)
  const toast = useToast()

  useEffect(() => {
    const hasRoleStartupProject = async (
      startupId: string,
    ): Promise<boolean> => {
      const resProjectsByStartup = (await backend.getProjectsByStartup(
        startupId,
      )) as string[][]
      setHasStartupProject(resProjectsByStartup.flat().length > 0)
      return resProjectsByStartup.flat().length > 0
    }

    let loadingToastId: string | number | undefined = toast({
      title: "Loading forms...",
      status: "loading", // 'loading' es el status para el estilo de carga
      duration: 2000,
      isClosable: false,
      variant: "solid",
    })
    hasRoleStartupProject(getRoleStartup(currentUser?.roles)[0])
      .then((resHasRoleStartupProject) => console.log("hasRoleStartupProject"))
      .catch((error) => console.error(error))
    // setHasStartupProject(await hasRoleStartupProject(getRoleStartup(currentUser.roles)[0]))
  }, [currentUser])

  return (
    <>
      {window.location.pathname.startsWith("/Dashboard") &&
      isUserRoleStartup(currentUser?.roles) ? (
        <>
          <br />
          <div style={{ display: hasStartupProject ? "block" : "none" }}>
            <ColecctionForm />
          </div>
          <div style={{ display: !hasStartupProject ? "block" : "none" }}>
            <ProyectForms />
          </div>
        </>
      ) : (
        <>
          <BannerApply />
          {currentUser?.verified["Success"] === true &&
            !isUserRoleStartup(currentUser?.roles) && <StartupForms />}
          <br />
        </>
      )}
    </>
  )
}
