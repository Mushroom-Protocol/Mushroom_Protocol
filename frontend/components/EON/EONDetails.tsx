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
import EONLogo from "../../assets/EONlogo.png";
import EONTeam from "../../assets/EONTeam.jpg";
import { useCanister } from "@connect2ic/react";

const EONDetails = () => {
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
            <Image src={EONLogo} alt="EON Logo" w="50px" h="50px" borderRadius="10px"  />
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
            Founded in Mexico, EON is at the forefront of food preservation technology. The company is developing an edible nanocoating based on biodegradable nanoparticles safe for human consumption. This innovative coating aims to extend the shelf life of fruits and vegetables and prevent colonization by foodborne pathogens that directly affect their longevity.
            <br />
            <br />
            The industrial process involves extracting antimicrobial agents from broccoli, which are then formulated into organic nanocapsules. The nanocoating is composed of chitosan nanoparticles that encapsulate functional compounds. These compounds are steadily released on the surface of the produce, delaying ripening and preventing pathogen colonization.
            <br />
            <br />
            EON's cutting-edge approach leverages advanced nanotechnology to enhance food preservation, reduce waste, and promote food safety. By pioneering this sustainable solution, EON is contributing to a future where fresh produce lasts longer and is safer to consume.          </Text>
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
                The NFT collection "EON: Broccoli Pickers" showcases genetically engineered plant creatures designed to collect garbage and clean cities, embodying symbols of hope and environmental stewardship. This groundbreaking initiative employs dynamic NFT technology to support the development of sustainable urban solutions.                <br />
                <br />
                These botanical guardians are equipped with the unique ability to purify urban environments, using their genetic enhancements to consume waste and restore cleanliness. Each Pickers in this collection is represented by an exclusive NFT, inviting supporters to join the mission and actively participate in shaping a cleaner, greener future.                <br /><br />
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
                    2024
                  </Text>
                  <br />
                  Stage 1: Create Startup.
                  <br />
                  Stage 2: In vivo study of nanocoating on fruits and vegetables.
                  <br />
                  <br />
                  <Text fontSize="18px" color="#FFFFFF">
                    2025
                  </Text>
                  <br />
                  Stage 3: Validate MVP of «EON».
                  <br />
                  Stage 4: Develop a commercial product.
                  <br />
                  Stage 5: Register commercial and property rights of «EON»
                  <br />
                  <br />
                  <Text fontSize="18px" color="#FFFFFF">
                    MILESTONES AND INDICATORS
                  </Text>
                  <br />
                  1. ommercial product formulation.
                  <br />
                  2. Registration of the technology and product.
                  <br /><br/>
                  <Text fontSize="18px" color="#FFFFFF">
                    DURATION:
                  </Text>
                  <br />
                  12 Months
                </Text>
              </TabPanel>
              <TabPanel>
                {/* Contenido para la pestaña "Tokenomics" */}
                <Text fontSize="16px" color="#737373" textAlign="justify">
                This tokenomics has not been completely designed. The information provided here is only a guide.
                <br /><br />
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
                    src={EONTeam}
                    alt="Profile"
                  />
                  <Box ml={9}>
                    <Text fontSize="18px" textColor="#FFFFFF">
                    Emanuel Guajardo Correa
                    </Text>
                    <Text py={2} fontSize="14px" color="#737373">
                    Team Leader
                      <br />
                      Ph.D. in Pharmacology 

                    </Text>
                    <Flex mt={1}>
                      <IconButton
                        as="a"
                        href={"https://www.linkedin.com/in/emanuel-adri%C3%A1n-guajardo-correa-04b77814b/?originalSubdomain=cl"}
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

export default EONDetails;
