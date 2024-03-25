import React from 'react';
import { Box, Text, Button, ButtonGroup, VStack, Image, SimpleGrid } from '@chakra-ui/react';
import { Avatar,Card, CardHeader, CardBody, CardFooter,Stack,Heading,Divider } from '@chakra-ui/react'
import { BiLike,BiChat,BiShare } from 'react-icons/bi'
import { FaShare } from 'react-icons/fa'
import { NFT1, Collection1, NFT2 } from './../data/typesgen';

//{idNFT, costNFT, ownerNFT, nameNFT, shortDescNFT, imageUrlNFT}:NFT1
//const NFTCard = ( {collection}:Collection1 ) => {
  //const handleMint = () => {
    // Lógica para acuñar el NFT
   // console.log("minteado");
  //};

  //return (
  //  <>
  //<SimpleGrid columns={4} spacing={5}>
  //{ collection.nfts.map((nft) => (
  //  <h6>{nft.nameNFT}</h6>
   ///////////////////AQUI VOY A PONER TODA LA IMPRESION DE CADA CARD
//<Card maxW='sm'>
 // <CardBody>
  //<Image boxSize='400px' src={nft.imageUrlNFT} alt={`NFT ${nft.idNFT}`} borderRadius='lg'/>
   // <Stack mt='6' spacing='3'>   
   //   <Heading size='md'><Text>{nft.nameNFT}</Text></Heading>
   //   <Text>{nft.shortDescNFT}</Text>
   //   <Text>ID: {nft.idNFT}</Text>
   //     <Text>Costo: {nft.costNFT}</Text>
   //     <Text>Propietario: {nft.ownerNFT.slice(0, 6)}...{nft.ownerNFT.slice(-4)}</Text>     
   // </Stack>    
  //</CardBody>
  //<Divider />
  //<CardFooter>
  //  <ButtonGroup spacing='2'>
   // <Button colorScheme="teal" variant="solid" onClick={handleMint}>
   //       Buy
   // </Button>
    //<Button flex='1' variant='ghost' leftIcon={<BiLike />}>
    //  Like
    //</Button>
    //<Button flex='1' variant='ghost' leftIcon={<FaShare />}>
    //  Share
    //</Button>
    
    //</ButtonGroup>
  //</CardFooter>
//</Card>
   ///////////////////AQUI TERMINA LA IMPRESION DE CADA CARD 
  //))}
//</SimpleGrid>
 // </>  
  //);
//};

const NFTCollection = ({ collection }:Collection1 ) => {
  return (
    <Box mb={8}>
      <Text fontSize="2xl" mb={4}>ID de Colección: {collection.idCollection}</Text>
      <Text fontSize="2xl" mb={4}>Nombre: {collection.nameCollection}</Text>
      <Text fontSize="2xl" mb={4}>Descripción: {collection.shortDescCollect}</Text>
         
    </Box>
  );
};
//<NFTCard collection={collection} />
//const NFTCollections = ({ collections }:Colecciones) => {
//  return (
//    <>
//      {collections.map((collection) => (
//        <NFTCollection key={collection.idCollection} collection={collection} />
//      ))}
//    </>
//  );
//};

export default NFTCollection;