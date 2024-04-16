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

  return (
    <>
      <Heading fontSize="4xl" marginBottom="20px">Startups list</Heading>
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
              </Card>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}

export default StartupsList
