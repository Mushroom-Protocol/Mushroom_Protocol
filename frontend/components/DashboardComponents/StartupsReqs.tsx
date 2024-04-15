import React, { useEffect, useState } from "react"
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
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

const initialStateStartups = [
  {
    owner: {},
    admissionDate: 0,
    startupId: "",
    startUpName: "",
    email: "",
    website: "",
    startUpSlogan: "",
    shortDes: "",
    logo: null,
    documents: [[]],
    startupStatus: "",
    tlr: 0,
    fullNameTl: "",
    specializationTL: "",
    linkedinTL: "",
    industry: "",
    country: "",
    valoration: 0,
    projects: [""],
  },
] as [Startup]

function blobToBase64(buffer: Uint8Array) {
  var binary = ""
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

const StartupsReqs: React.FC = () => {
  const [backend] = useCanister("backend")
  const [startups, setStartups] = useState<[Startup] | null>(
    initialStateStartups,
  )
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
      )) as string
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
      <h1>Startup registration requests</h1>
      <List spacing={3}>
        {startups?.map((startup) => {
          return (
            <ListItem>
              <Card maxW="sm">
                <CardBody>
                  <Image
                    // src={"data:image/png;base64," + blobToBase64(startup.logo)}
                    alt="Green double couch with wooden legs"
                    borderRadius="lg"
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="md">
                      {startup && startup.startUpName}
                    </Heading>
                    <Text>{startup.shortDes}</Text>
                    <Text color="blue.600" fontSize="2xl">
                      {startup.startUpSlogan}
                    </Text>
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
