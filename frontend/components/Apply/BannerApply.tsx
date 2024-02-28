import React from 'react';
import { Box, Heading, Container, Text, Button, Stack } from '@chakra-ui/react';
import { Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // Importa Link para la navegación
import { useNavigate } from 'react-router-dom';

const BannerApply = () => {
    const GitbookApplyLink = "https://mushroomprotocol.gitbook.io/docs/get-started/apply";
    const TypeformLink= "https://y4weuik1x3k.typeform.com/to/qisWXbes"

    const handleApply = () => {
        window.open(TypeformLink, '_blank', 'noopener noreferrer');
      };
      
  return (
    <Container maxW={'6xl'}>
      <Stack as={Box} textAlign={'center'} py={{ base: 20, md: 20 }}>
        <Heading
          fontWeight={650}
          fontSize={{ base: '2xl', sm: '4xl', md: '4xl' }}
          lineHeight={'100%'}
          color={'#1FAFC8'}
          noOfLines={1}>
          NEED FUNDS TO DEVELOP YOUR SCIENCE?
        </Heading>
        <Text fontSize={{ base: '2xl', sm: '3xl', md: '3xl' }} color={'white'}>
        We connect your science with investors from all over the world
        </Text>
        <Stack
          align={'center'}
          alignSelf={'center'}
          position={'relative'}
          spacing={4}
          direction='row'>
          {/* Utiliza el componente Link para la navegación */}
            <Button
              colorScheme={'blue'}
              borderRadius={'full'}
              bg={'#1FAFC8'}
              px={30}
              size='lg'
              _hover={{
                bg: '#01B994',
              }}
              onClick={handleApply}
              >
              Apply
            </Button>
        </Stack>
        <Text fontSize="20px" textColor="#737373">
        Equity-Free  ●  Decentralized Financing  ●  Fast Apply
        </Text>
        <Text fontSize="16px" textColor="#737373" align="justify">
      <br />
      This funding program supports projects aimed at developing biotechnology-based solutions.
      While the primary focus of the grants is to fund start-up companies, the Mushroom Protocol
      can also support research-stage projects. Anyone with a lab-tested idea is welcome to apply
      and receive a funding campaign for a grant of between $10,000 and $100,000.
      You can read more information about the process in our{' '}
      <ChakraLink href="url_del_enlace" color="#1FAFC8" textDecoration="underline">
        application guide
      </ChakraLink>
      .
    </Text>
      </Stack>
      
    </Container>
  );
};

export default BannerApply;
