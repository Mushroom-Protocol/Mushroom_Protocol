import React, { useEffect, useState } from "react"
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  Heading,
  Image,
  Input,
  List,
  ListItem,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useCanister } from "@connect2ic/react"
import { ProjectCard, Startup, StartupCard } from "../CommonTypes"

const initialStateProjectsPreview = [
  {
    owner: {},
    startupName: "",
    projectTitle: "",
    pojectID: "",
    coverImage: new Uint8Array(),
    problemSolving: "",
  },
] as [ProjectCard]

function blobToBase64(buffer: Uint8Array) {
  var binary = ""
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

const UsersPendingVerification: React.FC = () => {
  const [backend] = useCanister("backend")
  const [users, setUsers] = useState<[[object, object]]>()
  const toast = useToast()

  useEffect(() => {
    const getUsers = async () => {
      try {
        const resGetUsers = await backend.getUsers() as [[object, object]]
        console.log("backend.resGetUsers")
        console.log(resGetUsers)
        setUsers(resGetUsers)
      } catch (error) {
        console.error("Error on backend.getProjectsPreview() call:", error)
      }
    }

    getUsers()
  }, [])

  return (
    <>
      <Heading fontSize="4xl">Users with pending verification</Heading>
      <List spacing={3}>
        {users?.map(user => {
          return (
            <Text>
              {JSON.stringify(user)}
            </Text>
          )
        })}
      </List>
    </>
  )
}

export default UsersPendingVerification
