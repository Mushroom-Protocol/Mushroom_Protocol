import React from "react"
import { Center, Box, Flex, Text, Image, Link } from "@chakra-ui/react"
import PathNathera from "../../assets/PathNathera.jpg"
import biopolimero from "../../assets/biopolimero.jpg"
import nanocouting from "../../assets/nanocouting.jpg"
import Natheralogo from "../../assets/Natheralogo.png"
import Landoppicon from "../../assets/Landopp_icon.png"
import EONlogo from "../../assets/EONlogo.png"

const FundedProjects = () => {
  return (
    <>
      <Text fontSize="36px" mt="20px" alignItems="center">
        Funded Projects
      </Text>
      <Box p={4} display={{ md: "flex" }}>
        <Box border="1px solid #1FAFC8" p="20px" borderRadius="8px">
          <Box flexShrink={0}>
            <Image w="250px" h="250px" src={PathNathera} alt="Main Image 1" />
          </Box>
          <Box mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
            <Flex>
              <Image
                src={Natheralogo}
                alt="Secondary Image 1"
                w="50px"
                h="50px"
                mr="10px"
              />
              <Text fontSize="lg">Nathera</Text>
            </Flex>
            <Text fontSize="lg">Nanotherapy to improve well-being</Text>
            <Text color="gray.500">
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
        </Box>
        <Box border="1px solid #1FAFC8" p="20px" borderRadius="8px">
          <Box flexShrink={0}>
            <Image w="250px" h="250px" src={biopolimero} alt="Main Image 2" />
          </Box>
          <Box mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
            <Flex>
              <Image
                src={Landoppicon}
                alt="Secondary Image 2"
                w="50px"
                h="50px"
                mr="10px"
              />
              <Text fontSize="lg">Landopp</Text>
            </Flex>
            <Text fontSize="lg">Biopolymer developed with biomass</Text>
            <Text color="gray.500">
              We develop alternative raw materials to plastic that come from the
              earth and return to it, respecting the environment, without toxics
              and 100% organic.
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
        </Box>
        <Box border="1px solid #1FAFC8" p="20px" borderRadius="8px">
          <Box flexShrink={0}>
            <Image w="250px" h="250px" src={nanocouting} alt="Main Image 1" />
          </Box>
          <Box mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
            <Flex>
              <Image
                src={EONlogo}
                alt="Secondary Image 1"
                w="50px"
                h="50px"
                mr="10px"
              />
              <Text fontSize="lg">EON</Text>
            </Flex>
            <Text fontSize="lg">Extends the shelf life of food</Text>
            <Text color="gray.500">
              Every year, tons of food are wasted during export and
              transportation. EON develops a coating to extend the shelf life of
              food.
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
        </Box>
      </Box>
    </>
  )
}

export default FundedProjects
