import {
  Center,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react"
import React from "react"

const DeSciEcosystem = () => {
  const data = [
    {
      tag: "Health Tech",
      treasury: "$20,000",
      projects: "1",
      raised: "$12,000",
      industry: "Health",
    },
    {
      tag: "AgroFood Tech",
      treasury: "$20,000",
      projects: "1",
      raised: "$12,000",
      industry: "Agriculture",
    },
    {
      tag: "Green Tech",
      treasury: "$40,000",
      projects: "1",
      raised: "$30,000",
      industry: "Sustainability",
    },
    {
      tag: "Synthetic Tech",
      treasury: "$0",
      projects: "0",
      raised: "$0",
      industry: "Data & Energy",
    },
    {
      tag: "Mining Tech",
      treasury: "$0",
      projects: "0",
      raised: "$0",
      industry: "Mining",
    },
  ]

  return (
    <Center>
      <Flex
        color="#FFFFFF"
        flexDirection="column"
        alignItems="center"
        width="1024px"
        // height="450px"
        top="50px"
      >
        <Text fontSize="36px" mt="20px">
          DeSci Ecosystem
        </Text>
        <Table
          borderColor="#000000"
          variant="simple"
          size="md"
          width="100%"
          mt="30px"
          borderRadius="full"
        >
          <Thead>
            <Tr>
              <Th fontSize="18px" color="#FFFFFF" textTransform="capitalize">
                Badge
              </Th>
              <Th fontSize="18px" color="#FFFFFF" textTransform="capitalize">
                Treasury
              </Th>
              <Th fontSize="18px" color="#FFFFFF" textTransform="capitalize">
                N° Projects
              </Th>
              <Th fontSize="18px" color="#FFFFFF" textTransform="capitalize">
                $ Raised
              </Th>
              <Th fontSize="18px" color="#FFFFFF" textTransform="capitalize">
                Industry
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, index) => (
              <Tr key={index}>
                <Td fontSize="16px" color="#737373" borderRadius="15px">
                  {row.tag}
                </Td>
                <Td fontSize="16px" color="#737373" borderRadius="15px">
                  {row.treasury}
                </Td>
                <Td fontSize="16px" color="#737373" borderRadius="15px">
                  {row.projects}
                </Td>
                <Td fontSize="16px" color="#737373" borderRadius="15px">
                  {row.raised}
                </Td>
                <Td fontSize="16px" color="#737373" borderRadius="15px">
                  {row.industry}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Flex>
    </Center>
  )
}

export default DeSciEcosystem
