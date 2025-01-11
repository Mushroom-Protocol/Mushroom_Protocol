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
} from "@chakra-ui/react"
import { Link } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { useCanister } from "@connect2ic/react"

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

      getCanisterIdByProject(project.projectId)
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
            The protocol allows investors from around the world to fund science
            through a system of tokenization of biotechnology-based research,
            using intellectual property as collateral. Users can access
            BioTokens (Dynamic NFTs), generated from the intellectual property
            value of the research by exchanging their cryptoassets for NFTs and
            use them to fund, exchange, vote or win in our decentralized funding
            ecosystem.
          </Text>
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
                <>
                  <Text fontSize="12px" color="#737373" textAlign="justify">
                    Mushroom Founders is a collection of 500 NFTs, unique
                    digital collectibles living on the Internet Computer
                    blockchain. Your Mushroom Founders acts as your access card
                    to Mushroom Protocol. The funds obtained from the sale of
                    the collection will allow us to develop our protocol and
                    finance the innovation of Latam scientists. As the
                    collection is sold, various functions related to the
                    usefulness of the NFT, Staking and FungiDAO will be
                    activated.
                    <br />
                    <br />
                    Become a founder of Mushroom Protocol with your NFT and help
                    us revolutionize biotech development
                    <br />
                    <br />
                    <span style={{fontSize: "15px", color: "#FFFFFF"}}>
                      Utilities
                    </span>
                    <br />
                    <br />
                    <span style={{fontSize: "12px", color: "#FFFFFF"}}>
                      AIRDROPS:
                    </span>
                    <br />
                    You will receive 25 $FUNGI tokens before listing on the
                    market. and IP-NFTs of the first research batch.
                    <br />
                    <br />
                    <span style={{fontSize: "12px", color: "#FFFFFF"}}>
                      IP-NFT:
                    </span>
                    <br />
                    Stake Mushroom Founders NFT and get $FUNGI token rewards.
                    <br />
                    <br />
                    <span style={{fontSize: "12px", color: "#FFFFFF"}}>
                      MEMBERSHIP:
                    </span>
                    <br />
                    Early access to the Mushroom Protocol DeFi services and
                    Metaverse.
                    <br />
                    <br />
                    <span style={{fontSize: "12px", color: "#FFFFFF"}}>
                      GOVERNANCE:
                    </span>
                    <br />
                    Vote and monitor the development of project progress on the
                    FungiDAO.
                  </Text>
                </>
              </TabPanel>
              <TabPanel>
                {/* Contenido para la pestaña "Tokenomics" */}
                <>
                  <Text fontSize="16px" color="#737373" textAlign="justify">
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
                    preferential price. Then another 250 will be available on
                    Founded. <br />
                    <br />
                    25 Founders are excluded from the sale. These will be used
                    for giveaways, rewards, and creator memberships.
                  </Text>
                </>
              </TabPanel>
              <TabPanel>
                {/* Contenido para la pestaña "R&D Project" */}
                <>
                  {" "}
                  <Text fontSize="16px" color="#737373" textAlign="justify">
                    «Mushroom Founders» NFT collection tells the story of 500
                    extraterrestrial mushrooms, who managed to escape the
                    technological cataclysm that devastated their home 10 eons
                    ago.
                    <br />
                    <br />
                    Each NFT possesses a unique specialty, which is vital in
                    their mission to spread knowledge and guide civilizations of
                    the universe to a path of balance and harmony as a form of
                    redemption. <br />
                    <br />
                    As they travel the universe in their ships, they become the
                    disseminators of transcendental knowledge.
                  </Text>
                </>
              </TabPanel>
              <TabPanel>
                {/* Contenido para la pestaña "Team" */}
                <>
                  {" "}
                  <Link href={baseUrlCanister} isExternal>
                    Collection Website <ExternalLinkIcon mx="2px" />
                  </Link>
                  <br />
                  <br />
                  <Link href="https://mushroomprotocol.io/" isExternal>
                    Protocol Website <ExternalLinkIcon mx="2px" />
                  </Link>
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
