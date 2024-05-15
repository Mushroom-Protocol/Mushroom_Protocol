import React, { useEffect, useState } from "react"
import { Heading, Text, useToast } from "@chakra-ui/react"
import { useCanister } from "@connect2ic/react"

const UsersPendingVerification: React.FC = () => {
  const [backend] = useCanister("backend")
  const [users, setUsers] = useState<[string, string, string][]>()
  const toast = useToast()

  useEffect(() => {
    const getUsers = async () => {
      try {
        const resGetUsers = (await backend.getUsersPendingVerification()) as [string, string, string][]
        setUsers(resGetUsers)
      } catch (error) {
        console.error("Error on backend.getUsers() call:", error)
      }
    }

    getUsers()
  }, [])

  return (
    <>
      <Heading fontSize="4xl" marginBottom="20px">
        Users with pending verification
      </Heading>
      {users?.map((userPending: [string, string, string]) => (
        <Text fontSize="xl">{`${userPending[1]} - ${userPending[0]} - ${userPending[2]}`}</Text>
      ))}
    </>
  )
}

export default UsersPendingVerification
