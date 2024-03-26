import { ConnectButton, ConnectDialog, useCanister, useConnect } from "@connect2ic/react";
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
  Stack
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'
// import MpFavicon from '../assets/MpFavicon.png'
import React, { useState, useContext, useEffect } from 'react';
import { EstadoContext } from './utils/estadoContex';

import { User } from '../../src/declarations/backend/backend.did';


interface Props {
  children: React.ReactNode
}
let Links = ['Home', 'Launchpad']; // Agregar Apply en caso de que el usuario esté registrado
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

export default function WithSubnavigation() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isConnected, principal } = useConnect();


  const estadoContext = useContext(EstadoContext);
  if (!estadoContext) {
    throw new Error('El componente debe estar dentro de un estadoContext');
  }

  const [backend] = useCanister("backend");
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("Is conected: ", isConnected);
      console.log(principal)

      if (isConnected) {
        console.log("llamando a getMyUser()")
        const data = await backend.getDeployer();
        // console.log(data)
        // console.log("Nombre: ", data[0].verified)

        if (data) { Links.push("Apply") }
        // setUserData(data);
      }

    };

    fetchUserData();
    return () => {
      Links = Links.filter(str => str !== "Apply");
    };
  }, [isConnected]); // El array vacío significa que este efecto se ejecuta solo en el montaje inicial

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
          {/* <p>{userData.name}</p> */}
          <HStack spacing={10} alignItems={'center'}>
            <Box>
              <Image
                boxSize='60px'
                height='30%'
                // src={MpFavicon}
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
            {!userData && (
              <Button

                colorScheme="blue" // Esquema de colores del botón
                bg={"#444"} // Aplicar el color de fondo según el modo de color
                color={"white"} // Aplicar el color del texto según el modo de color
                border={"none"}
                borderRadius="30px" // Bordes redondeados
              >
                Registrar
              </Button>
            )}
            {estadoContext && (
              <div id="botonConexion"><ConnectButton /></div>
            )}
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
        <ConnectDialog />
      </Box>
    </>
  )
}
