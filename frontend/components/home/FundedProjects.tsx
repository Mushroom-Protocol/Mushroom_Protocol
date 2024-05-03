import React from "react";
import { Center, Box, Flex, Text, Image } from "@chakra-ui/react";
import PathNathera from "../../assets/PathNathera.jpg"
import biopolimero from "../../assets/biopolimero.jpg"
import nanocouting from "../../assets/nanocouting.jpg"
import Natheralogo from "../../assets/Natheralogo.png"
import Landoppicon from "../../assets/Landopp_icon.png"
import EONlogo from "../../assets/EONlogo.png"

const FundedProjects = () => {
  return (
  <Center>
    <Flex
      
      color="#FFFFFF"
      flexDirection="column"
      alignItems="center"
      width="1024px"
      height="700px"
      position="relative"
      marginLeft="0px"
    >
      <Text fontSize="36px" mt="20px" alignItems="center">
        Funded Projects
      </Text>

      {/* Caja 1 - Izquierda */}
      <Box
        
        border="1px solid #1FAFC8"
        borderRadius="8px"
        width="340px" // Cambiar el tamaño a 300px
        position="absolute"
        top="100px"
        left="-10px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        p="20px"
        textAlign="center"
      >
        <Image
          src={PathNathera}
          alt="Main Image 1"
          style={{
            width: "100%"
          }}
            w="250px"
            h="250px"
        />

        <Box display="flex" alignItems="center" mt="20px">
          <Image
            src={Natheralogo}
            alt="Secondary Image 1"
            w="50px"
            h="50px"
            mr="10px"
          />

          <Text fontSize="25px">Nathera</Text>
        </Box>

        <Text fontSize="22px" my="10px">
          Nanotherapy to improve well-being
        </Text>

        <Text fontSize="16px" color="#737373" textAlign="justify" my="10px">
          The project is developing a treatment for musculoskeletal diseases
          such as arthrosis, low back pain, and rheumatoid arthritis using
          nanotechnology.
        </Text>

        <Text
          fontSize="16px"
          backgroundColor="#1FAFC8"
          color="#1E1E1E"
          p="8px"
          borderRadius="8px"
          mt="20px"
        >
          Health Tech
        </Text>
      </Box>

      {/* Caja 2 - Centro (Nueva) */}
      <Box
        
        border="1px solid #1FAFC8"
        borderRadius="8px"
        width="340px" // Tamaño igual al de la Caja 1
        position="absolute"
        top="100px"
        left="342px" // Espacio adicional para acomodar la tercera caja
        display="flex"
        flexDirection="column"
        alignItems="center"
        p="20px"
        textAlign="center"
      >
        <Image
          src={biopolimero}
          alt="Main Image 2"
          style={{
          width: "100%"
        }}
          w="250px"
          h="250px"
        />

        <Box display="flex" alignItems="center" mt="20px">
          <Image
            src={Landoppicon}
            alt="Secondary Image 2"
            w="50px"
            h="50px"
            mr="10px"
          />

          <Text fontSize="25px">Landopp</Text>
        </Box>

        <Text fontSize="22px" my="10px">
          Biopolymer developed with biomass
        </Text>

        <Text fontSize="16px" color="#737373" textAlign="justify" my="10px">
          We develop alternative raw materials to plastic that come from the
          earth and return to it, respecting the environment, without toxics and
          100% organic.
        </Text>

        <Text
          fontSize="16px"
          backgroundColor="#64B344"
          color="#000000"
          p="8px"
          borderRadius="8px"
          mt="20px"
        >
          Green Tech
        </Text>
      </Box>

      <Box
        
        border="1px solid #1FAFC8"
        borderRadius="8px"
        width="340px"
        position="absolute"
        top="100px"
        right="-10px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        p="20px"
        textAlign="center"
      >
        <Image
          src={nanocouting}
          alt="Main Image 2"
          style={{
            width: "100%"
          }}
            w="250px"
            h="250px"
        />

        <Box display="flex" alignItems="center" mt="20px">
          <Image
            src={EONlogo}
            alt="Secondary Image 2"
            w="50px"
            h="50px"
            mr="10px"
          />

          <Text fontSize="25px">EON</Text>
        </Box>

        <Text fontSize="22px" my="10px">
          Extends the shelf life of <br />
          food
        </Text>

        <Text fontSize="16px" color="#737373" textAlign="justify" my="10px">
          Every year, tons of food are wasted during export and transportation.
          EON develops a coating to extend the shelf life of food. <br /> <br />
        </Text>

        <Text
          fontSize="16px"
          backgroundColor="#EA332B"
          color="#000000"
          p="8px"
          borderRadius="8px"
          mt="20px"
        >
          Agro Tech
        </Text>
      </Box>
    </Flex>
  </Center>
  );
};

export default FundedProjects;
