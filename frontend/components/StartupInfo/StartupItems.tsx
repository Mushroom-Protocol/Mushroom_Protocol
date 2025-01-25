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
import { Project } from "../CommonTypes"
import { useCanister } from "@connect2ic/react"
import Landoppnft01 from "../../assets/Landoppnft01.mp4";

const ckUSDCIdlFactory = ({ IDL }) => {
  return IDL.Service({
      transfer: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
  });
};

interface PropsType {
  project: Project
}

const StartupItems: React.FC<PropsType> = ({ project: project }) => {
  const [quantity, setQuantity] = useState(1)
  const toast = useToast()
  const [backend] = useCanister("backend")
  const [tiersPrices, setTiersPrices] = useState<{tierName: string, price: number}[]>([])
  const [selectedTier, setSelectedTier] = useState<string>(null)
  const [canisterId, setCanisterId] = useState<string>("")
  const [metadataNFTColl, setMetadataNFTColl] = useState<any>({})
  const [alreadyLoaded, setAlreadyLoaded] = useState<boolean>(false)

  let null_address: string = "aaaaa-aa"

  useEffect(() => {
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

    Promise.all([getCanisterIdByProject(project.projectID), callGetPrices(project.projectID), backend.getMetadataNFTColl(project.projectID)]).then(([resCanisterIdByProject, resCallGetPrices, resMetadataNFTColl]) => {
      setCanisterId(resCanisterIdByProject)
      setTiersPrices(resCallGetPrices)
      setMetadataNFTColl(resMetadataNFTColl[0])
      setAlreadyLoaded(true)
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
        amount: Number(tier.price),
        memo: 1234
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
        resMintNFT = (await backend.mintNFT(project.projectID, selectedTier, dataTransaction)) as {
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
        // h="530px"
        w="1024px"
        gap="0"
        color="#000"
        fontWeight="bold"
        marginRight="30px"
        overflow="auto"
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
              bgImage="https://mushroomprotocol.io/wp-content/uploads/2024/09/Logo-NoPlas-blanco.png"
              bgSize="100px 100px"
              bgRepeat="no-repeat"
              w="100px"
              h="100px"
              marginTop="0px"
            />
            <Box
              ml="4"
              marginBottom="0"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Text fontSize="19px" color="#FFFFFF">
                {project.projectTitle}
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
              {["lg"].map((size, idx) => (
                <Tag
                  // size="lg" // Tamaño del tag (puedes ajustarlo según tus necesidades)
                  size={size} // Tamaño del tag (puedes ajustarlo según tus necesidades)
                  key={idx} // Tamaño del tag (puedes ajustarlo según tus necesidades)
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
                  <FaClock color="#00FF00" style={{ marginRight: "9px" }} />{" "}
                  {/* Cambia el color del icono a naranja */}
                  <TagLabel>{metadataNFTColl?.totalSupply > 0 ? "Active" : "Closed"}</TagLabel>
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
          <video
            src={Landoppnft01} // Utilizando imgSrc para el video
            autoPlay
            loop
            muted
            playsInline
            style={{
              borderRadius: "10px",
              objectFit: "cover",
              width: "350px",
              height: "400px",
            }}
          />
          {/* <Image
            src={Landoppnft01}
            alt="Descripción de la imagen"
            objectFit="cover"
            width="300px" // Ajusta el ancho según tus necesidades
            height="400px" // Ajusta la altura según tus necesidades
          /> */}
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
          <Box display="flex" alignItems="center" gap={4}>
            {tiersPrices.map((tierPrice, idx) => {
              return <Box
                key={idx}
                backgroundColor="#000000"
                color="#FFFFFF"
                fontSize="18px"
                // display="flex"
                alignItems="center"
                p="8px"
                borderRadius="15px"
                border="1px"
                onClick={() => handleSelectTier(tierPrice.tierName)}
                borderColor="#1FAFC8"
              >
                <p>Price1 {tierPrice.tierName}:</p>
                <div style={{display: "flex"}}>
                  {Number(tierPrice.price)/1000000000} ICP
                  <img
                    src={favicon}
                    alt="Icon"
                    width="22"
                    height="22"
                    style={{ marginLeft: "5px" }}
                  />
                </div>
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
              isDisabled={!alreadyLoaded}
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
