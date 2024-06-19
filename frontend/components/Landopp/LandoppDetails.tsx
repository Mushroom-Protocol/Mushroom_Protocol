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
import TokenomicsLandopp from "../../assets/TokenomicsLandopp.png";
import Landopp_icon from "../../assets/Landopp_icon.png";
import PabloLandopp from "../../assets/PabloLandopp.png";
import DiegoLandopp from "../../assets/DiegoLandopp.jpg";
import { useCanister } from "@connect2ic/react";

const LandoppDetails = () => {
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
            <Image src={Landopp_icon} alt="Landopp icon" w="50px" h="50px"  />
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
            Founded from Uruguay, Landopp is at the forefront of environmental innovation. Led by a visionary team, the company is committed to revolutionizing the production landscape by offering sustainable alternatives to plastic products. Landopp collects organic waste and repurposes it, thereby reducing greenhouse gas emissions and minimizing environmental impact. With a mission to create a cleaner, greener future, Landopp navigates the frontier of ecological innovation, driven by a relentless pursuit of groundbreaking sustainable advancements.
            <br/><br/>
            Landopp’s innovative approach leverages cutting-edge research, development, and technology to create bioplastics from organic material. This not only provides a viable solution for waste management but also supports the global fight against plastic pollution. Their initiatives encompass a wide range of applications, from biodegradable packaging to eco-friendly construction materials.
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
                The NFT collection "Landopp: NoPlas" is an innovative initiative designed to fund environmental research and develop revolutionary sustainable solutions. With a visionary approach, this collection uses non-fungible tokenization technology (NFT), specifically dynamic NFTs, to raise funds.
                  <br />
                  <br />
                  These Mysterious Organic Gems are here to transform materials science and promote sustainable innovation. Sourced from sacred plants, these gems can fuse with elements, regenerate, and create strong, flexible matter in harmony with nature. Each gem in this collection is represented by its own exclusive NFT, allowing you to join the cause and be an active part of the future of eco-friendly technology and sustainability.
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
                    2024
                  </Text>
                  <br />
                  Stage 1: R&D: Biomass production and processing.
                  <br />
                  Stage 2: Initial prototype: Testing of physical-chemical properties.
                  <br />
                  Stage 3: R&D: Incremental advancement of the percentage of organic content in formulations.
                  <br /><br />
                  <Text fontSize="18px" color="#FFFFFF">
                    2025
                  </Text>
                  <br />
                  Stage 4: Prototypes and final testing.
                  <br />
                  Stage 5: 100% organic biopolymern Finished product.
                  <br />
                  <br />
                  <Text fontSize="18px" color="#FFFFFF">
                    MILESTONES AND INDICATORS
                  </Text>
                  <br />
                  1. Prototype with 30% biomass
                  <br />
                  2. Prototype with 70% biomass
                  <br />
                  3. 100% organic biopolymer.
                  <br /><br />
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
                Collection tokenomics allocates 70% of the tokens to the Public Sale of 455 NFTs, funding research. 15.1% rewards Inventors with 98 NFTs. 8% goes to the Stability Reserve Fund, and 6.9% is set aside for Airdrops.
                </Text>
                <Image src={TokenomicsLandopp} width="420px" height="350px" ml="50px" />
              </TabPanel>
              <TabPanel>
                {/* Contenido para la pestaña "Team" */}
                <Flex borderRadius="lg" p={4} alignItems="center" boxShadow="md">
                  <Image
                    objectFit="cover"
                    width="150px"
                    height="150px"
                    borderRadius="full"
                    src={PabloLandopp}
                    alt="Profile"
                  />
                  <Box ml={9}>
                    <Text fontSize="18px" textColor="#FFFFFF">
                      Pablo Surazsky
                    </Text>
                    <Text py={2} fontSize="14px" color="#737373">
                    Co-founder & CEO
                      <br />
                      Senior in communication and digital transformation consulting. 
                    </Text>
                    <Flex mt={1}>
                      <IconButton
                        as="a"
                        href={"https://www.linkedin.com/in/pablosuraz/"}
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
                    src={DiegoLandopp}
                    alt="Profile"
                  />
                  <Box ml={9}>
                    <Text fontSize="18px" textColor="#FFFFFF">
                    Diego Fort
                    </Text>
                    <Text py={2} fontSize="14px" color="#737373">
                      Chief Research Scientist at Landopp
                      <br />
                      Organic Chemistry PHd specialized in biopolymers for industrial purposes.
                    </Text>
                    <Flex mt={1}>
                      <IconButton
                        as="a"
                        href={"https://www.linkedin.com/in/dfort/"}
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

export default LandoppDetails;
