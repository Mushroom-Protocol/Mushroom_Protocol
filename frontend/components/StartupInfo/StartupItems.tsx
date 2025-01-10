import React, { useEffect, useState } from "react"
import RandomBigInt from 'random-bigint';
import {
  Flex,
  Image,
  Spacer,
  Center,
  Grid,
  GridItem,
  Box,
  Text,
  Button,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  HStack,
  useToast,
} from "@chakra-ui/react"
import { FaClock } from "react-icons/fa6"
import MpFavicon from "../../assets/MpFavicon.png"
import Mushroomfounders from "../../assets/Mushroomfounders.gif"
import favicon from "../../assets/favicon.ico"
import { CollectionPreInit, Startup } from "../CommonTypes"
import { useCanister } from "@connect2ic/react"

// import { CollectionActorClass } from "../../../src/declarations/backend/backend.did"
import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory as CollectionActorClass } from "../../../src/declarations/backend/backend.did"; // Assuming you have an IDL file for the canister.
import { Principal } from "@dfinity/principal";
import { IDL } from "@dfinity/candid"
import { error } from "console"

const ckUSDCIdlFactory = ({ IDL }) => {
  return IDL.Service({
      transfer: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
  });
};

interface PropsType {
  startup: Startup
}

const StartupItems: React.FC<PropsType> = ({ startup: startupFetched }) => {
  const [quantity, setQuantity] = useState(1)
  const toast = useToast()
  const [backend] = useCanister("backend")
  const [collectionRequest, setCollectionRequest] = useState<CollectionPreInit | any | null | undefined>({})
  const [maxLimit, setMaxLimit] = useState(0)
  const [projectsByStartup, setProjectsByStartup] = useState([])
  const [tiersPrices, setTiersPrices] = useState<{tierName: string, price: number}[]>([])
  const [selectedTier, setSelectedTier] = useState<string>(null)
  const [canisterId, setCanisterId] = useState<string>("")
  const [metadataNFTColl, setMetadataNFTColl] = useState<any>({})

  let null_address: string = "aaaaa-aa"

  useEffect(() => {
    const getProjectsByStartup = async (currentStartup: string) => {
      try {
        const resProjectsByStartup: string[] | null | undefined =
          (await backend.getProjectsByStartup(currentStartup)) as
            | string[]
            | null
            | undefined
        // setProjectsByStartup(resProjectsByStartup)
        return resProjectsByStartup
      } catch (error) {
        console.error("Error on backend.getProjectsByStartup() call:", error)
      }
    }

    const callGetPrices = async (projectID: string) => {
      try {
        const resCallGetPrices: {tierName: string, price: number}[] | null | undefined =
          (await backend.getPrices(projectID)) as
            | {tierName: string, price: number}[]
            | null
            | undefined
        return resCallGetPrices
      } catch (error) {
        console.error("Error on backend.getPrices() call:", error)
      }
    }

    const getCanisterIdByProject = async (projectID: string): Promise<any> => {
      try {
        const resCanisterId: string | null | undefined =
          (await backend.getCanisterIdByProject(projectID)) as string | null | undefined
        return resCanisterId
      } catch (error) {
        console.error("Error on backend.getCanisterIdByProject() call:", error)
      }
    }

    const getCollectionRequestByStartUp = async (startupId: string): Promise<CollectionPreInit | any | null | undefined> => {
      try {
        const resGetCollectionRequestByStartUp: CollectionPreInit | any | null | undefined = (await backend.getCollectionRequestByStartUp(startupId)) as CollectionPreInit | any | null | undefined
        setCollectionRequest(resGetCollectionRequestByStartUp[0])
        return resGetCollectionRequestByStartUp[0]
      }
      catch(error) {
        console.error("Error on backend.getCollectionRequestByStartUp() call:", error)
      }
    }

    // getProjectsByStartup(startupFetched.startupId)
    //   .then((dataProjectsByStartup) => {
    //     setProjectsByStartup(dataProjectsByStartup)
    //     return getCanisterIdByProject(dataProjectsByStartup[0][0])
    //       .then((resCanisterIdByProject) => {
    //         return backend.getTotalSupply(resCanisterIdByProject).then(resTotalSupply => {
    //           const numTotalSupply = Number(resTotalSupply)
    //           setTotalSupply(numTotalSupply)
    //           return numTotalSupply
    //         }).catch(error => console.error(error))
    //       })
    //       .catch((error) => console.error(error))
    //   })
    //   .catch((error) => console.error(error))

    getProjectsByStartup(startupFetched.startupId)
      .then((dataProjectsByStartup) => {
        setProjectsByStartup(dataProjectsByStartup)
        return Promise.all([getCanisterIdByProject(dataProjectsByStartup[0][0]), callGetPrices(dataProjectsByStartup[0][0])]).then(([resCanisterIdByProject, resCallGetPrices]) => {
          setCanisterId(resCanisterIdByProject)
          setTiersPrices(resCallGetPrices)
          return backend.getMetadataNFTColl(dataProjectsByStartup[0][0]).then(resMetadataNFTColl => {
            setMetadataNFTColl(resMetadataNFTColl)
            return resMetadataNFTColl
          }).catch(error => console.error(error))
        }).catch(error => console.error(error))
      })
      .catch((error) => console.error(error))

    getCollectionRequestByStartUp(startupFetched.startupId).then(dataCollectionRequestByStartUp => {
      return dataCollectionRequestByStartUp
    }).catch(error => console.error(error))
  }, [])

  const handleSubmitMint =
    async (/*event: React.FormEvent<HTMLFormElement>*/) => {
      // event.preventDefault()
      let loadingToastId
      let transferStatus
      let resMintNFT
      
      const tier = tiersPrices.find(x => x.tierName === selectedTier)
      if (tier === undefined) {
        console.log("Error TierName") 
        return 
      }
      console.log({tier})

      const params = {
        to: metadataNFTColl.wallet,
        amount: tier.price,
        memo: "123456789"
      }
      console.log({params})

      try {
        const e = await window.ic.plug.requestConnect()
        console.log({e})

        if (await window.ic.plug.isConnected()) {
          try {
            transferStatus = await window.ic.plug.requestTransfer(params)
            console.log({transferStatus})
          } catch (transferError) {
            console.error("Error en la transferencia:", transferError)
            transferStatus = undefined
          }
        }
      } catch (connectError) {
        console.error("Error al conectar a Plug Wallet:", connectError)
        window.open("https://plugwallet.ooo/", "_blank")
        return // Termina la función si hay un error de conexión
      }

      if (transferStatus === undefined) {
        toast({
          title: "Transaction Rejected",
          description: "The transaction was rejected. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          variant: "solid",
        })
        return // Termina la función si la transferencia falló
      }

      try {
        loadingToastId = toast({
          title: "Submitting Form",
          status: "loading",
          duration: null,
          isClosable: false,
          variant: "solid",
        })

        const dataTransaction = {...params, height: transferStatus.height.height, from: window.ic.plug.accountId}
        console.log(dataTransaction)
        resMintNFT = (await backend.mintNFT(projectsByStartup[0][0], selectedTier, dataTransaction)) as {
          Ok: any
          Err: String
        }
        console.log({resMintNFT})

        if (loadingToastId !== undefined) {
          toast.close(loadingToastId)
        }

        if (resMintNFT.Err !== undefined) {
          toast({
            title: "Minting Error",
            description: JSON.stringify(resMintNFT?.Err),
            status: "error",
            duration: 5000,
            isClosable: true,
            variant: "solid",
          })
        } else {
          toast({
            title: "Successful Submission",
            description: "Token ID: " + String(resMintNFT?.Ok.token_id),
            status: "success",
            duration: 5000,
            isClosable: true,
            variant: "solid",
          })
        }

        onClose()
      } catch (error) {
        if (loadingToastId !== undefined) {
          toast.close(loadingToastId)
        }

        toast({
          title: "Submission Error",
          description:
            "There was an error submitting the form. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          variant: "solid",
        })
        console.error("Error on backend.mintNFT() call:", error)
      }
    }

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1)
    }
  }

  const handleSelectTier = async (tierName: string) => {
    setSelectedTier(tierName)
    return 0
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Center>
      <Grid
        templateAreas={`"header header"
                      "nav main"
                      "nav footer"`}
        gridTemplateRows={"120px 1fr 30px"}
        gridTemplateColumns={"450px 1fr"}
        h="530px"
        w="1024px"
        gap="0"
        color="#000"
        fontWeight="bold"
        marginRight="30px"
      >
        <GridItem
          pl="20"
          marginTop="15px"
          area="header"
          display="flex"
          alignItems="center"
        >
          <Flex>
            <Box
              bgImage={MpFavicon}
              bgSize="60px 60px"
              bgRepeat="no-repeat"
              w="60px"
              h="60px"
              marginTop="10px"
            />
            <Box
              ml="4"
              marginBottom="0"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Text fontSize="19px" color="#FFFFFF">
                {startupFetched?.startUpName}
              </Text>
              <Tag
                variant="subtle"
                backgroundColor="#000000"
                color="#FFFFFF"
                borderColor="#1FAFC8"
                borderWidth="1px"
                fontSize="12px"
                mr="20"
              >
                Total Items: {String(metadataNFTColl?.maxLimit)}
              </Tag>
            </Box>
            <Spacer />
            <HStack spacing={4}>
              {["lg"].map((size) => (
                <Tag
                  // size="lg" // Tamaño del tag (puedes ajustarlo según tus necesidades)
                  size={size} // Tamaño del tag (puedes ajustarlo según tus necesidades)
                  key={size} // Tamaño del tag (puedes ajustarlo según tus necesidades)
                  variant="subtle"
                  colorScheme="orange" // Cambia a naranja
                  backgroundColor="#000000"
                  color="#FFFFFF"
                  borderColor="#FFFFFFF"
                  textColor="#FFFFFF"
                  borderWidth="1px"
                  ml="530px"
                  fontSize="16px"
                  display="flex"
                  alignItems="center" // Alinea el icono y el texto verticalmente
                >
                  <FaClock color="#F47629" style={{ marginRight: "9px" }} />{" "}
                  {/* Cambia el color del icono a naranja */}
                  <TagLabel>Coming Soon</TagLabel>
                </Tag>
              ))}
            </HStack>
          </Flex>
        </GridItem>
        <GridItem
          area="nav"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src={Mushroomfounders}
            alt="Descripción de la imagen"
            objectFit="cover"
            width="300px" // Ajusta el ancho según tus necesidades
            height="400px" // Ajusta la altura según tus necesidades
          />
        </GridItem>
        <GridItem
          bg="#000000"
          area="main"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          border="1px"
          borderColor="#1FAFC8"
          mt="25px"
          borderRadius="10px"
          padding="30px"
        >
          <Box display="flex" alignItems="flex-start">
            {tiersPrices.map(tierPrice => {
              return <Box
                backgroundColor="#000000"
                color="#FFFFFF"
                fontSize="18px"
                display="flex"
                alignItems="center"
                p="8px"
                borderRadius="15px"
                border="1px"
                onClick={() => handleSelectTier(tierPrice.tierName)}
                borderColor="#1FAFC8"
              >
                Price {tierPrice.tierName}: {Number(tierPrice.price)/1000000000}
                <img
                  src={favicon}
                  alt="Icon"
                  width="22"
                  height="22"
                  style={{ marginLeft: "5px" }}
                />
              </Box>
            })}
          </Box>
          <Flex fontSize='xl' gap={2} mt={4}>
            <Text color='gray.300'>Selected Tier price:</Text><Text color='green.300'>{selectedTier}</Text>
          </Flex>
          <Box
            backgroundColor="#1E1E1E"
            height="30px"
            width="500px"
            borderRadius="5px"
            marginTop="30px"
            position="relative"
          >
            <Box
              backgroundColor="#1FAFC8"
              height="100%"
              width="1%" // Ajusta el ancho según el progreso real
              borderRadius="15px"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Text fontSize="18px" color="#FFFFFF" marginLeft="5px">
                0%
              </Text>
            </Box>
          </Box>
          <Text fontSize="16px" color="#737373" marginTop="10px">
            Minted: 0 / {String(metadataNFTColl?.maxLimit)}
          </Text>
          <Box display="flex" alignItems="center" marginTop="20px">
            <Button size="sm" marginRight="10px" onClick={handleDecrease}>
              -
            </Button>
            <Text fontSize="15px" color="#FFFFFF">
              {quantity}
            </Text>
            <Button size="sm" marginLeft="10px" onClick={handleIncrease}>
              +
            </Button>
            <Button
              backgroundColor="#1FAFC8"
              textColor="#000000"
              variant="solid"
              ml="10px"
              borderRadius="10px"
              onClick={onOpen} // Abre modal de confirmación de minted
              _hover={{
                backgroundColor: "#f9f9f9",
                textColor: "#000000",
              }}
            >
              Mint
            </Button>
          </Box>
          <Text
            fontSize="14px"
            color="#737373"
            fontStyle="italic"
            mr="20"
            marginTop="40px"
          >
            * At the time of minted you are exchanging your crypto assets for a
            random NFT within the NFTs pool.
          </Text>
        </GridItem>

        <Modal isOpen={isOpen} onClose={onClose} size="md">
          {/* Agregar el estilo para el ModalOverlay */}
          <ModalOverlay style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} />

          {/* Agregar estilo para centrar el ModalContent */}
          <ModalContent
            backgroundColor="#1E1E1E"
            position="absolute"
            top="30%"
            left="40%"
            transform="translate(-50%, -50%)"
          >
            <ModalHeader>Do you confirm the minting?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>If you confirm the transaction, the NFT(s) will be minted to your wallet address.</p>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="teal"
                backgroundColor="#1FAFC8"
                variant="solid"
                borderRadius="10px"
                onClick={handleSubmitMint}
              >
                Approve
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Grid>
    </Center>
  )
}

export default StartupItems
