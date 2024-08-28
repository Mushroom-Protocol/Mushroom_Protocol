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
  Link as ChakraLink,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
  ModalFooter,
} from "@chakra-ui/react"
import { useCanister } from "@connect2ic/react"
import { Project, ProjectCard, Startup, StartupCard } from "../CommonTypes"
import { ExternalLinkIcon } from "@chakra-ui/icons"

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
  const [projectDetails, setProjectDetails] = useState<Project>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    const getProjectsPreview = async () => {
      try {
        const resGetProjectsPreview = (await backend.getProjectsPreview()) as [
          ProjectCard,
        ]
        setProjectsPreview(resGetProjectsPreview)
      } catch (error) {
        console.error("Error on backend.getProjectsPreview() call:", error)
      }
    }

    getProjectsPreview()
  }, [])

  const openDetails = async (projectId: string) => {
    onOpen()
    const resExpandProject: Project[] = (await backend.expandProject(
      projectId,
    )) as Project[]
    setProjectDetails(resExpandProject[0])
  }

  return (
    <>
      <Heading fontSize="4xl">Projects list</Heading>
      <List spacing={3}>
        {projectsPreview?.map((project, idx) => {
          return (
            <ListItem key={idx}>
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
                <CardFooter>
                  <ButtonGroup spacing="2">
                    <Button
                      colorScheme="blue"
                      onClick={() => openDetails(project.pojectID)}
                    >
                      Details
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            </ListItem>
          )
        })}
      </List>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading color="blue.600" fontSize="2xl">
              {projectDetails?.projectTitle} ({projectDetails?.projectId})
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{ color: "black" }}>
            <Text>
              <b>Belongs to startup:</b> {projectDetails?.startupID}
            </Text>
            <Text>
              <b>Problem it solves:</b> {projectDetails?.problemSolving}
            </Text>
            <Text>
              <b>Solution proposed:</b> {projectDetails?.yoursolution}
            </Text>
            <Text>
              <b>Impact:</b> {projectDetails?.impact}
            </Text>
            <Text>
              <b>Product status:</b> {projectDetails?.productStatus}
            </Text>
            <Text>
              <b>Required funds:</b> {Number(projectDetails?.fundsRequired)}
            </Text>
            <Text>
              <b>Project duration:</b> {Number(projectDetails?.projectDuration)}
            </Text>
            <Text>
              <b>Implementation:</b> {projectDetails?.implementation}
            </Text>
            <Text>
              <b>Milestones:</b> {projectDetails?.milestones}
            </Text>
            <Text>
              <b>Budget:</b> {projectDetails?.budget}
            </Text>
            <Text>
              <b>Team:</b> {projectDetails?.team}
            </Text>
            <Text>
              <b>Approval date:</b>{" "}
              {new Date(
                Number(projectDetails?.approvalDate) / 1000,
              ).toUTCString()}
              {/* {new Date(projectDetails?.approvalDate || 0 / 1000).toUTCString()} */}
            </Text>
            <Center>
              <Image
                src={
                  "data:image/png;base64," + blobToBase64(projectDetails?.coverImage || new Uint8Array)
                }
                alt={projectDetails?.projectTitle}
                borderRadius="lg"
                height="200px"
                width="200px"
                textAlign="center"
              />
            </Center>
          </ModalBody>
          <hr />
          <ModalFooter>
            <Button variant="ghost" colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProjectsList
