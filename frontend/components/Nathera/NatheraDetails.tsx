import React from "react";
import {
  Center,
  Grid,
  GridItem,
  Box,
  Text,
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Image,
  Card, Stack, Heading, Button, IconButton,
} from "@chakra-ui/react";
import { FaLinkedin } from "react-icons/fa";
import TokenomicsNathera from "../../assets/TokenomicsNathera.png"
import Natheralogo from "../../assets/Natheralogo.png"
import NatheraTeamAA from "../../assets/NatheraTeamAA.jpg"
import NatheraTeamPO from "../../assets/NatheraTeamPO.jpg"

const NatheraDetails = () => {
  return (
    <Center>
    <Grid
      templateColumns="40% 60%"
      templateRows="1fr"
      h="620px"
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
            src={Natheralogo}
            alt="Nathera Logo"
            width="50px"
            height="50px"
          />
          <Box ml="10px">
            <Text fontSize="18px">NATHERA</Text>
            <Text fontSize="12px" color="#737373" fontStyle="italic">
              Nanotherapy to Improve Well Being
            </Text>
          </Box>
        </Box>
        <Text fontSize="18px" textAlign="justify">
          Startup Details
          <br />
        </Text>
        <Text fontSize="15px" color="#737373" textAlign="justify">
        <br></br>Nathera is a pioneering startup dedicated to the advancement of HealthTech through cutting-edge nanotechnology solutions. Focused on addressing the pressing concerns of musculoskeletal ailments like osteoarthritis, low back pain, and rheumatoid arthritis, the project stands at the forefront of innovative treatments in the health tech industry.
        <br></br><br></br>
        Founded  from Chile, Nathera is led by the visionary Aline Alfaro, whose leadership spearheads a team committed to revolutionizing the landscape of musculoskeletal disease management. With an early-stage status and a valuation pre-money of $20,000, the startup navigates the frontier of healthcare innovation, driven by a relentless pursuit of groundbreaking therapeutic advancements.  </Text>
      </GridItem>
      <GridItem>
        <Tabs color="#737373" size="md" ml="20" mr="0">
          <TabList>
            <Tab>Collection</Tab>
            <Tab>R&D Project</Tab>
            <Tab>Tokenomics</Tab>
            <Tab>Team</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {/* Contenido para la pestaña "Collection" */}
              <p>
                <Text fontSize="12px" color="#737373" textAlign="justify">
                  The NFT collection "Nathera: Warrior Cells" is an innovative
                  initiative designed to fund scientific research and develop
                  revolutionary biomedical solutions. With a visionary approach,
                  this collection uses non-fungible tokenization technology
                  (NFT), specifically dynamic NFTs to raise funds.
                  <br />
                  <br />
                  These brave cellular warriors are here to heal wounds and
                  advance decentralized sciences. An army of highly specialized
                  fibroblasts, which through powerful nanofilaments accelerate
                  the cell regeneration process. Each fibroblast in this
                  collection is represented by its own exclusive NFT, allowing
                  you to join the cause and be an active part of the future of
                  medicine and health.
                  <br />
                  <br />
                  <Text fontSize="15px" color="#FFFFFF">
                    Utilities
                  </Text>
                  <br />
                  <Text fontSize="12px" color="#FFFFFF">
                    GOVERNANCE:
                  </Text>
                  Each NFT holder has the power to vote and oversee the
                  development of research and project progress on the FungiDAO.
                  <br />
                  <br />
                  <Text fontSize="12px" color="#FFFFFF">
                    IP-NFT:
                  </Text>
                  The NFT accredits part of the ownership of the intellectual
                  and commercialization rights of the technologies developed
                  with the funds.
                  <br />
                  <br />
                  <Text fontSize="12px" color="#FFFFFF">
                    MEMBERSHIP:
                  </Text>
                  Get privileged access to cutting-edge scientific content and
                  exclusive services on the future Mushroom Protocol platform.
                  <br />
                  <br />
                  <Text fontSize="12px" color="#FFFFFF">
                    DEFI:
                  </Text>
                  The NFT becomes a valuable asset that can be used in various
                  DeFi services within the future Mushroom Protocol platform.
                </Text>
              </p>
            </TabPanel>
            <TabPanel>
              {/* Contenido para la pestaña "R&D Project" */}
              <p><text>
                <Text fontSize="15px" color="#FFFFFF">
                2024 - Q2
                </Text>
                Stage 1: Create Startup
                <br />
                Stage 2: In vivo study of nanofilaments in a tissue damage model.
                <br /><br />
                <Text fontSize="15px" color="#FFFFFF">
                2024 - Q3
                </Text>
                Stage 3: Develop and validate Nathera technology
                <br />
                Stage 4: Preparation of a commercial formulation of the nanofilament.
                <br /><br />
                <Text fontSize="15px" color="#FFFFFF">
                2025 - Q1
                </Text>
                Stage 5: Nathera Commercial and Proprietary Rights
                <br /><br />
                
                <Text fontSize="15px" color="#FFFFFF">
                MILESTONES AND INDICATORS
                </Text>
                1. In vivo study
                <br />
                2. Commercial formulation
                <br /><br />
                <Text fontSize="15px" color="#FFFFFF">
                DURATION:
                </Text>
                16 Months
              </text></p>
            </TabPanel>
            <TabPanel>
              {/* Contenido para la pestaña "tOKENOMICS" */}
              <p><Text color="#737373" textAlign="justify">
              Collection tokenomics allocates 60% of the tokens to the Public Sale of 600 NFTs, funding biomedical research. 15% rewards Inventors with 150 NFTs. 8% goes to the Stability Reserve Fund, and 10% supports Advisors and Collaborators with 100 NFTs. In addition, 6% is set aside for Airdrops and 1% for liquidity in the DEX.
              </Text>
              <Image src={TokenomicsNathera}
              width="420px"
              height="350px"
              ml="50px"
              />
              </p>
            </TabPanel>
            <TabPanel>
              {/* Contenido para la pestaña "Team" */}
              <p>    
    <Flex
            borderRadius="lg"
            p={4}
            alignItems="center"
            boxShadow="md"
          >
            <Image
              objectFit="cover"
              width="150px"
              height="150px"
              borderRadius="full" // Hace que la imagen sea circular
              src={NatheraTeamAA}
              alt="Profile"
            />

            <Box ml={9}>
              <Heading textColor="#FFFFFF" size="md">Aline Alfaro</Heading>

              <Text py={2} fontSize="12px" color="#737373">
                Team leader
                <br />
                Center for the Development of Nanoscience and Nanotechnology CEDENNA.
                <br />
                Biochemistry / University of Santiago de Chile
              </Text>

              <Flex mt={1}>
                {/* Cambié el botón a un IconButton con el icono de LinkedIn */}
                <IconButton
                  as="a"
                  href={"https://www.linkedin.com/in/aline-alfaro-ramirez-49a322170/"}
                  target="_blank"
                  aria-label="LinkedIn"
                  icon={<FaLinkedin />}
                  color="black"
                  backgroundColor="white"
                  variant="solid"
                  borderRadius="full"
                />
             </Flex>
      </Box>
    </Flex>
    <Flex

            borderRadius="lg"
            p={4}
            alignItems="center"
            boxShadow="md"
          >
            <Image
              objectFit="cover"
              width="150px"
              height="150px"
              borderRadius="full" // Hace que la imagen sea circular
              src={NatheraTeamPO}
              alt="Profile"
            />

            <Box ml={9}>
              <Heading textColor="#FFFFFF" size="md">Pedro Orihuela</Heading>

              <Text py={2} fontSize="12px" color="#737373">
              Senior Researcher
                <br />
                PhD Cell Physiology
                <br />
                University of Santiago de Chile
              </Text>

              <Flex mt={1}>
                {/* Cambié el botón a un IconButton con el icono de LinkedIn */}
                <IconButton
                  as="a"
                  href="https://www.linkedin.com/in/pedro-orihuela-759b9148/"
                  target="_blank"
                  aria-label="LinkedIn"
                  icon={<FaLinkedin />}
                  color="black"
                  backgroundColor="white"
                  variant="solid"
                  borderRadius="full"
                />
             </Flex>
      </Box>
    </Flex>
    </p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </GridItem>
    </Grid>
    </Center>
  );
};

export default NatheraDetails;
