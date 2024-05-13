import React, { useEffect, useState } from "react"
import { Heading, Text, useToast } from "@chakra-ui/react"
import { useCanister } from "@connect2ic/react"

const UsersPendingVerification: React.FC = () => {
  const [backend] = useCanister("backend")
  const [users, setUsers] = useState<[object, object][]>()
  const toast = useToast()

  useEffect(() => {
    const getUsers = async () => {
      try {
        const resGetUsers = (await backend.getUsers()) as [object, object][]
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
      {users?.map((userPending: [object, object]) => (
        <Text fontSize="xl">{`${userPending[0]} - ${userPending[1]}`}</Text>
      ))}
    </>
  )
}

export default UsersPendingVerification
