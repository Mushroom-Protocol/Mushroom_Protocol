import React, { useEffect, useState } from "react"
import {
  Card,
  CardBody,
  Center,
  Heading,
  Image,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react"
import { useCanister, useConnect } from "@connect2ic/react"
import { StartupCard, UserType } from "../CommonTypes"
import { blobToBase64 } from "../CommonHelpers"

const currentUserInitialState: UserType = {
  principalID: { _arr: new Uint8Array(), _isPrincipal: false },
  userId: "",
  admissionDate: 0,
  name: "",
  avatar: null,
  email: "",
  verified: { Code: "", Success: false },
  roles: [{}],
}

const DashboardHome: React.FC = () => {
  const { principal } = useConnect()
  const [backend] = useCanister("backend")
  const [currentUser, setCurrentUser] = useState<UserType>()
  const [extractedRolesStartup, setExtractedRolesStartup] = useState<string[]>()
  const [startUpsPreview, setStartUpsPreview] = useState<StartupCard[]>()

  useEffect(() => {
    const getcurrentUser = async () => {
      try {
        const resGetMyUser: [UserType] = (await backend.getMyUser()) as [
          UserType,
        ]
        setCurrentUser(resGetMyUser[0])
        // getRoleStartup(currentUser?.roles as any[])
        getRoleStartup(resGetMyUser[0].roles as any[])
        return currentUser
        // return resGetMyUser[0]
      } catch (error) {
        console.error("Error on backend.getMyUser() call.", error)
      }
    }

    const getStartUpsPreview = async () => {
      try {
        const resGetStartUpsPreview: StartupCard[] =
          (await backend.getStartUpsPreview()) as StartupCard[]
        setStartUpsPreview(resGetStartUpsPreview)
        // return startUpsPreview
        return resGetStartUpsPreview
      } catch (error) {
        console.error("Error on backend.getStartUpsPreview() call.", error)
      }
    }

    getcurrentUser()
    // getRoleStartup(currentUser?.roles as any[])
    getStartUpsPreview()
  }, [])

  const getRolesKeys = (roles: [object] | undefined) => {
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
