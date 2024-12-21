import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { FaClock } from "react-icons/fa6";
import ReciqloLogo from "../../assets/ReciqloLogo.jpg";
import SilkongV1 from "../../assets/SilkongV1.jpg";
import favicon from "../../assets/favicon.ico";
import { useCanister } from "@connect2ic/react";

const ReciqloItems = () => {
  const [quantity, setQuantity] = useState(1)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [backend] = useCanister("backend")
  const [selectedTier, setSelectedTier] = useState<string>(null)

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  const handleIncrease = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  }

  const handleSelectTier = async (tierName: string) => {
    setSelectedTier(tierName)
    return 0
  }

  const handleSubmitMint = async () => {
    let loadingToastId
    let transferStatus
    let resMintNFT

    const params = {
      to: "827d788022a863123db4294da0e5d07eb308dd5913860fb0308715dd8fbfd682",
      amount: 200000000,
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
      resMintNFT = (await backend.mintNFT("12345", selectedTier, dataTransaction)) as {
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
          description: resMintNFT.Err,
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

  return (
    <Center>
      <Grid
        templateAreas={`"header header"
                      "nav main"
                      "nav footer"`}
        gridTemplateRows={"120px 1fr 30px"}
        gridTemplateColumns={"600px 1fr"}
        maxWidth="100%"
        width="100%"
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
          justifyContent="space-between"
        >
          <Flex alignItems="center">
            <Box
              bgImage={ReciqloLogo}
              bgSize="60px 60px"
              bgRepeat="no-repeat"
              borderRadius="10px"
              w="60px"
              h="60px"
              marginTop="0px"
            />
            <Box ml="4" display="flex" flexDirection="column">
              <Text fontSize="19px" color="#FFFFFF">
                Silkongs
              </Text>
              <Tag
                variant="subtle"
                backgroundColor="#000000"
                color="#FFFFFF"
                borderWidth="1px"
                fontSize="14px"
                mt="2"
              >
                Total Items: -
              </Tag>
            </Box>
          </Flex>
          <HStack spacing={4} alignItems="center" display={{ base: "none", md: "flex" }}>
            <Tag
              size="lg"
              variant="subtle"
              colorScheme="orange"
              fontSize="20px"
              backgroundColor="#000000"
              color="#FFFFFF"
              borderWidth="1px"
            >
              <FaClock color="orange" style={{ marginRight: "9px" }} />
              <TagLabel>Coming Soon</TagLabel>
            </Tag>
          </HStack>
        </GridItem>
        <GridItem
          area="nav"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src={SilkongV1}
            alt="Descripción de la imagen"
            borderRadius="10px"
            objectFit="cover"
            width="400px"
            height="500px"
          />
        </GridItem>
        <GridItem
          bg="#000000"
          area="main"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          borderColor="#1FAFC8"
          mt="25px"
          borderRadius="10px"
          padding="20px"
          maxWidth={{ base: "100%", md: "800px" }}
          width="100%"
        >
          <Box display="flex" alignItems="flex-start">
            <Box
              backgroundColor="#000000"
              color="#FFFFFF"
              fontSize="18px"
              display="flex"
              alignItems="center"
              p="8px"
              borderRadius="15px"
              border="1px"
              borderColor="#1FAFC8"
            >
              Price: 
              <img
                src={favicon}
                alt="Icon"
                width="22"
                height="22"
                style={{ marginLeft: "5px" }}
              />
            </Box>
          </Box>
          <Box
            backgroundColor="#1E1E1E"
            height="30px"
            width="100%"
            maxWidth="400px"
            borderRadius="5px"
            marginTop="30px"
            position="relative"
          >
            <Box
              backgroundColor="#1FAFC8"
              height="100%"
              width="10%"
              borderRadius="15px"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
            ></Box>
          </Box>
          <Text fontSize="16px" color="#737373" marginTop="10px">
            Minted: 0 / 0
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
              onClick={onOpen}
              _hover={{
                backgroundColor: "#f9f9f9",
                textColor: "#000000",
              }}
            >
              Mint
            </Button>
          </Box>
          <Text
            fontSize="16px"
            color="#737373"
            fontStyle="italic"
            mr="20"
            marginTop="40px"
          >
            * At the time of minted you are exchanging your crypto assets for a
            random NFT within the NFTs pool.
          </Text>
          <Text
            fontSize="22px"
            color="#FFFFFF"
            mr="20"
            marginTop="50px"
          >
            Starting date: September 31, 2024
          </Text>
        </GridItem>

        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} />
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
                onClick={() => handleSubmitMint()}
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

export default ReciqloItems
