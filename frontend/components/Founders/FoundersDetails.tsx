import React, { useEffect, useState } from "react";
import {
  Center,
  Grid,
  GridItem,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Image,
  Link,
} from "@chakra-ui/react";
import { useCanister } from "@connect2ic/react";
import { useLocation } from "react-router-dom";
import { CollectionPreInit } from "../CommonTypes";
import faviconico from "../../assets/Faviconico.png";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const FoundersDetails = () => {
  const [backend] = useCanister("backend");
  const location = useLocation();
  const [collectionRequestByStartUp, setCollectionRequestByStartUp] = useState<
    CollectionPreInit | null | undefined
  >();

  useEffect(() => {
    // Llamada a la función para obtener detalles de la colección
    // getCollectionRequestByStartUp(location.state.startupID).then(collectionRequestByStartUp => setCollectionRequestByStartUp(collectionRequestByStartUp)).catch(error => console.error(error));
  }, []);

  const getCollectionRequestByStartUp = async (startupID: string) => {
    const resCollectionRequestByStartUp: CollectionPreInit | null | undefined =
      (await backend.getCollectionRequestByStartUp(
        startupID
      )) as CollectionPreInit | null | undefined;
    setCollectionRequestByStartUp(resCollectionRequestByStartUp);
    return resCollectionRequestByStartUp;
  };

  return (
    <Center>
      <Grid
        templateColumns={{ base: "1fr", lg: "40% 60%" }}
        templateRows="1fr"
        gap={{ base: 4, lg: 8 }}
        maxWidth="100%"
        width="100%"
        color="#FFFFFF"
        p={{ base: "20px", lg: "40px" }}
      >
        <GridItem
          bg="#000000"
          p={{ base: "20px", lg: "40px" }}
          borderRadius="15px"
          boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <Box display="flex" alignItems="center" mb="20px">
            <Image
              src={faviconico}
              alt="Mushroom Protocol Logo"
              w="50px"
              h="50px"
              borderRadius="full"
            />
            <Box ml="10px">
              <Text fontSize="18px">Mushroom Protocol</Text>
              {/* Comentado ya que collectionRequestByStartUp no está disponible */}
              {/* <Text fontSize="12px" color="#737373" fontStyle="italic">
                {collectionRequestByStartUp?.shortStorytelling}
              </Text> */}
            </Box>
          </Box>
          <Text fontSize="18px" textAlign="justify">
            Startups Details
          </Text>
          <Text fontSize="18px" color="#737373" textAlign="justify">
            {/* Comentado ya que collectionRequestByStartUp no está disponible */}
            {/* {collectionRequestByStartUp?.storytellingCollection} */}
            <br />
            The protocol allows investors from around the world to fund science
            through a system of tokenization of biotechnology-based research,
            using intellectual property as collateral. Users can access IP-NFTs
            (Dynamic NFTs), generated from the intellectual property value of
            the research by exchanging their cryptoassets for NFTs and use them
            to fund, exchange, vote or win in our decentralized funding
            ecosystem.
            <br />
            <br />
            Join our mission to advance biotechnology by funding impact
            research. With your valuable support, scientists will be able to
            develop solutions that will improve the lives of millions of people.
          </Text>
        </GridItem>
        <GridItem>
          <Tabs color="#737373" size="md">
            <TabList>
              <Tab>Collection</Tab>
              <Tab>Details</Tab>
              <Tab>Story</Tab>
              <Tab>Links</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {/* Contenido para la pestaña "Collection" */}
                <Text fontSize="16px" color="#737373" textAlign="justify">
                  Mushroom Founders is a collection of 444 NFTs, unique digital
                  collectibles living on the Internet Computer blockchain. Your
                  Mushroom Founders acts as your access card to Mushroom Protocol.
                  The funds obtained from the sale of the collection will allow us
                  to develop our protocol and finance the innovation of Latam
                  scientists. As the collection is sold, various functions related
                  to the usefulness of the NFT, Staking and FungiDAO will be
                  activated.
                  <br />
                  <br />
                  Become a founder of Mushroom Protocol with your NFT and help us
                  revolutionize biotech development.
                  <br />
                  <br />
                  <Text fontSize="16px" color="#FFFFFF">
                    Utilities
                  </Text>
                  <br />
                  <Text fontSize="16px" color="#FFFFFF">
                    AIRDROPS:
                  </Text>{" "}
                  You will receive $FUNGI tokens before listing on the market. and
                  IP-NFTs of the first research batch.
                  <br />
                  <br />
                  <Text fontSize="16px" color="#FFFFFF">
                    IP-NFT:
                  </Text>{" "}
                  Stake Mushroom Founders NFT and get $FUNGI token rewards.
                  <br />
                  <br />
                  <Text fontSize="16px" color="#FFFFFF">
                    MEMBERSHIP:
                  </Text>{" "}
                  Early access to the Mushroom Protocol DeFi services and
                  Metaverse.
                  <br />
                  <br />
                  <Text fontSize="16px" color="#FFFFFF">
                    GOVERNANCE:
                  </Text>{" "}
                  Vote and monitor the development of project progress on the
                  FungiDAO.
                </Text>
              </TabPanel>
              <TabPanel>
                {/* Contenido para la pestaña "Details" */}
                <Text fontSize="16px" color="#737373" textAlign="justify">
                  The «Mushroom Founders» NFT collection is available on the
                  Internet Computer Protocol (ICP) network, which offers
                  interoperability with the Ethereum network. The Founders are
                  stored as DIP-721 tokens.
                  <br />
                  <br />
                  The first batch (222 NFT) will be offered for sale through Lens
                  Protocol. They will be sold in 10 lots of 22 NFTs, with a starting
                  price of 12 USD. Each lot will increase in price by 30%.
                  <br />
                  <br />
                  The other 156 NFT will be available on the ICP network through our
                  mint page at an initial value of 1 ICP. The lots will increase in
                  value at a rate of 30%.
                  <br />
                  <br />
                  66 Founders are excluded from the sale. These will be used for
                  giveaways, rewards, and creator memberships.
                </Text>
              </TabPanel>
              <TabPanel>
                {/* Contenido para la pestaña "Story" */}
                <Text fontSize="16px" color="#737373" textAlign="justify">
                  «Mushroom Founders» NFT collection tells the story of 444
                  extraterrestrial mushrooms, who managed to escape the
                  technological cataclysm that devastated their home 10 eons ago.
                  <br />
                  <br />
                  Each NFT possesses a unique specialty, which is vital in their
                  mission to spread knowledge and guide civilizations of the
                  universe to a path of balance and harmony as a form of redemption.
                  <br />
                  <br />
                  As they travel the universe in their ships, they become the
                  disseminators of transcendental knowledge.
                </Text>
              </TabPanel>
              <TabPanel>
                {/* Contenido para la pestaña "Links" */}
                <Text fontSize="16px" color="#737373" textAlign="justify">
                  <Link href="https://mushroomprotocol.io/founders/" isExternal>
                    Collection Website <ExternalLinkIcon mx="2px" />
                  </Link>
                  <br />
                  <br />
                  <Link href="https://mushroomprotocol.io/" isExternal>
                    Protocol Website <ExternalLinkIcon mx="2px" />
                  </Link>
                </Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </Center>
  );
};

export default FoundersDetails;
