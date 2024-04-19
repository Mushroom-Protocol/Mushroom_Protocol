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
  Link as ChakraLink,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { useCanister } from "@connect2ic/react"
import { Startup, StartupCard } from "../CommonTypes"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { blobToBase64 } from "../CommonHelpers"

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

const StartupsList: React.FC = () => {
  const [backend] = useCanister("backend")
  const [startUpsPreview, setStartUpsPreview] = useState<[StartupCard] | null>(
    initialStateStartUpsPreview,
  )
  const [startupDetails, setStartupDetails] = useState<Startup>()
  const [responseBackend, setResponseBackend] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
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

  const openDetails = async (startupId: string) => {
    onOpen()
    const resExpandStartUp: Startup[] = (await backend.expandStartUp(startupId)) as Startup[]
    setStartupDetails(resExpandStartUp[0])
  }

  return (
    <>
      <Heading fontSize="4xl" marginBottom="20px">
        Startups list
      </Heading>
      <List spacing={3}>
        {startUpsPreview?.map((startup) => {
          return (
            <ListItem>
              <Card maxW="sm">
                <CardBody>
                  <Heading color="blue.600" fontSize="2xl" marginBottom="15px">
                    {startup && startup.startUpName}
                  </Heading>
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
                    <Text size="md">{startup.startUpSlogan}</Text>
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                  <ButtonGroup spacing="2">
                    <Button
                      colorScheme="blue"
                      onClick={() => openDetails(startup.startupId)}
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
              {startupDetails?.startUpName} ({startupDetails?.startupId})
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{ color: "black" }}>
            <Text>
              <b>Admission date:</b>{" "}
              {new Date(
                Number(startupDetails?.admissionDate) / 1000,
              ).toUTCString()}
            </Text>
            <Text>
              <b>Website:</b>{" "}
              <ChakraLink href={startupDetails?.website} isExternal>
                {startupDetails?.website} <ExternalLinkIcon mx="2px" />
              </ChakraLink>
            </Text>
            <Text>
              <b>Slogan:</b> {startupDetails?.startUpSlogan}
            </Text>
            <Text>
              <b>Short description:</b> {startupDetails?.shortDes}
            </Text>
            <Text>
              <b>Status:</b> {startupDetails?.startupStatus}
            </Text>
            <Text>
              <b>Technology Readiness Level (TRL):</b> {startupDetails?.tlr}
            </Text>
            <Text>
              <b>Legal Representative / Team Leader:</b>{" "}
              {startupDetails?.fullNameTl}
            </Text>
            <Text>
              <b>Specialization Legal Representative / Team Leader:</b>{" "}
              {startupDetails?.specializationTL}
            </Text>
            <Text>
              <b>LinkedIn:</b>{" "}
              <ChakraLink href={startupDetails?.linkedinTL} isExternal>
                {startupDetails?.linkedinTL} <ExternalLinkIcon mx="2px" />
              </ChakraLink>
            </Text>
            <Text>
              <b>Industry:</b> {startupDetails?.industry}
            </Text>
            <Text>
              <b>Country:</b> {startupDetails?.country}
            </Text>
            <Text>
              <b>Valoration:</b> {startupDetails?.valoration}
            </Text>
            <Center>
              <Image
                src={
                  "data:image/png;base64," + blobToBase64(startupDetails?.logo || new Uint8Array)
                }
                alt={startupDetails?.startUpName}
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

export default StartupsList
