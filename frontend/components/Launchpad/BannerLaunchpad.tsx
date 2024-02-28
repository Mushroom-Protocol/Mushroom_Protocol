import React from "react";
import { Container, Heading, Center, Box, Flex, Text, Button, Image, Stack } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

const BannerLaunchpad = () => {
  const GitbookLink = "https://mushroomprotocol.gitbook.io/docs/";

  const handleLearnMore = () => {
    window.open(GitbookLink, "_blank");
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
         MUSHROOM PROTOCOL LAUNCHPAD
        </Heading>
        <Text fontSize={{ base: '2xl' }} color={'white'}>
        Finance the Biotechnology companies of the future
        </Text>
        <Stack
          align={'center'}
          alignSelf={'center'}
          position={'relative'}
          spacing={0}
          direction='row'>
          {/* Utiliza el componente Link para la navegación */}

          <Button
          colorScheme="blue"
          backgroundColor="#1FAFC8"
          variant="solid"
          mt="10px"
          borderRadius="full"
          _hover={{
            bg: '#01B994',
          
          }}
          onClick={handleLearnMore}
        >
          Learn More
        </Button>
        </Stack>
      </Stack>
    </Container>
  );
};
export default BannerLaunchpad;
