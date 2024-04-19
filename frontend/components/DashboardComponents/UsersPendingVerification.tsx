import React, { useEffect, useState } from "react"
import { Heading, Text, useToast } from "@chakra-ui/react"
import { useCanister } from "@connect2ic/react"

const UsersPendingVerification: React.FC = () => {
  const [backend] = useCanister("backend")
  const [users, setUsers] = useState<[[object, object]]>()
  const toast = useToast()

  useEffect(() => {
    const getUsers = async () => {
      try {
        const resGetUsers = (await backend.getUsers()) as [[object, object]]
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
      {users
        ?.filter(
          (user: any) => user[1].verified.Code && user[1].verified.Code !== "",
        )
        .map((userPending: any) => (
          <Text fontSize="xl">{`${userPending[1].name} - ${
            userPending[1].email
          } - ${JSON.stringify(userPending[1].verified)}`}</Text>
        ))}
    </>
  )
}

export default UsersPendingVerification
