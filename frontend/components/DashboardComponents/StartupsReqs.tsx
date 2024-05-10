import React, { useEffect, useState } from "react"
import {
  Box,
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Link as ChakraLink,
  useDisclosure,
  useToast,
  ModalFooter,
  Flex,
} from "@chakra-ui/react"
import { useCanister } from "@connect2ic/react"
import { Startup } from "../CommonTypes"
import { blobToBase64, getTRL } from "../CommonHelpers"
import { ExternalLinkIcon } from "@chakra-ui/icons"

const StartupsReqs: React.FC = () => {
  const [backend] = useCanister("backend")
  const [startups, setStartups] = useState<[Startup] | null>()
  const [incomingStartupDetails, setIncomingStartupDetails] =
    useState<Startup>()
  const [formApprove, setFormApprove] = useState({
    startupValoration: 0,
  })
  const [responseBackend, setResponseBackend] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    const getIncomingStartUps = async () => {
      try {
        const response = await backend.getIncomingStartUps()
        setStartups(response as [Startup])
      } catch (error) {
        console.error("Error on backend.getIncomingStartUps() call:", error)
      }
    }

    getIncomingStartUps()
  }, [responseBackend])

  const openDetails = async (principal: object) => {
    const resIncomingStartupByOwner: { ok: Startup[] } | { err: string } =
      (await backend.getIncomingStartupByOwner(principal)) as
        | { ok: Startup[] }
        | { err: string }
    if (resIncomingStartupByOwner["ok"]) {
      setIncomingStartupDetails(resIncomingStartupByOwner["ok"])
      onOpen()
    }
  }

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

      if (resApproveStartUp["ok"]) {
        toast({
          title: "Successful Submission",
          description: `Approved startup Id: ${resApproveStartUp["ok"]}`,
          status: "success", // 'success' es el status para el estilo de éxito
          duration: 5000,
          isClosable: true,
          variant: "solid",
        })
      } else {
        toast({
          title: "Error approving startup",
          description: resApproveStartUp["err"],
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
                <CardFooter flexDirection="column">
                  <Flex>
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
                  </Flex>
                  <Box>
                    <Button
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => openDetails(startup.owner)}
                    >
                      Details
                    </Button>
                  </Box>
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
              {incomingStartupDetails?.startUpName}
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{ color: "black" }}>
            <Text>
              <b>Slogan:</b> {incomingStartupDetails?.startUpSlogan}
            </Text>
            <Text>
              <b>Short description:</b> {incomingStartupDetails?.shortDes}
            </Text>
            <Text>
              <b>Website:</b>{" "}
              <ChakraLink href={incomingStartupDetails?.website} isExternal>
                {incomingStartupDetails?.website} <ExternalLinkIcon mx="2px" />
              </ChakraLink>
            </Text>
            <Text>
              <b>Status:</b> {incomingStartupDetails?.startupStatus}
            </Text>
            <Text>
              <b>Technology Readiness Level (TRL):</b>{" "}
              {getTRL(incomingStartupDetails?.tlr)}
            </Text>
            <Text>
              <b>Legal Representative / Team Leader:</b>{" "}
              {incomingStartupDetails?.fullNameTl}
            </Text>
            <Text>
              <b>Specialization Legal Representative / Team Leader:</b>{" "}
              {incomingStartupDetails?.specializationTL}
            </Text>
            <Text>
              <b>LinkedIn:</b>{" "}
              <ChakraLink href={incomingStartupDetails?.linkedinTL} isExternal>
                {incomingStartupDetails?.linkedinTL}{" "}
                <ExternalLinkIcon mx="2px" />
              </ChakraLink>
            </Text>
            <Text>
              <b>Industry:</b> {incomingStartupDetails?.industry}
            </Text>
            <Text>
              <b>Country:</b> {incomingStartupDetails?.country}
            </Text>
            <Center>
              <Image
                src={
                  "data:image/png;base64," +
                  blobToBase64(incomingStartupDetails?.logo || new Uint8Array())
                }
                alt={incomingStartupDetails?.startUpName}
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

export default StartupsReqs
