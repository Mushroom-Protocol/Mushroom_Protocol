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
  UnorderedList,
} from "@chakra-ui/react"
import { useCanister } from "@connect2ic/react"
import { Startup, StartupCard } from "../CommonTypes"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { blobToBase64, getTRL } from "../CommonHelpers"

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

const CollectionsList: React.FC = () => {
  const [backend] = useCanister("backend")
  const [collectionsMetadata, setCollectionsMetadata] = useState<any[] | null>([])
  const [currentCollection, setCurrentCollection] = useState<any>({})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    const getProjectsWithCollection = async () => {
      try {
        const resProjectsWithCollection: any[] = (await backend.getProjectsWithCollection()) as any[]
        return resProjectsWithCollection
      } catch (error) {
        console.error("Error on backend.getProjectsWithCollection() call:", error)
      }
    }

    getProjectsWithCollection().then((dataProjectsWithCollection: any[]) => {
      return Promise.all(dataProjectsWithCollection.map(projectCard => {
        return backend.getMetadataNFTColl(projectCard.projectID) as any
      })).then((allMetadata: any[]) => {
        setCollectionsMetadata(allMetadata.flat())
        return allMetadata
      }).catch(error => console.error(error))
    }).catch(error => console.error(error))
  }, [])

  const openDetails = async (collMetaIdx: number) => {
    onOpen()
    setCurrentCollection(collectionsMetadata[collMetaIdx])
  }

  return (
    <>
      <Heading fontSize="4xl" marginBottom="20px">
        Collections list
      </Heading>
      <List spacing={3}>
        {collectionsMetadata?.map((collectionMetadata, collectionMetadataIndex) => {
          return (
            <ListItem key={collectionMetadataIndex}>
              <Card maxW="sm">
                <CardBody>
                  <Heading color="blue.600" fontSize="2xl" marginBottom="15px">
                    {collectionMetadata?.name} ({collectionMetadata?.symbol})
                  </Heading>
                  <Center>
                    <Image
                      src={collectionMetadata?.logo.data}
                      alt={collectionMetadata?.name}
                      borderRadius="lg"
                      height="150px"
                      width="150px"
                      textAlign="center"
                    />
                  </Center>
                </CardBody>
                <Divider />
                <CardFooter>
                  <ButtonGroup spacing="2">
                    <Button
                      colorScheme="blue"
                      onClick={() => openDetails(collectionMetadataIndex)}
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
        <ModalContent color="black">
          <ModalHeader>Collection Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Image
                src={currentCollection?.logo?.data}
                alt={currentCollection?.name}
                borderRadius="lg"
                height="150px"
                width="150px"
              />
            </Center>
            <UnorderedList>
              <ListItem><b>Name:</b> {currentCollection?.name}</ListItem>
              <ListItem><b>Symbol:</b> {currentCollection?.symbol}</ListItem>
              <ListItem><b>Base URL:</b> <ChakraLink href={currentCollection?.baseUrl} isExternal>
                {currentCollection?.baseUrl} <ExternalLinkIcon mx="2px" />
              </ChakraLink></ListItem>
              <ListItem><b>Wallet:</b> {currentCollection?.wallet}</ListItem>
              <ListItem><b>Maximum Limit:</b> {String(currentCollection?.maxLimit)}</ListItem>
              <ListItem><b>Total Supply:</b> {String(currentCollection?.totalSupply)}</ListItem>
              <ListItem><b>Canister Id:</b> {currentCollection?.canisterId}</ListItem>
            </UnorderedList>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CollectionsList
