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

const ProjectsList: React.FC = () => {
  const [backend] = useCanister("backend")
  const [projectsPreview, setProjectsPreview] = useState<[ProjectCard]>(
    initialStateProjectsPreview,
  )
  const toast = useToast()

  useEffect(() => {
    const getProjectsPreview = async () => {
      try {
        const resGetProjectsPreview = (await backend.getProjectsPreview()) as [
          ProjectCard,
        ]
        console.log("backend.getProjectsPreview")
        console.log(resGetProjectsPreview)
        setProjectsPreview(resGetProjectsPreview)
      } catch (error) {
        console.error("Error on backend.getProjectsPreview() call:", error)
      }
    }

    getProjectsPreview()
  }, [])

  return (
    <>
      <Heading fontSize="4xl">Projects list</Heading>
      <List spacing={3}>
        {projectsPreview?.map((project) => {
          return (
            <ListItem>
              <Card maxW="sm">
                <CardBody>
                  <Heading color="blue.600" fontSize="2xl">
                    {project.projectTitle} ({project.pojectID})
                  </Heading>
                  <Center>
                    <Image
                      src={
                        "data:image/png;base64," +
                        blobToBase64(project.coverImage)
                      }
                      alt={project.projectTitle}
                      borderRadius="lg"
                      height="150px"
                      width="150px"
                      textAlign="center"
                    />
                  </Center>
                  <Stack mt="6" spacing="3">
                    <Text size="md">{project.problemSolving}</Text>
                    <Text size="md">{project.startupName}</Text>
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter></CardFooter>
              </Card>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}

export default ProjectsList
