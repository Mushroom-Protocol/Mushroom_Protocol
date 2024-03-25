import React from "react";
import { Box, Flex, HStack, Text,VStack,Heading } from "@chakra-ui/react";

const badgeStyle = {
  backgroundColor: "#1FAFC8", // Color de fondo celeste
  color: "#000000", // Color de letras blancas
  fontSize: "18px", // Tamaño de letra 18
  padding: "5px 10px",
  borderRadius: "10px",
  marginLeft: "10px"
};

const Dappfunctions = () => {
  return (
    <Flex
      color="#FFFFFF"
      flexDirection="column"
      alignItems="center"
      position="relative"
      width="100vw"
        height="80vh"
    >
      
      <Text fontSize="36px" mt="20px">
      Dapp functions
      </Text>
      <Flex p={4}></Flex>
      <HStack spacing='100px'>
      <VStack maxW='sm' spacing='20px'>
      <Box alignItems="left" marginLeft="-20px">
        <Text fontSize="25px">Apply for Sciences</Text>
        <Text color="#737373" fontSize="22px">
          Register and apply for on-chain funds
        </Text>
      </Box>

      <Box alignItems="left">
        <Text fontSize="25px">Launchpad NFT</Text>
        <Text color="#737373" fontSize="22px">
        Mint NFTs based in R&D and finance biotechnology
        </Text>
      </Box>

      <Box alignItems="left" marginLeft="-8px">
        <Text fontSize="25px">
          Marketplace NFT <span style={badgeStyle}>Coming Soon</span>
          </Text>
        <Text color="#737373" fontSize="22px">
          Trade your NFTs in a decentralized way
        </Text>
      </Box>
      </VStack>
      <VStack maxW='sm' spacing='30px' alignItems='left'>
      <Box alignItems='left'>
        <Text fontSize="25px">
          FungiDAO <span style={badgeStyle}>Coming Soon</span>
        </Text>
        <Text color="#737373" fontSize="22px">
        Vote and participate in the development of Mushroom Protocol
        </Text>
      </Box>

      <Box alignItems='left'>
        <Text fontSize="25px">
          DeFi <span style={badgeStyle}>Coming Soon</span>
        </Text>
        <Text color="#737373" fontSize="22px">
        Earn rewards for investing in science through Stanking and Vaults
        </Text>
      </Box>
      </VStack>
      </HStack>
    </Flex>
  );
};

export default Dappfunctions;
