import React, { useState } from "react"
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
import { useCanister } from "@connect2ic/react"
import faviconico from "../../assets/Faviconico.png";
import Mushroomfounders from "../../assets/Mushroomfounders.gif"
import favicon from "../../assets/favicon.ico"

const FoundersItems = () => {
  const [quantity, setQuantity] = useState(1)
  const [backend] = useCanister("backend")

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

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const handleSubmitMint = async (/*event: React.FormEvent<HTMLFormElement>*/) => {
    // event.preventDefault()
    let loadingToastId: string | number | undefined

    try {
      loadingToastId = toast({
        title: "Submitting Form",
        status: "loading", // 'loading' es el status para el estilo de carga
        duration: null,
        isClosable: false,
        variant: "solid",
      })
      const resMintNFT: any = (await backend.mintNFT(
        "PR182655",
      )) as any

      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      toast({
        title: "Successful Submission",
        description: JSON.stringify(resMintNFT),
        status: "success", // 'success' es el status para el estilo de éxito
        duration: 5000,
        isClosable: true,
        variant: "solid",
      })

      onClose()
    } catch (error) {
      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      toast({
        title: "Submission Error",
        description:
          "There was an error submitting the form. Please try again.",
        status: "error", // 'error' es el status para el estilo de error
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
              bgImage={faviconico}
              bgSize="60px 60px"
              bgRepeat="no-repeat"
              w="60px"
              h="60px"
              marginTop="0px"
            />
            <Box ml="4" display="flex" flexDirection="column">
              <Text fontSize="19px" color="#FFFFFF">
                Mushroom Founders
              </Text>
              <Tag
                variant="subtle"
                backgroundColor="#000000"
                color="#FFFFFF"
                borderWidth="1px"
                fontSize="14px"
                mt="2"
              >
                Total Items: 444
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
              <FaClock color="#64B344" style={{ marginRight: "9px" }} />
              <TagLabel>Active</TagLabel>
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
            src={Mushroomfounders}
            alt="Descripción de la imagen"
            borderRadius="10px"
            objectFit="cover"
            width="400px" // Ajusta el ancho según tus necesidades
            height="500px" // Ajusta la altura según tus necesidades
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
          maxWidth={{ base: "100%", md: "800px" }} // Ajuste de ancho máximo responsivo
          width="100%" // Ajuste de ancho al 100% para ocupar el espacio disponible
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
              Price: 1
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
            width="100%" // Ajuste el ancho al 100% para que se expanda correctamente
            maxWidth="400px" // Establecer un ancho máximo para evitar que se extienda demasiado en pantallas grandes
            borderRadius="5px"
            marginTop="30px"
            position="relative"
          >
            <Box
              backgroundColor="#1FAFC8"
              height="100%"
              width="10%" // Ajusta el ancho según el progreso real
              borderRadius="15px"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
            >
            </Box>
          </Box>
          <Text fontSize="16px" color="#737373" marginTop="10px">
            Minted: 7 / 444
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
                backgroundColor: "#1FAFC8", // Mantener el mismo color de fondo
                textColor: "#000000", // Mantener el mismo color de texto
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
            Closing date: August 12, 2024
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
            <ModalHeader>Confirm transaction</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Contenido del modal */}
              <p>If you confirm the transaction, an NFTs will be minted to your wallet address.</p>
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

export default FoundersItems
