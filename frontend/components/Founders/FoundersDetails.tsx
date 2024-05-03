import React from "react";
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
  TabPanel
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const FoundersDetails = () => {
  return (
    <Center>
    <Grid
      templateColumns="40% 60%"
      templateRows="1fr"
      h="580px"
      w="1024px"
     
      color="#FFFFFF"
      p="25px"
    >
      <GridItem
        bg="#000000"
        p="20px"
        border="1px"
        borderColor="#1FAFC8"
        borderRadius="15px"
      >
        <Box display="flex" alignItems="center" mb="20px">
          <img
            src="https://mushroomprotocol.io/wp-content/uploads/2023/10/Mp-Favicon-1.png"
            alt="Mushroom Protocol Logo"
            width="50px"
            height="50px"
          />
          <Box ml="10px">
            <Text fontSize="18px">Mushroom Protocol</Text>
            <Text fontSize="12px" color="#737373" fontStyle="italic">
            Driving the financial revolution in Biotechnology
            </Text>
          </Box>
        </Box>
        <Text fontSize="18px" textAlign="justify">
          Startup Details
          <br />
        </Text>
        <Text fontSize="15px" color="#737373" textAlign="justify">
        <br />
        Mushroom Protocol is a Web3 platform that allows to bridge the
          blockchain world with Biotechnology, providing a new form of
          non-traditional financing. Mushroom Protocol works to decentralize
          funding in science and provide a free equity funding channel for
          scientists and biotech startups in Latin America.
          <br />
          <br />
          The protocol allows investors from around the world to fund science
          through a system of tokenization of biotechnology-based research,
          using intellectual property as collateral. Users can access BioTokens
          (Dynamic NFTs), generated from the intellectual property value of the
          research by exchanging their cryptoassets for NFTs and use them to
          fund, exchange, vote or win in our decentralized funding ecosystem.</Text>
      </GridItem>
      <GridItem>
        <Tabs color="#737373" size="md" ml="20" mr="0">
          <TabList>
            <Tab>Collection</Tab>
            <Tab>Details</Tab>
            <Tab>Story</Tab>
            <Tab>Links</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {/* Contenido para la pestaña "Collection" */}
              <p>
                <Text fontSize="12px" color="#737373" textAlign="justify">
                Mushroom Founders is a collection of 500 NFTs, unique digital collectibles living on the Internet Computer blockchain. Your Mushroom Founders acts as your access card to Mushroom Protocol. The funds obtained from the sale of the collection will allow us to develop our protocol and finance the innovation of Latam scientists. As the collection is sold, various functions related to the usefulness of the NFT, Staking and FungiDAO will be activated.
                <br />
                <br />
Become a founder of Mushroom Protocol with your NFT and help us revolutionize biotech development
                  <br />
                  <br />
                  <Text fontSize="15px" color="#FFFFFF">
                    Utilities
                  </Text>
                  <br />
                  <Text fontSize="12px" color="#FFFFFF">
                  AIRDROPS:
                  </Text>
                  You will receive 25 $FUNGI tokens before listing on the market. and IP-NFTs of the first research batch.
                  <br />
                  <br />
                  <Text fontSize="12px" color="#FFFFFF">
                    IP-NFT:
                  </Text>
                  Stake Mushroom Founders NFT and get $FUNGI token rewards.
                  <br />
                  <br />
                  <Text fontSize="12px" color="#FFFFFF">
                    MEMBERSHIP:
                  </Text>
                  Early access to the Mushroom Protocol DeFi services and Metaverse.
                  <br />
                  <br />
                  <Text fontSize="12px" color="#FFFFFF">
                  GOVERNANCE:
                  </Text>
                  Vote and monitor the development of project progress on the FungiDAO.
                </Text>
              </p>
            </TabPanel>
            <TabPanel>
              {/* Contenido para la pestaña "Tokenomics" */}
              <p><Text fontSize="16px" color="#737373" textAlign="justify">
                  The «Mushroom Founders» NFT collection is available on the
                  Internet Computer Protocol (ICP) network, which offers
                  interoperability with the Ethereum network. The Founders are
                  stored as DIP-721 tokens.
                  <br />
                  <br />
                  Each founder is unique and is generated randomly at the time
                  of minting.
                  <br />
                  <br />
                  Firstly, you can mint 250 directly from our page, at a
                  preferential price. Then another 250 will be
                  available on Founded. <br />
                  <br />
                  25 Founders are excluded from the sale. These will be used for
                  giveaways, rewards, and creator memberships.
                </Text></p>
            </TabPanel>
            <TabPanel>
              {/* Contenido para la pestaña "R&D Project" */}
              <p> <Text fontSize="16px" color="#737373" textAlign="justify">
                  «Mushroom Founders» NFT collection tells the story of 500
                  extraterrestrial mushrooms, who managed to escape the
                  technological cataclysm that devastated their home 10 eons
                  ago.
                  <br />
                  <br />
                  Each NFT possesses a unique specialty, which is vital in their
                  mission to spread knowledge and guide civilizations of the
                  universe to a path of balance and harmony as a form of
                  redemption. <br />
                  <br />
                  As they travel the universe in their ships, they become the
                  disseminators of transcendental knowledge.
                </Text></p>
            </TabPanel>
            <TabPanel>
              {/* Contenido para la pestaña "Team" */}
              <p>  <Link href="https://mushroomprotocol.io/founders/" isExternal>
                  Collection Website <ExternalLinkIcon mx="2px" />
                </Link>
                <br />
                <br />
                <Link href="https://mushroomprotocol.io/" isExternal>
                  Protocol Website <ExternalLinkIcon mx="2px" />
                </Link></p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </GridItem>
    </Grid>
    </Center>
  );
};

export default FoundersDetails;
