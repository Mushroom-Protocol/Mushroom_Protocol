import { useCanister } from "@connect2ic/react"
import React, { useEffect, useState } from "react"
import { MetadataResultExtended } from "../CommonTypes"
import { Button, ButtonGroup, Card, CardBody, CardFooter, Center, Divider, Heading, Image, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useDisclosure } from "@chakra-ui/react"
import { blobToBase64 } from "../CommonHelpers"

const Portfolio: React.FC = () => {
  const [backend] = useCanister("backend")
  const [myNfts, setMyNfts] = useState<MetadataResultExtended[]>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [metadataNFTColl, setMetadataNFTColl] = useState<any>({})
  const [currentNFT, setCurrentNFT] = useState<any>({})
  let nftImageUrl = ""

  useEffect(() => {
    const getMyNfts = async () => {
      try {
        const resMyNfts: MetadataResultExtended[] = await backend.getMyNfts() as MetadataResultExtended[]
        setMyNfts(resMyNfts)
        return resMyNfts
      } catch (error) {
        console.error("Error on backend.getMyNfts() call:", error)
      }
    }

    getMyNfts()
  }, [])

  const openMetadata = async (currNft: any) => {
    const resMetadataNFTColl: any = (await backend.getMetadataNFTColl(
      currNft.projectId,
    )) as any
    console.log(resMetadataNFTColl)
    setMetadataNFTColl(resMetadataNFTColl)
    setCurrentNFT(currNft)
    onOpen()
    // return resMetadataNFTColl
  }

  return (
    <>
      <Heading fontSize="4xl" marginBottom="20px">
        NFTs portfolio
      </Heading>
      <List spacing={3}>
        {myNfts?.map((myNft) => {
          return (
            <ListItem>
              <Card maxW="sm">
                <CardBody>
                  <Heading color="blue.600" fontSize="2xl" marginBottom="15px">
                    {myNft.tokenId + " (" + myNft.projectId + ")"}
                  </Heading>
                  <Center>
                    <Image
                      src={
                        myNft.metadata.Ok[0].key_val_data[0].val.TextContent
                      }
                      alt={myNft.tokenId}
                      borderRadius="lg"
                      height="150px"
                      width="150px"
                      textAlign="center"
                    />
                  </Center>
                  <Stack mt="6" spacing="3">
                    {/* <Text size="md">{startup.startUpSlogan}</Text> */}
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                  <ButtonGroup spacing="2">
                    <Button
                      colorScheme="blue"
                      onClick={() => openMetadata(myNft)}
                    >
                      Metadata
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
              {`NFT token ${currentNFT.tokenId} (${currentNFT.projectId})`}
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{ color: "black" }}>
            <Text>
              <b>Name:</b> {metadataNFTColl?.name}
            </Text>
            <Text>
              <b>Symbol:</b> {metadataNFTColl?.symbol}
            </Text>
            <Text>
              <b>Base URL:</b> {metadataNFTColl?.symbol}
            </Text>
            <Text>
              <b>Max limit:</b> {Number(metadataNFTColl?.maxLimit)}
            </Text>
            <Text>
              <b>Total supply:</b> {Number(metadataNFTColl?.totalSupply)}
            </Text>
            <Text>
              <b>Logo:</b> {metadataNFTColl?.logo?.data}
            </Text>
            {/* <Text>
              <b>Holders:</b> {JSON.stringify(metadataNFTColl?.holders)}
            </Text>
            <Text>
              <b>Prices:</b> {JSON.stringify(metadataNFTColl?.prices)}
            </Text>
            <Text>
              <b>Custodians:</b> {JSON.stringify(metadataNFTColl?.baseUrl)}
            </Text> */}
            {/* <Center>
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
            </Center> */}
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

export default Portfolio
