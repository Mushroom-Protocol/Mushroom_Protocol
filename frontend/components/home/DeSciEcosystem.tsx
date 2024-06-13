import React from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';

// Importa la imagen que deseas utilizar
import GreenTech from "../../assets/GreenTech.png";
import FoodTech from "../../assets/FoodTech.png";
import HealthTech from "../../assets/HealthTech.png";
import SyntheticTech from "../../assets/SyntheticTech.png";
import MinningTech from "../../assets/MinnigTech.png";



interface StatsCardProps {
  title: string;
  stat: string;
  image: string; // Cambia 'icon' por 'image' y usa string para la ruta de la imagen
  tvl: string;
  industry: string;
}

function StatsCard(props: StatsCardProps) {
  const { title, stat, image, tvl, industry } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      borderWidth="1px"
      bg="#000000"
      borderColor="#FFFFFFF"
      rounded={'lg'}>
      <Box>
        <StatLabel fontSize={'4xl'} fontWeight={'medium'} isTruncated>
          {title}
        </StatLabel>
        <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
          {stat}
        </StatNumber>
        <Text mt={2} fontSize="sm" color="gray.500">
          TVL: {tvl}
        </Text>
        <Text mt={1} fontSize="sm" color="gray.500">
          Industry: {industry}
        </Text>
      </Box>
      <Box my={'auto'} alignContent={'center'}>
        <img src={image} alt={title} style={{ maxWidth: '100%', height: 'auto' }} />
      </Box>
    </Stat>
  );
}

const DeSciEcosystem: React.FC = () => {
  return (
    <Box maxW="6x1" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 5 }}>
        <StatsCard
          title={'Green Tech'}
          stat={'2 Projects'}
          image={GreenTech} // Usa la imagen importada
          tvl={'$150,000'}
          industry={'Sustainability'}
        />
        <StatsCard
          title={'Health Tech'}
          stat={'1 Project'}
          image={HealthTech} // Cambia la imagen según corresponda
          tvl={'$17,000'}
          industry={'Health & Medicine'}
        />
        <StatsCard
          title={'AgroFood Tech'}
          stat={'2 Projects'}
          image={FoodTech} // Cambia la imagen según corresponda
          tvl={'$117,000'}
          industry={'Agriculture & food'}
        />
        <StatsCard
          title={'Synthetic Tech'}
          stat={'1 Project'}
          image={SyntheticTech} // Cambia la imagen según corresponda
          tvl={'$22,000'}
          industry={'Data & Energy'}
        />
      </SimpleGrid>
    </Box>
  );
};

export default DeSciEcosystem;
