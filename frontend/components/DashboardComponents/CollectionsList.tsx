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
    const getProjectsPreview = async () => {
      try {
        const resGetProjectsPreview: any[] = (await backend.getProjectsPreview()) as any[]
        return resGetProjectsPreview
      } catch (error) {
        console.error("Error on backend.getProjectsPreview() call:", error)
      }
    }

    getProjectsPreview().then((dataProjectsPreview: any[]) => {
      return Promise.all(dataProjectsPreview.map(projectCard => {
        return backend.getMetadataNFTColl(projectCard.pojectID) as any
      })).then((allMetadata: any[]) => {
        setCollectionsMetadata(allMetadata)
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
            <ListItem>
              <Card maxW="sm">
                <CardBody>
                  <Heading color="blue.600" fontSize="2xl" marginBottom="15px">
                    {collectionMetadata?.name} ({collectionMetadata?.symbol})
                  </Heading>
                  <Center>
                    <Image
                      src={
                        "data:image/png;base64," + blobToBase64(collectionMetadata?.logo)
                      }
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
            <UnorderedList>
              <ListItem>Name: {currentCollection?.name}</ListItem>
              <ListItem>Symbol: {currentCollection?.symbol}</ListItem>
              <ListItem>Base URL: {currentCollection?.baseUrl}</ListItem>
              <ListItem>Wallet: {currentCollection?.wallet}</ListItem>
              <ListItem>Maximum Limit: {currentCollection?.maxLimit}</ListItem>
              <ListItem>Total Supply: {currentCollection?.totalSupply}</ListItem>
              <ListItem>Canister Id: {currentCollection?.canisterId}</ListItem>
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
