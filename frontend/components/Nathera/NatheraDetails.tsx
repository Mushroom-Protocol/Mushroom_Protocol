import React, { useEffect, useState } from "react";
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
  IconButton,
  Link,
} from "@chakra-ui/react";
import { FaLinkedin } from "react-icons/fa";
import TokenomicsNathera from "../../assets/TokenomicsNathera.png";
import Natheralogo from "../../assets/Natheralogo.png";
import NatheraTeamAA from "../../assets/NatheraTeamAA.jpg";
import NatheraTeamPO from "../../assets/NatheraTeamPO.jpg";
import { useCanister } from "@connect2ic/react";

const NatheraDetails = () => {
  const [backend] = useCanister("backend");
  const [startupDetails, setStartupDetails] = useState({
    startUpName: "",
    email: "",
    website: "",
    startUpSlogan: "",
    shortDes: "",
    logo: null, // Asegúrate de proporcionar un array válido aquí
    startupStatus: "",
    tlr: 1,
    fullNameTl: "",
    specializationTL: "",
    linkedinTL: "",
    industry: { MiningTech: null },
    country: "",
  });

  useEffect(() => {
    callBackend();
  }, []);

  const callBackend = async () => {
    const resIncomingStartUps = await backend.getIncomingStartUps();
    const response = await backend.getIncomingStartupByOwner(resIncomingStartUps[0].owner);
    //const responseOk = response.ok;
    //setStartupDetails(responseOk);
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
            <Image src={Natheralogo} alt="Nathera Logo" w="50px" h="50px"  />
            <Box ml="10px">
              <Text fontSize="18px">{startupDetails.startUpName}</Text>
              <Text fontSize="12px" color="#737373" fontStyle="italic">
                {startupDetails.startUpSlogan}
              </Text>
            </Box>
          </Box>
          <Text fontSize="18px" textAlign="justify">
            Startup Details
          </Text>
          <Text fontSize="18px" color="#737373" textAlign="justify">
            <br />
            {startupDetails.shortDes}
            Founded from Chile, Nathera is led by the visionary Aline Alfaro, whose leadership
            spearheads a team committed to revolutionizing the landscape of musculoskeletal disease
            management. With an early-stage status and a valuation pre-money of $20,000, the startup
            navigates the frontier of healthcare innovation, driven by a relentless pursuit of
            groundbreaking therapeutic advancements.
          </Text>
        </GridItem>
        <GridItem>
          <Tabs color="#737373" size="md">
            <TabList>
              <Tab>Collection</Tab>
              <Tab>R&D Project</Tab>
              <Tab>Tokenomics</Tab>
              <Tab>Team</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {/* Contenido para la pestaña "Collection" */}
                <Text fontSize="16px" color="#737373" textAlign="justify">
                  The NFT collection "Nathera: Warrior Cells" is an innovative initiative designed to
                  fund scientific research and develop revolutionary biomedical solutions. With a
                  visionary approach, this collection uses non-fungible tokenization technology
                  (NFT), specifically dynamic NFTs to raise funds.
                  <br />
                  <br />
                  These brave cellular warriors are here to heal wounds and advance decentralized
                  sciences. An army of highly specialized fibroblasts, which through powerful
                  nanofilaments accelerate the cell regeneration process. Each fibroblast in this
                  collection is represented by its own exclusive NFT, allowing you to join the cause
                  and be an active part of the future of medicine and health.
                  <br />
                  <br />
                  <Text fontSize="16px" color="#FFFFFF">
                    Utilities
                  </Text>
                  <br />
                  <Text fontSize="16px" color="#FFFFFF">
                    GOVERNANCE:
                  </Text>{" "}
                  Each NFT holder has the power to vote and oversee the development of research and
                  project progress on the FungiDAO.
                  <br />
                  <br />
                  <Text fontSize="16px" color="#FFFFFF">
                    IP-NFT:
                  </Text>{" "}
                  The NFT accredits part of the ownership of the intellectual and commercialization
                  rights of the technologies developed with the funds.
                  <br />
                  <br />
                  <Text fontSize="16px" color="#FFFFFF">
                    MEMBERSHIP:
                  </Text>{" "}
                  Get privileged access to cutting-edge scientific content and exclusive services on
                  the future Mushroom Protocol platform.
                  <br />
                  <br />
                  <Text fontSize="16px" color="#FFFFFF">
                    DEFI:
                  </Text>{" "}
                  The NFT becomes a valuable asset that can be used in various DeFi services within
                  the future Mushroom Protocol platform.
                </Text>
              </TabPanel>
              <TabPanel>
                {/* Contenido para la pestaña "R&D Project" */}
                <Text fontSize="16px" color="#737373" textAlign="justify">
                  <Text fontSize="18px" color="#FFFFFF">
                    2024 - Q4
                  </Text>
                  <br />
                  Stage 1: Create Startup
                  <br />
                  Stage 2: In vivo study of nanofilaments in a tissue damage model.
                  <br />
                  <br />
                  <Text fontSize="18px" color="#FFFFFF">
                    2025 - Q2
                  </Text>
                  <br />
                  Stage 3: Develop and validate Nathera technology
                  <br />
                  Stage 4: Preparation of a commercial formulation of the nanofilament.
                  <br />
                  <br />
                  <Text fontSize="18px" color="#FFFFFF">
                    2025 - Q4
                  </Text>
                  <br />
                  Stage 5: Nathera Commercial and Proprietary Rights
                  <br />
                  <br />
                  <Text fontSize="18px" color="#FFFFFF">
                    MILESTONES AND INDICATORS
                  </Text>
                  <br />
                  1. In vivo study
                  <br />
                  2. Commercial formulation
                  <br />
                  <br />
                  <Text fontSize="18px" color="#FFFFFF">
                    DURATION:
                  </Text>
                  <br />
                  16 Months
                </Text>
              </TabPanel>
              <TabPanel>
                {/* Contenido para la pestaña "Tokenomics" */}
                <Text fontSize="16px" color="#737373" textAlign="justify">
                  Collection tokenomics allocates 60% of the tokens to the Public Sale of 600 NFTs,
                  funding biomedical research. 15% rewards Inventors with 150 NFTs. 8% goes to the
                  Stability Reserve Fund, and 10% supports Advisors and Collaborators with 100 NFTs.
                  In addition, 6% is set aside for Airdrops and 1% for liquidity in the DEX.
                </Text>
                <Image src={TokenomicsNathera} width="420px" height="350px" ml="50px" />
              </TabPanel>
              <TabPanel>
                {/* Contenido para la pestaña "Team" */}
                <Flex borderRadius="lg" p={4} alignItems="center" boxShadow="md">
                  <Image
                    objectFit="cover"
                    width="150px"
                    height="150px"
                    borderRadius="full"
                    src={NatheraTeamAA}
                    alt="Profile"
                  />
                  <Box ml={9}>
                    <Text fontSize="18px" textColor="#FFFFFF">
                      Aline Alfaro
                    </Text>
                    <Text py={2} fontSize="14px" color="#737373">
                      Team leader
                      <br />
                      Center for the Development of Nanoscience and Nanotechnology CEDENNA.
                      <br />
                      Biochemistry / University of Santiago de Chile
                    </Text>
                    <Flex mt={1}>
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
                <Flex borderRadius="lg" p={4} alignItems="center" boxShadow="md">
                  <Image
                    objectFit="cover"
                    width="150px"
                    height="150px"
                    borderRadius="full"
                    src={NatheraTeamPO}
                    alt="Profile"
                  />
                  <Box ml={9}>
                    <Text fontSize="18px" textColor="#FFFFFF">
                      Pedro Orihuela
                    </Text>
                    <Text py={2} fontSize="14px" color="#737373">
                      Chief Research Scientist at Nathera
                      <br />
                      PhD, Cell Physiology / Universidad de Chile
                    </Text>
                    <Flex mt={1}>
                      <IconButton
                        as="a"
                        href={"https://www.linkedin.com/in/pablo-osses-71b93a205/"}
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
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </Center>
  );
};

export default NatheraDetails;
