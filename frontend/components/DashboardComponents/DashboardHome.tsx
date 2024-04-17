import React, { useEffect, useState } from "react"
import { Heading, List, ListItem, Text } from "@chakra-ui/react"
import { useCanister, useConnect } from "@connect2ic/react"
import { UserType } from "../CommonTypes"

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
  const [startUpsByPrincipal, setStartUpsByPrincipal] = useState<[string]>()

  useEffect(() => {
    const getcurrentUser = async () => {
      try {
        const resGetMyUser: [UserType] = (await backend.getMyUser()) as [
          UserType,
        ]
        setCurrentUser(resGetMyUser[0])
        return currentUser
        // return resGetMyUser[0]
      } catch (error) {
        console.error("Error on backend.getMyUser() call.", error)
      }
    }

    // const getStartUpsByPrincipal = async (userPrincipal) => {
    //   console.log("inside getStartUpsByPrincipal, userPrincipal")
    //   console.log(userPrincipal)
    //   try {
    //     const resGetStartUpsByPrincipal: [string] =
    //       (await backend.getStartUpsByPrincipal(userPrincipal)) as [string]
    //     console.log("resGetStartUpsByPrincipal")
    //     console.log(resGetStartUpsByPrincipal)
    //     setStartUpsByPrincipal(resGetStartUpsByPrincipal)
    //     return startUpsByPrincipal
    //     // return resGetStartUpsByPrincipal
    //   } catch (error) {
    //     console.error("Error on backend.getStartUpsByPrincipal() call.", error)
    //   }
    // }

    getcurrentUser()
    // getStartUpsByPrincipal(currentUser?.principalID)
  }, [])

  // const getRoleStartup = (roles: [any] | undefined) => {
  //   return roles?.map(role => {
  //     if (role.Startup !== undefined) return role.Startup
  //   })
  // }

  const getRoleStartup = (roles: [any] | undefined) => (roles?.find(role => role.Startup !== undefined).Startup)

  return (
    <>
      <Heading fontSize="35px">User: {currentUser?.name}</Heading>
      <Text fontSize="2xl">Roles: {JSON.stringify(currentUser?.roles)}</Text>
      <Text fontSize="2xl">Startups: {getRoleStartup(currentUser?.roles)}</Text>
    </>
  )
}

export default DashboardHome
