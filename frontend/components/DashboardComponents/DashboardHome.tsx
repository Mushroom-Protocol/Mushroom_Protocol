import React, { useContext, useEffect, useState } from "react"
import {
  Card,
  CardBody,
  Center,
  Heading,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useCanister, useConnect } from "@connect2ic/react"
import { StartupCard, UserType } from "../CommonTypes"
import { blobToBase64 } from "../CommonHelpers"
import { EstadoContext, EstadoProvider } from "../utils/estadoContex"

const DashboardHome: React.FC = () => {
  const [backend] = useCanister("backend")
  const { currentUser, setCurrentUser } = useContext(EstadoContext)
  const [extractedRolesStartup, setExtractedRolesStartup] = useState<string[]>()
  const [startUpsPreview, setStartUpsPreview] = useState<StartupCard[]>()
  const toast = useToast()

  useEffect(() => {
    let loadingToastId2: string | number | undefined

    const getStartUpsPreview = async () => {
      try {
        loadingToastId2 = toast({
          title: "Loading data...",
          status: "loading", // 'loading' es el status para el estilo de carga
          duration: null,
          isClosable: false,
          variant: "solid",
        })
        const resGetStartUpsPreview: StartupCard[] =
          (await backend.getStartUpsPreview()) as StartupCard[]
        setStartUpsPreview(resGetStartUpsPreview)
        // return startUpsPreview

        if (loadingToastId2 !== undefined) {
          toast.close(loadingToastId2)
        }
        toast({
          title: "Data loaded",
          description: "Initial data successfully retrieved.",
          status: "success", // 'success' es el status para el estilo de éxito
          duration: 5000,
          isClosable: true,
          variant: "solid",
        })

        return resGetStartUpsPreview
      } catch (error) {
        if (loadingToastId2 !== undefined) {
          toast.close(loadingToastId2)
        }
        toast({
          title: "Error loading data",
          description:
            "There was an error retrieving the initial data. Please try again.",
          status: "error", // 'error' es el status para el estilo de error
          duration: 5000,
          isClosable: true,
          variant: "solid",
        })

        console.error("Error on backend.getStartUpsPreview() call.", error)
      }
    }

    getRoleStartup(currentUser?.roles as any[])
    getStartUpsPreview()
  }, [currentUser])

  const getRolesKeys = (roles: object[] | undefined) => {
    return roles
      ?.map((role) => {
        return Object.keys(role)
      })
      .join()
  }

  const getRoleStartup = (roles: any[]) => {
    let rolesStartup: any[] = []
    roles?.map((role) => {
      if (role.Startup) rolesStartup.push(role.Startup)
    })
    const rolesStartupFlatted: string[] = rolesStartup.flat()
    setExtractedRolesStartup(rolesStartupFlatted)
    return rolesStartupFlatted
  }

  const displayStartupCards = (startupIDs: string[]) => {
    const userStartUpsPreview: StartupCard[] = startUpsPreview?.filter(
      (startUpPreview) => startupIDs.includes(startUpPreview.startupId),
    ) as StartupCard[]
    return userStartUpsPreview.map((userStartUpPreview) => {
      return (
        <Card maxW="sm">
          <CardBody>
            <Heading color="blue.600" fontSize="2xl" marginBottom="15px">
              {userStartUpPreview.startUpName}
            </Heading>
            <Center>
              <Image
                src={
                  "data:image/png;base64," +
                  blobToBase64(userStartUpPreview.logo)
                }
                alt={userStartUpPreview.startUpName}
                borderRadius="lg"
                height="150px"
                width="150px"
                textAlign="center"
              />
            </Center>
            <Text size="md">{userStartUpPreview.startUpSlogan}</Text>
          </CardBody>
        </Card>
      )
    })
  }

  return (
    <>
      <Heading fontSize="35px">User: {currentUser?.name}</Heading>
      <Text fontSize="2xl">Roles: {getRolesKeys(currentUser?.roles)}</Text>
      <Text fontSize="2xl">Startups:</Text>
      {!extractedRolesStartup?.length || extractedRolesStartup?.length <= 0 ? (
        <p>The user does not have approved startups yet.</p>
      ) : (
        <>{displayStartupCards(extractedRolesStartup)}</>
      )}
    </>
  )
}

export default DashboardHome
