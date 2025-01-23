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
  List,
  ListItem,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useCanister } from "@connect2ic/react"
import { DataProject, ProjectCard } from "../CommonTypes"
import { blobToBase64 } from "../CommonHelpers"

const ProjectsReqs: React.FC = () => {
  const [backend] = useCanister("backend")
  const [projects, setProjects] = useState<ProjectCard[]>()
  const [responseBackend, setResponseBackend] = useState<
    string | null | DataProject
  >()
  const toast = useToast()

  useEffect(() => {
    const getIncomingProjects = async () => {
      try {
        const response: ProjectCard[] = (await backend.getIncomingProjects()) as ProjectCard[]
        setProjects(response)
        return response
      } catch (error) {
        console.error("Error on backend.getIncomingStartUps() call:", error)
      }
    }

    getIncomingProjects()
  }, [responseBackend])

  const handleApprove = async (owner) => {
    let loadingToastId: string | number | undefined

    try {
      loadingToastId = toast({
        title: "Submitting Form",
        status: "loading", // 'loading' es el status para el estilo de carga
        duration: null,
        isClosable: false,
        variant: "solid",
      })

      const resApproveProject = (await backend.approveProject(owner)) as
        | { ok: string }
        | { err: string }
      // )) as object
      setResponseBackend(resApproveProject['ok'])

      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      if (resApproveProject['ok']) {
        toast({
          title: "Successful Submission",
          description: `Approved project Id: ${resApproveProject['ok']}`,
          status: "success", // 'success' es el status para el estilo de éxito
          duration: 5000,
          isClosable: true,
          variant: "solid",
        })
      } else {
        toast({
          title: "Error approving startup",
          description: resApproveProject['err'],
          status: "error", // 'error' es el status para el estilo de error
          duration: 5000,
          isClosable: true,
          variant: "solid",
        })
      }
    } catch (error) {
      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      toast({
        title: "Submission Error",
        description:
          "There was an error submitting the form. Please try again.",
        status: "error", // 'error' es el status para el estilo de error
        duration: 5000,
        isClosable: true,
        variant: "solid",
      })

      console.error("Error approving project:", error)
    }
  }

  const handleReject = async (owner) => {
    let loadingToastId: string | number | undefined

    try {
      loadingToastId = toast({
        title: "Submitting Form",
        status: "loading", // 'loading' es el status para el estilo de carga
        duration: null,
        isClosable: false,
        variant: "solid",
      })

      // const resRejectProject = await backend.rejectProject(owner) as DataProject | null
      const resRejectProject = (await backend.rejectProject(owner)) as
        | DataProject
        | null
        | string
      setResponseBackend(resRejectProject)

      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      toast({
        title: "Successful Submission",
        description: `Project rejected successfully.`,
        status: "success", // 'success' es el status para el estilo de éxito
        duration: 5000,
        isClosable: true,
        variant: "solid",
      })
    } catch (error) {
      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      toast({
        title: "Submission Error",
        description:
          "There was an error submitting the form. Please try again.",
        status: "error", // 'error' es el status para el estilo de error
        duration: 5000,
        isClosable: true,
        variant: "solid",
      })

      console.error("Error approving startup:", error)
    }
  }

  return (
    <>
      <Heading fontSize="4xl">Project registration requests</Heading>
      <List spacing={3}>
        {projects?.map((project, idx) => {
          return (
            <ListItem key={idx}>
              <Card maxW="sm">
                <CardBody>
                  <Heading color="blue.600" fontSize="2xl">
                    {project.projectTitle}
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
                  <Text size="md">{project.problemSolving}</Text>
                  <Text size="md">{project.startUpName}</Text>
                </CardBody>
                <Divider />
                <CardFooter>
                  <ButtonGroup spacing="2">
                    <Button
                      colorScheme="blue"
                      onClick={() => handleApprove(project.owner)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => handleReject(project.owner)}
                    >
                      Reject
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}

export default ProjectsReqs
