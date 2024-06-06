import { useCanister } from "@connect2ic/react"
import React, { useEffect, useState } from "react"
import { MetadataResultExtended } from "../CommonTypes"
import { Button, ButtonGroup, Card, CardBody, CardFooter, Center, Divider, Heading, Image, List, ListItem, Stack, Text } from "@chakra-ui/react"
import { blobToBase64 } from "../CommonHelpers"

const Portfolio: React.FC = () => {
  const [backend] = useCanister("backend")
  const [myNfts, setMyNfts] = useState<MetadataResultExtended[]>()
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
                      // onClick={() => openDetails(startup.startupId)}
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
    </>
  )
}

export default Portfolio
