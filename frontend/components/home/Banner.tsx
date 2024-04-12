import React from "react";
import { Mailgun } from "mailgun";
import { Center, Box, Flex, Heading, Text, Button, Image, flexbox } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
// import MushroomMachine from "../../assets/MushroomMachine";

function sendMail() {
  const formData = require('form-data');
  const Mailgun = require('mailgun.js');
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY || 'b5f80234c64cd2eaf6764302caabd97c-f68a26c9-2119e0cf' });

  mg.messages.create('sandbox-123.mailgun.org', {
    from: "Excited User mailgun@sandbox54670183dd5847a6b3fa49c0f1ca31a1.mailgun.org",
    to: ["arielrobotti@gmail.com"],
    subject: "Hello",
    text: "Testing some Mailgun awesomeness!",
    html: "<h1>Testing some Mailgun awesomeness!</h1>"
  })
    .then(msg => console.log(msg)) // logs response data
    .catch(err => console.log(err)); // logs any error
};

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
        <Button
          colorScheme="blue"
          backgroundColor="#1FAFC8"
          variant="solid"
          fontSize="18px"
          borderRadius="full"
          ml="16px"
          position="absolute"
          top="210px"
          left="-20px"
          size='lg'
          px={10}
          _hover={{
            bg: '#01B994',
          }}
          onClick={() => sendMail()}
        >
          send Email
        </Button>
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
