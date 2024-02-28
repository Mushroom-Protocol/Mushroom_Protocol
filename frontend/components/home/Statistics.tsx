import React from "react";
import {
    Box,
    chakra,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { ReactNode } from 'react';
  import { IoLogoUsd } from "react-icons/io5";
  import { BsCollectionFill } from "react-icons/bs";
  import { RiNftFill } from "react-icons/ri";
  import { RiTokenSwapFill } from "react-icons/ri";


  import { GoLocation } from 'react-icons/go';
  
  interface StatsCardProps {
    title: string;
    stat: string;
    icon: ReactNode;
  }
  function StatsCard(props: StatsCardProps) {
    const { title, stat, icon } = props;
    return (
      <Stat
        px={{ base: 2, md: 4 }}
        py={'5'}
        shadow={'xl'}
        borderWidth="1px"
        borderColor="#FFFFFFF"
        rounded={'lg'}>
        <Flex justifyContent={'space-between'}>
          <Box pl={{ base: 2, md: 4 }}>
            <StatLabel fontSize={'4xl'} fontWeight={'medium'} isTruncated>
              {title}
            </StatLabel>
            <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
              {stat}
            </StatNumber>
          </Box>
          <Box
            my={'auto'}
            color="#FFFFFF"
            alignContent={'center'}>
            {icon}
          </Box>
        </Flex>
      </Stat>
    );
  }
  
  export default function BasicStatistics() {
    return (
      <Box maxW="6x1" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 5 }}>
          <StatsCard
            title={'4'}
            stat={'Collections'}
            icon={<BsCollectionFill size={'4em'} />}
          />
          <StatsCard
            title={'80,000'}
            stat={'Value Locked'}
            icon={<IoLogoUsd size={'3.5em'} />}
          />
          <StatsCard
            title={'7'}
            stat={'NFT Minted'}
            icon={<RiNftFill size={'4em'} />}
          />
          <StatsCard
            title={'7'}
            stat={'Transactions'}
            icon={<RiTokenSwapFill size={'4em'} />}
          />
        </SimpleGrid>
      </Box>
    );
  }