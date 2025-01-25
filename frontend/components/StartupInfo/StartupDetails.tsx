import React, { useEffect, useState } from "react"
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
  Link as ChakraLink,
  Image
} from "@chakra-ui/react"
import { Link } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { useCanister } from "@connect2ic/react"
import { blobToBase64 } from "../CommonHelpers"

const StartupDetails = ({ project: project }) => {
  const [backend] = useCanister("backend")
  const [startup, setStartup] = useState<any>(null)
  const [canisterId, setCanisterId] = useState<string>(null)
  const [totalSupply, setTotalSupply] = useState<number>(0)
  const [baseUrlCanister, setBaseUrlCanister] = useState<string>(null)

  useEffect(() => {
    const getStartUpByID = async (startupId: string) => {
      try {
        const resGetStartUpByID: any[] | null | undefined =
          (await backend.getStartUpByID(startupId)) as
            | any[]
            | null
            | undefined
        setStartup(resGetStartUpByID[0])
        return resGetStartUpByID[0]
      } catch (error) {
        console.error("Error on backend.getStartUpByID() call:", error)
      }
    }

    const getCanisterIdByProject = async (projectID: string): Promise<any> => {
      try {
        const resCanisterId: string | null | undefined =
          (await backend.getCanisterIdByProject(projectID)) as string | null | undefined
        setCanisterId(resCanisterId)
        return resCanisterId
      } catch (error) {
        console.error("Error on backend.getCanisterIdByProject() call:", error)
      }
    }

      getStartUpByID(project.startupID).then(dataStartUpByID => {
        setStartup(dataStartUpByID)
      }).catch(error => console.error(error))

      getCanisterIdByProject(project.projectID)
        .then((resCanisterIdByProject) => {
          return backend.getBaseUrl(resCanisterIdByProject).then((resBaseUrl: string) => {
            setBaseUrlCanister(resBaseUrl)
            return resBaseUrl
          }).catch(error => console.error(error))
        })
        .catch((error) => console.error(error))
  }, [])

  return (
    <Center>
      <Grid
        templateColumns="40% 60%"
        templateRows="1fr"
        // h="780px"
        w="1024px"
        color="#FFFFFF"
        p="25px"
        overflow="auto"
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
              src={"data:image/png;base64," + blobToBase64(startup?.logo)}
              alt="Mushroom Protocol Logo"
              width="50px"
              height="50px"
            />
            <Box ml="10px">
              <Text fontSize="18px">{startup?.startUpName}</Text>
              <Text fontSize="12px" color="#737373" fontStyle="italic">
                {startup?.startUpSlogan}
              </Text>
            </Box>
          </Box>
          <Text fontSize="18px" textAlign="justify">
            Startup Details
            <br />
          </Text>
          <Text fontSize="15px" color="#737373" textAlign="justify">
            <br />
            {startup?.shortDes}
            <br />
            <br />
            <p><b>Industry:</b> {startup?.industry}</p>
            <p><b>Country:</b> {startup?.country}</p>
            <p><b>Startup status:</b> {startup?.startupStatus}</p>
            <p>
              <b>Website: </b><ChakraLink href={startup?.baseUrl} isExternal>
                {startup?.website} <ExternalLinkIcon mx="2px" />
              </ChakraLink>
            </p>
            <p>
              <b>Team leader: </b><ChakraLink href={startup?.linkedinTL} isExternal>
                {startup?.fullNameTl} <ExternalLinkIcon mx="2px" />
              </ChakraLink>
            </p>
          </Text>
        </GridItem>
        <GridItem>
          <Tabs color="#737373" size="md" ml="20" mr="0">
            <TabList>
              <Tab>Collection</Tab>
              <Tab>Project</Tab>
              <Tab>Story</Tab>
              <Tab>Tokenomics</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {/* Contenido para la pestaña "Collection" */}
                <>
                  <Text fontSize="12px" color="#737373" textAlign="justify">
                    NoPlas is an innovative initiative by Landopp, designed to fund environmental research and develop revolutionary sustainable solutions, such as bioplastic based on the hemp plant. This is the first tokenized biotech IP in Latin America in history, marking a historic milestone for decentralized science (DeSci) and the development of Real World Assets (RWA).
                    <br />
                    <br />
                    <span style={{fontSize: "15px", color: "#FFFFFF"}}>
                      Utilities
                    </span>
                    <br />
                    <br />
                    <span style={{fontSize: "12px", color: "#FFFFFF"}}>
                      IP-NFT:
                    </span>
                    <br />
                    The NFT accredits part of the ownership of the intellectual and commercialization rights of the technologies developed with the funds.
                    <br />
                    <br />
                    <span style={{fontSize: "12px", color: "#FFFFFF"}}>
                      AIRDROPS:
                    </span>
                    <br />
                    NFT holders will receive exclusive Fungi token airdrops as a reward for supporting the successful completion of the Landopp project.
                    <br />
                    <br />
                    <span style={{fontSize: "12px", color: "#FFFFFF"}}>
                      GOVERNANCE:
                    </span>
                    <br />
                    Each NFT holder has the power to vote and oversee the development of research and project progress on the FungiDAO.
                    <br />
                    <br />
                    <span style={{fontSize: "12px", color: "#FFFFFF"}}>
                      DEFI:
                    </span>
                    <br />
                    The NFT becomes a valuable asset that can be used in various DeFi services within the future Mushroom Protocol platform.
                  </Text>
                </>
              </TabPanel>
              <TabPanel>
                {/* Contenido para la pestaña "Tokenomics" */}
                <>
                  <Text fontSize="16px" color="#737373" textAlign="justify">
                    {project.yoursolution}
                    <br />
                    <br />
                    <b>Product status:</b> {project.productStatus}
                    <br />
                    <br />
                    <b>Funds required:</b> {project.fundsRequired}
                    <br />
                    <br />
                    <b>Project duration:</b> {project.projectDuration}
                    <br />
                    <br />
                    <b>Milestones:</b> {project.milestones}
                  </Text>
                </>
              </TabPanel>
              <TabPanel>
                <>
                  The «NoPlas» NFT collection features 650 organic gems, discovered on the planet Nurius. These gems can fuse with elements, regenerate matter, and expand consciousness. 
                  <br /><br />
                  These mysterious gems are more than just beautiful objects—they are symbols of the future. Sourced from sacred plants, these gems can fuse with elements, regenerate, and create strong, flexible matter in harmony with nature. With them, you will be able to invest directly in biotechnology, meet with the Landopp team and participate in its community.
                </>
              </TabPanel>
              <TabPanel>
                <>
                  The NoPlas collection allocates tokens as follows: 70% goes to the Public Sale, funding the development of 455 NFTs. Inventors, the team behind Landopp, receive 15.1% of the tokens. An 8% reserve fund supports the Mushroom Protocol treasury, ensuring long-term stability. Finally, 6.9% of tokens are set aside for Airdrops.
                  <br /><br />
                  NFTs are available in three tiers: Level 1 offers basic access, Level 2 provides enhanced benefits, and Level 3 delivers premium rewards, each reflecting different levels of support and involvement.
                  <br />
                  <Center>
                    <Image src="https://mushroomprotocol.io/wp-content/uploads/2024/08/LandoppTokenomics.png" alt="Tokenomics" w="300px" h="300px" borderRadius="10px" />
                  </Center>
                </>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </Center>
  )
}

export default StartupDetails
