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
import ReciqloLogo from "../../assets/ReciqloLogo.jpg";
import GustavoReciqlo from "../../assets/GustavoReciqlo.jpg";
import TeamReciqlo from "../../assets/TeamReciqlo.jpg";
import { useCanister } from "@connect2ic/react";

const ReciqloDetails = () => {
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
            <Image src={ReciqloLogo} alt="Reciqlo Logo" w="50px" h="50px" borderRadius="10px"  />
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
            Founded in Argentina, Reciqlo promotes a sustainable circular economy through innovative recycling systems. They incentivize recycling with blockchain traceability to boost rates and cut greenhouse gases, water use, and resource extraction. Reciqlo innovates by creating a soil improver from Silicon in recycled glass. This enhances soil, retains water and air, and strengthens plants against drought, cold, and salinity. It also aids nutrient absorption and limits heavy metal uptake, promoting robust crops. Reciqlo's solutions support communities, organizations, and global environmental conservation efforts.
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
                The NFT collection "Reciqlo: Silkongs" harnesses the healing power of silicon to revolutionize planetary regeneration across cosmic travels. This innovative initiative uses dynamic NFT technology to fund research and develop groundbreaking environmental solutions.
                <br />
                <br />
                These celestial gorillas are equipped with the transformative ability to rejuvenate planets, utilizing silicon's potent properties. Each Silkong in this collection represents a unique NFT, inviting enthusiasts to support the mission and actively shape the future of planetary health and sustainability.
                <br /><br />
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
                  Stage 1: Validate product for use in extensive agroindustry.
                  <br />
                  Stage 2: On-chain system traceability.
                  <br />
                  <br />
                  <Text fontSize="18px" color="#FFFFFF">
                    2025
                  </Text>
                  <br />
                  Stage 3: Launch of the Reciqlo native token.
                  <br />
                  Stage 4: Acuerdo comercial o productivo para el producto Silkong.
                  <br />
                  <br />
                  <Text fontSize="18px" color="#FFFFFF">
                    MILESTONES AND INDICATORS
                  </Text>
                  <br />
                  1. Validate all on-chain traceability.
                  <br />
                  2. Generate 1,000 transactions per month with the Reciqlo native token.
                  <br />
                  3. Close research, promotion and commercial agreements with a major agribusiness player (Grobocopatel, Grupo Don Mario, Syngenta, etc.).
                  <br /><br/>
                  <Text fontSize="18px" color="#FFFFFF">
                    DURATION:
                  </Text>
                  <br />
                  18 Months
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
                    src={GustavoReciqlo}
                    alt="Profile"
                  />
                  <Box ml={9}>
                    <Text fontSize="18px" textColor="#FFFFFF">
                    Gustavo Chopitea
                    </Text>
                    <Text py={2} fontSize="14px" color="#737373">
                    Co-founder
                      <br />
                      Strategy and business

                    </Text>
                    <Flex mt={1}>
                      <IconButton
                        as="a"
                        href={"https://www.linkedin.com/in/gustavo-e-chopitea-mq-09213b228/"}
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
                    src={TeamReciqlo}
                    alt="Profile"
                  />
                  <Box ml={9}>
                    <Text fontSize="18px" textColor="#FFFFFF">
                    Carolina Duque
                    </Text>
                    <Text py={2} fontSize="14px" color="#737373">
                    Co-founder y proyect leader
                      <br />
                      Technology and product
                    </Text>
                    <Flex mt={1}>
                      <IconButton
                        as="a"
                        href={"https://www.linkedin.com/in/carolinaduquec/"}
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

export default ReciqloDetails;
