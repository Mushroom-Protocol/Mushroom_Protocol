"use client"

import {
  ConnectButton,
  ConnectDialog,
  useCanister,
  useConnect,
} from "@connect2ic/react"
import "@connect2ic/core/style.css"
import {
  Box,
  Flex,
  HStack,
  Text,
  IconButton,
  Image,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Input,
  useToast,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react"
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons"
import { Link as ReactRouterLink } from "react-router-dom"
import { Link as ChakraLink } from "@chakra-ui/react"
import MpFavicon from "./../assets/MpFavicon.png"
import { useState } from "react"
import React, { useContext } from "react"
import { EstadoContext } from "./utils/estadoContex"
import MenuUser from "./MenuUser"
import { UserType } from "./CommonTypes"
import { base64ToBlob, convertFileToBase64 } from "./CommonHelpers"

interface Props {
  children: React.ReactNode,
  path: string
}

const Links = ["Home", "Launchpad", "Apply"]
//const { estado, setEstado } = useContext(EstadoContext);

const initialStateFormData = {
  userName: "",
  userEmail: "",
  userAvatar: null as File | null, // Asegúrate de proporcionar un array válido aquí
}

const NavLink = (props: Props) => {
  const { children, path } = props
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={path}
    >
      {children}
    </Box>
  )
}

export default function WithSubnavigation() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure()
  const { currentUser, setCurrentUser } = useContext(EstadoContext)
  const [backend] = useCanister("backend")
  const { isConnected } = useConnect()
  const toast = useToast()
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [formData, setFormData] = useState(initialStateFormData)
  const estadoContext = useContext(EstadoContext)
  if (!estadoContext) {
    throw new Error("The component must be inside an estadoContext.")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let loadingToastId: string | number | undefined
    try {
      loadingToastId = toast({
        title: "Submitting Form",
        status: "loading", // 'loading' es el status para el estilo de carga
        duration: null,
        isClosable: false,
        variant: "solid",
      })

      const avatarParsed = formData.userAvatar
        ? base64ToBlob(await convertFileToBase64(formData.userAvatar))
        : null
      const resUser = await backend.signUp(
        formData.userName,
        formData.userEmail,
        avatarParsed ? [avatarParsed] : [],
      )
      setCurrentUser(resUser[0] as UserType)

      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      toast({
        title: "Successful Submission",
        description: "Your form was submitted successfully.",
        status: "success", // 'success' es el status para el estilo de éxito
        duration: 5000,
        isClosable: true,
        variant: "solid",
      })

      setFormData(initialStateFormData)
      onRegisterClose()
    } catch (error) {
      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      toast({
        title: "Submission Error",
        description: JSON.stringify(error),
        status: "error", // 'error' es el status para el estilo de error
        duration: 5000,
        isClosable: true,
        variant: "solid",
      })
      console.error("Error on register user:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === "userAvatar" && files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Solo toma el primer archivo, puedes ajustar según tus necesidades
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  return (
    <>
      <Box
        bg="#000000"
        borderWidth="1px"
        borderLeftColor="#000000"
        borderRightColor="#000000"
        borderBottomColor="#FFFFFFF"
        px={10}
      >
        <Flex h="70px" alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={10} alignItems={"center"}>
            <Box>
              <Image
                boxSize="60px"
                height="30%"
                src={MpFavicon}
                alt="Logo Mushhroom"
              />
            </Box>
            <HStack
              as={"nav"}
              spacing={8}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => {
                if (link === "Apply" && currentUser?.verified.Success !== true) return;
                //<Text key={link}>{link}</Text>
                return (<Box
                  px={3}
                  py={3}
                  rounded={"md"}
                  _hover={{
                    textDecoration: "none",
                    bg: "#1E1E1E",
                  }}
                  key={link}
                >
                  <ChakraLink as={ReactRouterLink} to={`/${link}`}>
                    <Text fontSize="18px" color="white">
                      {link}
                    </Text>
                  </ChakraLink>
                </Box>)
                //<NavLink key={link}><Text fontSize='2xl' as='b'>{link}</Text></NavLink>
              })}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <div id="botonConexion">
              <ConnectButton />
            </div>
            <Box ml="4px">
              {isConnected && (!currentUser || currentUser?.name === "") && (
                <Button id="botonRegisterUser" onClick={onRegisterOpen}>
                  Register User
                </Button>
              )}
              {isConnected && currentUser && currentUser?.name !== "" && (
                <MenuUser />
              )}
            </Box>

            <Modal isOpen={isRegisterOpen} onClose={onRegisterClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                  <span style={{ color: "black" }}>Register User</span>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody style={{ color: "black" }}>
                  <form onSubmit={handleSubmit}>
                    <FormControl isRequired>
                      <Input
                        placeholder="Name"
                        id="userName"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <Input
                        placeholder="E-Mail"
                        id="userEmail"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Upload Avatar</FormLabel>
                      <Input
                        id="userAvatar"
                        name="userAvatar"
                        onChange={handleChange}
                        type="file"
                        accept="image/*" // Asegura que solo se puedan seleccionar archivos de imagen
                      />
                      <FormHelperText>
                        Recommended size 200x200 px
                      </FormHelperText>
                    </FormControl>
                    <FormControl>
                      <Button type="submit" mt={4} colorScheme="teal">
                        Register
                      </Button>
                    </FormControl>
                  </form>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onRegisterClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              ></MenuButton>
              <MenuList>
                <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem>Link 3</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={40} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink path={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
        <ConnectDialog />
      </Box>
    </>
  )
}
