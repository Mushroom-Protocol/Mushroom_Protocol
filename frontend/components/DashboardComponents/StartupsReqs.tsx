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
import { Startup } from "../CommonTypes"
import { blobToBase64 } from "../CommonHelpers"

const StartupsReqs: React.FC = () => {
  const [backend] = useCanister("backend")
  const [startups, setStartups] = useState<[Startup] | null>()
  const [formApprove, setFormApprove] = useState({
    startupValoration: 0,
  })
  const [responseBackend, setResponseBackend] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    const getIncomingStartUps = async () => {
      try {
        const response = await backend.getIncomingStartUps()
        console.log("backend.getIncomingStartUps")
        console.log(response)
        setStartups(response as [Startup])
      } catch (error) {
        console.error("Error on backend.getIncomingStartUps() call:", error)
      }
    }

    getIncomingStartUps()
  }, [responseBackend])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormApprove((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleApprove = async (owner, valoration) => {
    let loadingToastId: string | number | undefined

    try {
      loadingToastId = toast({
        title: "Submitting Form",
        status: "loading", // 'loading' es el status para el estilo de carga
        duration: null,
        isClosable: false,
        variant: "solid",
      })

      const resGetIncomingStartupByOwner =
        (await backend.getIncomingStartupByOwner(owner)) as { ok: Startup }
      const resGetIncomingStartupByOwnerOk = resGetIncomingStartupByOwner["ok"]
      const resApproveStartUp = (await backend.approveStartUp(
        resGetIncomingStartupByOwnerOk,
        parseInt(valoration),
        owner,
        // )) as {ok: string} | {err: string}
      )) as object
      console.log("resApproveStartUp")
      console.log(resApproveStartUp)
      setResponseBackend(resApproveStartUp["ok"])

      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      if (resApproveStartUp['ok']) {
        toast({
          title: "Successful Submission",
          description: `Approved startup Id: ${resApproveStartUp['ok']}`,
          status: "success", // 'success' es el status para el estilo de éxito
          duration: 5000,
          isClosable: true,
          variant: "solid",
        })
      } else {
        toast({
          title: "Error approving startup",
          description: resApproveStartUp['err'],
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

      console.error("Error approving startup:", error)
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

      const resRejectStartUp = await backend.rejectStartUp(owner)
      setResponseBackend(resRejectStartUp as string)

      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      toast({
        title: "Successful Submission",
        description: `Startup rejected successfully.`,
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
      <Heading fontSize="4xl">Startup registration requests</Heading>
      <List spacing={3}>
        {startups?.map((startup) => {
          return (
            <ListItem>
              <Card maxW="sm">
                <CardBody>
                  <Center>
                    <Image
                      src={
                        "data:image/png;base64," + blobToBase64(startup.logo)
                      }
                      alt={startup.startUpName}
                      borderRadius="lg"
                      height="150px"
                      width="150px"
                      textAlign="center"
                    />
                  </Center>
                  <Stack mt="6" spacing="3">
                    <Heading color="blue.600" fontSize="2xl">
                      {startup && startup.startUpName}
                    </Heading>
                    <Text size="md">{startup.startUpSlogan}</Text>
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                  <Input
                    id="startupValoration"
                    name="startupValoration"
                    value={formApprove.startupValoration}
                    onChange={handleChange}
                    placeholder="Enter valoration..."
                    type="number"
                  />
                  <ButtonGroup spacing="2">
                    <Button
                      colorScheme="blue"
                      onClick={() =>
                        handleApprove(
                          startup.owner,
                          formApprove.startupValoration,
                        )
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => handleReject(startup.owner)}
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

export default StartupsReqs
