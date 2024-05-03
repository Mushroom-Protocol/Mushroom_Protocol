import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Heading
} from "@chakra-ui/react";
import React from "react";
import { BiHeading } from "react-icons/bi";

const capitalizeFirstLetter = (text:String) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const DeSciCommunity = () => {
  const topUsers = [
    {
      name: "CamilaCrypto",
      capital: "$2,000",
      projects: "6",
      industry: "Health Tech"
    },
    {
      name: "juanito123",
      capital: "$1,700",
      projects: "7",
      industry: "Health Tech"
    },
    {
      name: "Anónimo",
      capital: "$1,200",
      projects: "4",
      industry: "Agro Tech"
    },
    {
      name: "MariaNFT",
      capital: "$750",
      projects: "10",
      industry: "Green Tech"
    },
    { name: "Anónimo", capital: "$720", projects: "3", industry: "Food Tech" },
    {
      name: "Critpcientífico",
      capital: "$300",
      projects: "5",
      industry: "Green Tech"
    },
    {
      name: "Raul2345",
      capital: "$150",
      projects: "7",
      industry: "Mining Tech"
    }
  ];

  return (
    <>
    <Flex
    color="#FFFFFF"
    flexDirection="column"
    alignItems="center"
    position="relative"
    width="100%"
    height="80vh"  
    align="center"
    justify="center"
    >
      <Heading>
        DeSci Community
      </Heading>
      <Heading color="#737373">
        Top users
      </Heading>
      <Flex p={3}></Flex>
      <HStack>
        <Box  
        borderColor="#1FAFC8"
        borderWidth="6px"
        width="100%"
        borderRadius="lg"
        >
        <Table
        width='90%'
        >
        <Thead>
          <Tr>
            <Th fontSize="18px" color="#FFFFFF" textTransform="capitalize">
              User
            </Th>
            <Th fontSize="18px" color="#FFFFFF" textTransform="capitalize">
              Financed Capital
            </Th>
            <Th fontSize="18px" color="#FFFFFF" textTransform="capitalize">
              N° Projects
            </Th>
            <Th fontSize="18px" color="#FFFFFF" textTransform="capitalize">
              Favourite Industry
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {topUsers.map((user, index) => (
            <Tr key={index}>
              <Td fontSize="16px" color="#737373">
                {capitalizeFirstLetter(user.name)}
              </Td>
              <Td fontSize="16px" color="#737373">
                {user.capital}
              </Td>
              <Td fontSize="16px" color="#737373">
                {user.projects}
              </Td>
              <Td fontSize="16px" color="#737373">
                {user.industry}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
        </Box>
       
        </HStack>

       
    </Flex>
    <Flex p={6}></Flex>
    </>
  );
};

export default DeSciCommunity;
