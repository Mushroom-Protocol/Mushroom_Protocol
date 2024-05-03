import React from "react";
import { Center, Box, Text, Button, Image, Flex } from "@chakra-ui/react";
import HongoBanner2 from "../../assets/HongoBanner2.png"

const JoinDiscord = () => {
  const discordLink = "https://discord.gg/wxe4aMwZWT";

  const handleJoinDiscord = () => {
    window.open(discordLink, "_blank");
  };

  return (
  <Center>
    <Flex
      width="1024px"
      height="380px"
      color="#FFFFFF"
      paddingX="0px"
      paddingY="20px"
    >
      <Image
        src={HongoBanner2}
        alt="Discord Image"
        width="350px"
        height="350px"
      />
      <Box flex="1" textAlign="right">
        <Text fontSize="36px" marginTop="70px">
          Join our community
        </Text>
        <Text fontSize="18px" color="#737373" marginTop="10px">
        Finances the biotechnology companies of tomorrow, contributes to their growth and promotes the advancement of science in Latin America.
        </Text>
        <Button
          colorScheme="blue"
          backgroundColor="#1FAFC8"
          variant="solid"
          fontSize="18px"
          borderRadius="full"
          marginTop="20px"
          _hover={{
            bg: '#01B994',
          }}
          onClick={handleJoinDiscord}
        >
          Join Discord
        </Button>
      </Box>
    </Flex>
    </Center>
  );
};

export default JoinDiscord;
