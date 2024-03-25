'use client'
import { ConnectButton, ConnectDialog, useCanister, useConnect  } from "@connect2ic/react";
import "@connect2ic/core/style.css";

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
  Avatar,
  VStack} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'
import MpFavicon  from './../assets/MpFavicon.png' 
import { useEffect, useState } from 'react';
import React, { useContext } from 'react';
import { EstadoContext } from './utils/estadoContex'; 
import { FiChevronDown } from "react-icons/fi";
import NatheraTeamAA from '../assets/NatheraTeamAA.jpg';
interface Props {
  children: React.ReactNode
}
const Links = ['Home', 'Launchpad', 'Apply']
//const { estado, setEstado } = useContext(EstadoContext);

const NavLink = (props: Props) => {
  const { children } = props
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href='/Home'>
      {children}
    </Box>
  )
}

interface UserType {
  name: string, email: string
}

export default function WithSubnavigation() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isRegisterOpen , onOpen: onRegisterOpen, onClose: onRegisterClose } = useDisclosure()
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({name: "", email: ""} as UserType);
  const [backend] = useCanister("backend");
  const {isConnected} = useConnect();
  const toast = useToast();
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
  });
  const estadoContext = useContext(EstadoContext);
if (!estadoContext) {
  throw new Error('El componente debe estar dentro de un estadoContext');
}

  useEffect(() => {
    const getMyUser = async () => {
      const myUser = await backend.getMyUser()
      return myUser as [UserType]
    }

    isConnected ?
      getMyUser().then((responseUser) => {
        if (responseUser.length > 0) {
          setUser(responseUser[0] as UserType)
        }
      })
    :
      setUser({name: "", email: ""})
  }, [isConnected])

const { estado, setEstado } = estadoContext;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    let loadingToastId: string | number | undefined;
    
    try {
      loadingToastId = toast({
        title: 'Submitting Form',
        status: 'loading', // 'loading' es el status para el estilo de carga
        duration: null,
        isClosable: false,
        variant: 'solid',
      })
      const resUser = await backend.signUp(formData.userName, formData.userEmail, [])
      setUser(resUser[0] as {name: string, email: string})
      
      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      toast({
        title: 'Successful Submission',
        description: 'Your form was submitted successfully.',
        status: 'success', // 'success' es el status para el estilo de éxito
        duration: 5000,
        isClosable: true,
        variant: 'solid',
      })

      onClose()
    } catch (error) {
      if (loadingToastId !== undefined) {
        toast.close(loadingToastId);
      }

      toast({
        title: 'Submission Error',
        description: 'There was an error submitting the form. Please try again.',
        status: 'error', // 'error' es el status para el estilo de error
        duration: 5000,
        isClosable: true,
        variant: 'solid',
      })
      console.error('Error al registrar usuario:', error);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Solo toma el primer archivo, puedes ajustar según tus necesidades
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  }

  const handleItemClick = (to?: string) => {
    if (to) {
      setSelectedPage(to);
      onClose();
      navigate(to)
    }
  }

//const fetchMessage = async () => {
 // try {
  //  setLoading(true);
   // const estado1 = await backend.getMessage1();
   // setEstado(estado1); 
  //} catch (err) {
   // console.error(err);
  //} finally {
   //console.log("El mensaje del backend es" + estado);     
   // setLoading(false);
  //}
//};

// Fetch the message on page load
//useEffect(() => {
//fetchMessage();
//}, [estado]);

  return (
    <>
      <Box bg="#000000" borderWidth="1px" borderLeftColor="#000000"
    borderRightColor="#000000" borderBottomColor="#FFFFFFF" px={10}>
        <Flex h="70px" alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={10} alignItems={'center'}>
            <Box>
              <Image 
              boxSize='60px'
              height='30%'
              src={MpFavicon}
              alt='Logo Mushhroom'
              />
              </Box>
            <HStack as={'nav'} spacing={8} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                //<Text key={link}>{link}</Text>
                 <Box
                 px={3}
                 py={3}
                 rounded={'md'}
                 _hover={{
                   textDecoration: 'none',
                   bg: "#1E1E1E",
                 }} key={link}>
            <ChakraLink as={ReactRouterLink} to={`/${link}`}>
                <Text fontSize='18px' color='white'>
                  {link}
                </Text>                  
              </ChakraLink>
              </Box>
                //<NavLink key={link}><Text fontSize='2xl' as='b'>{link}</Text></NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
          
          
            <div id="botonConexion"><ConnectButton/></div>
            <Box ml="4px">
              {
                isConnected ?
                  user.name === "" ?
                    <Button id="botonRegisterUser" onClick={onRegisterOpen}>Registrar Usuario</Button> :
                    <div style={{backgroundColor: '#333333'}}>
                      <Menu>
                        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                          <HStack>
                            <Avatar size={'md'} src={NatheraTeamAA} />
                            <VStack display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing="1px" ml="2">
                              <Text fontSize="md">{user.name}</Text>
                              <Text fontSize="sm" color="gray.600">
                                Team Leader
                              </Text>
                            </VStack>
                            <Box display={{ base: 'none', md: 'flex' }}>
                              <FiChevronDown />
                            </Box>
                          </HStack>
                        </MenuButton>
                        <MenuList backgroundColor='#000000' borderColor="#000000" textColor="#FFFFFF">
                          <MenuItem backgroundColor='#FFFFFF' textColor="#000000" onClick={() => handleItemClick('/Dashboard')}>Dashboard</MenuItem>
                          <MenuItem onClick={() => handleItemClick('/Portfolio')}>Portafolio</MenuItem>
                          <MenuItem backgroundColor='#FFFFFF' textColor="#000000" onClick={() => handleItemClick('/Edit')}>Edit</MenuItem>
                          <MenuItem onClick={() => handleItemClick('/')}>Home</MenuItem>
                          <MenuItem onClick={() => handleItemClick('/LaunchPad')}>LaunchPad</MenuItem>
                          <MenuDivider />
                          <MenuItem onClick={() => handleItemClick('/Disconnect')}>Disconnect</MenuItem>
                        </MenuList>
                      </Menu>
                    </div>
                : <></>
              }
            </Box>
            
            <Modal isOpen={isRegisterOpen} onClose={onRegisterClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader><span style={{color: "black"}}>Registrar Usuario</span></ModalHeader>
                <ModalCloseButton />
                <ModalBody style={{color: "black"}}>
                  <form onSubmit={handleSubmit}>
                    <FormControl isRequired>
                      <Input placeholder='Nombre' id="userName" name="userName" value={formData.userName} onChange={handleChange} />
                    </FormControl>
                    <FormControl isRequired>
                      <Input placeholder='Correo Electrónico' id="userEmail" name="userEmail" value={formData.userEmail} onChange={handleChange} />
                    </FormControl>
                    <FormControl>
                      <Button type="submit" mt={4} colorScheme="teal">
                      Registrar
                    </Button>
                    </FormControl>
                  </form>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={onRegisterClose}>
                    Cerrar
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            
            <Menu>
              <MenuButton

                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
              </MenuButton>
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
          <Box pb={40} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
        <ConnectDialog/>
      </Box>
    </>
  )
}