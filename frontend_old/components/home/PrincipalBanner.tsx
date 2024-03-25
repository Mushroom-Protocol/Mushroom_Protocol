// Importa los módulos necesarios de React y ChakraUI
import React from 'react';
import { Box, Heading, Container, Text, Button, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // Importa Link para la navegación

// Define el componente CallToActionWithAnnotation
const PrincipalBanner = () => {
  return (
    <Container maxW={'6xl'}>
      <Stack as={Box} textAlign={'center'} py={{ base: 20, md: 8 }}>
        <Heading
          fontWeight={650}
          fontSize={{ base: '2xl', sm: '4xl', md: '4xl' }}
          lineHeight={'110%'}
          color={'#1FAFC8'}
          noOfLines={1}>
          DECENTRALIZED FINANCING IN BIOTECHNOLOGY
        </Heading>
        <Text fontSize={{ base: '2xl', sm: '3xl', md: '3xl' }} color={'white'}>
          Driving the financial revolution in science and technology
        </Text>
        <Stack
          align={'center'}
          alignSelf={'center'}
          position={'relative'}
          spacing={4}
          direction='row'>
          {/* Utiliza el componente Link para la navegación */}
          <Link to="/Launchpad">
            <Button
              colorScheme={'blue'}
              borderRadius={'full'}
              bg={'#1FAFC8'}
              px={30}
              size='lg'
              _hover={{
                bg: '#01B994',
              }}>
              LAUNCHPAD
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
};

export default PrincipalBanner;
