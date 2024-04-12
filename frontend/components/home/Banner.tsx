import React from "react";
import { Mailgun } from "mailgun";
import { Center, Box, Flex, Heading, Text, Button, Image, flexbox } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
// import MushroomMachine from "../../assets/MushroomMachine";



const Banner = () => {
  const navigate = useNavigate();

  const handleLaunchPadClick = () => {
    navigate('/Launchpad');
  };

  return (
    <Center>
      <Flex

        color="#FFFFFF"
        flexDirection={{ sd: "column" }}
        justifyContent="center"
        alignItems="center"
        width="100%"
        // height="430px"
        position="relative"
      >
        <Box
          p={4}
          position="relative"
          top="50px"
          left="-20px"
          textAlign="left"
          maxWidth="50%"
        >
          <Heading fontSize={{ base: "24px", md: "30px", lg: "43px" }}>
            Supports the science and technology development in LATAM
          </Heading>
        </Box>
        
        {/* <Image
          src={MushroomMachine}
          alt="Imagen"
          boxSize="450px"
          position="absolute"
          top="0px"
          right="0px"
        /> */}
        <Text
          fontSize="18px"
          position="absolute"
          top="330px"
          right="0px"
          maxWidth="50%"
          textAlign="justify"
        >
          Join our mission to advance biotechnology by funding impact research.
          With your valuable support, scientists will be able to develop solutions
          that will improve the lives of millions of people
        </Text>
      </Flex>
    </Center>
  );
};

export default Banner;
