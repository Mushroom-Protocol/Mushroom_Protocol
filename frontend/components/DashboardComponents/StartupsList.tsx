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
import { Startup, StartupCard } from "../CommonTypes"

const initialStateStartUpsPreview = [
  {
    owner: {},
    startUpName: "",
    startupId: "",
    fullNameTl: "",
    startUpSlogan: "",
    logo: new Uint8Array(),
  },
] as [StartupCard]

function blobToBase64(buffer: Uint8Array) {
  var binary = ""
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

const StartupsList: React.FC = () => {
  const [backend] = useCanister("backend")
  const [startUpsPreview, setStartUpsPreview] = useState<[StartupCard] | null>(
    initialStateStartUpsPreview,
  )
  const [formApprove, setFormApprove] = useState({
    startupValoration: 0,
  })
  const [responseBackend, setResponseBackend] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    const getStartUpsPreview = async () => {
      try {
        const resGetStartUpsPreview = (await backend.getStartUpsPreview()) as [
          StartupCard,
        ]
        console.log("backend.getIncomingStartUps")
        console.log(resGetStartUpsPreview)
        setStartUpsPreview(resGetStartUpsPreview)
      } catch (error) {
        console.error("Error on backend.getStartUpsPreview() call:", error)
      }
    }

    getStartUpsPreview()
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

      toast({
        title: "Successful Submission",
        description: `Approved startup Id: ${resApproveStartUp["ok"]}`,
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
      <h1>Startups list</h1>
      <List spacing={3}>
        {startUpsPreview?.map((startup) => {
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

export default StartupsList
