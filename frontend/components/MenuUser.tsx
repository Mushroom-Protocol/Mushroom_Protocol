"use client"

import { useCanister, useConnect } from "@connect2ic/react"
import "@connect2ic/core/style.css"
import {
  Box,
  HStack,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
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
  Avatar,
  VStack,
  Image,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import React, { useContext } from "react"
import { EstadoContext } from "./utils/estadoContex"
import { FiChevronDown } from "react-icons/fi"
import { initialStateUser } from "./CommonTypes"
import { blobToBase64, getUserRoles } from "./CommonHelpers"

export default function MenuUser() {
  const { onClose } = useDisclosure()
  const {
    isOpen: isVerifyOpen,
    onOpen: onVerifyOpen,
    onClose: onVerifyClose,
  } = useDisclosure()
  const { currentUser, setCurrentUser } = useContext(EstadoContext)
  const [backend] = useCanister("backend")
  const { disconnect } = useConnect()
  const toast = useToast()
  const navigate = useNavigate()
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [resCodeVerificationMessage, setResCodeVerificationMessage] =
    useState(null)
  const [formDataVerify, setFormDataVerify] = useState({
    verificationCode: "",
  })

  const estadoContext = useContext(EstadoContext)
  if (!estadoContext) {
    // throw new Error("El componente debe estar dentro de un estadoContext")
    throw new Error("The component must be inside an estadoContext.")
  }

  const handleSubmitVerify = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
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
      const resEnterVerificationCode = (await backend.enterVerificationCode(
        formDataVerify.verificationCode,
      )) as string
      setCurrentUser((prev) => ({
        ...prev,
        verified: { Success: true, Code: "" },
      }))

      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      toast({
        title: "Successful Submission",
        description: resEnterVerificationCode["ok"],
        status: "success", // 'success' es el status para el estilo de éxito
        duration: 5000,
        isClosable: true,
        variant: "solid",
      })

      onVerifyClose()
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
      console.error("Error al entrar código de verificación:", error)
    }
  }

  const handleChangeVerify = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormDataVerify((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleItemClick = (to?: string) => {
    if (to) {
      setSelectedPage(to)
      onClose()
      navigate(to)
    }
  }

  const resetUser = () => {
    setCurrentUser(initialStateUser)
    disconnect()
    navigate("/")
  }

  const getCodeVerification = async () => {
    const resGetCodeVerification =
      (await backend.getCodeVerification()) as string
    setResCodeVerificationMessage(resGetCodeVerification["ok"])
  }

  return (
    <>
      <Menu>
        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
          <HStack>
            <Avatar size={"md"} src={"data:image/png;base64," + blobToBase64(currentUser?.avatar[0])} />
            <VStack
              display={{ base: "none", md: "flex" }}
              alignItems="flex-start"
              spacing="1px"
              ml="2"
            >
              <Text fontSize="md">{currentUser?.name}</Text>
              <Text fontSize="sm" color="gray.300">
                {getUserRoles(currentUser?.roles)}
              </Text>
            </VStack>
            <Box display={{ base: "none", md: "flex" }}>
              <FiChevronDown />
            </Box>
          </HStack>
        </MenuButton>
        <MenuList color="black">
          <MenuItem onClick={() => handleItemClick("/Dashboard")}>
            Dashboard
          </MenuItem>
          <MenuItem onClick={() => handleItemClick("/Dashboard/Portfolio")}>
            Portfolio
          </MenuItem>
          <MenuItem onClick={() => handleItemClick("/Edit")}>Edit</MenuItem>
          <MenuItem onClick={() => handleItemClick("/")}>Home</MenuItem>
          <MenuItem onClick={() => handleItemClick("/LaunchPad")}>
            LaunchPad
          </MenuItem>
          <MenuDivider />
          {currentUser?.verified["Success"] !== true && (
            <MenuItem onClick={onVerifyOpen}>Verify</MenuItem>
          )}
          <MenuItem onClick={() => resetUser()}>Disconnect</MenuItem>
        </MenuList>
      </Menu>

      <Modal isOpen={isVerifyOpen} onClose={onVerifyClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <span style={{ color: "black" }}>Registration Verification</span>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{ color: "black" }}>
            <form onSubmit={handleSubmitVerify}>
              <FormControl isRequired>
                <Input
                  placeholder="Código de verificación"
                  id="verificationCode"
                  name="verificationCode"
                  value={formDataVerify.verificationCode}
                  onChange={handleChangeVerify}
                />
              </FormControl>
              <FormControl>
                <Button type="submit" mt={4} colorScheme="teal">
                  Verify
                </Button>
              </FormControl>
              <FormControl>
                <Button
                  type="button"
                  mt={4}
                  variant="ghost"
                  onClick={() => getCodeVerification()}
                >
                  Get code
                </Button>
              </FormControl>
              <Text>{resCodeVerificationMessage}</Text>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onVerifyClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
