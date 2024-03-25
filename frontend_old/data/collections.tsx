
//import { Collection1 } from './typesgen';
type NFT1 = {
  idNFT: number;
  nameNFT: string;
  shortDescNFT: string;
  costNFT: number;
  ownerNFT: string;
  imageUrlNFT: string;
};

type Collection1 = {
collection:
{  
idCollection: number;
nameCollection: string;
shortDescCollect: string;
imgCollection: string;
nfts: NFT1[];
}
};

const micollection: Collection1[] = [
    {
      collection:
       {
            idCollection: 1,
            nameCollection: 'Células Guerreras',
            shortDescCollect: 'Esta es la primera colección del proyecto Nathera',
            imgCollection: '../assets/Nathera-logo.png',
            nfts: [
              {
                idNFT: 1,
                nameNFT:'Célula Guerrera 01',
                shortDescNFT:'Esta es una célula Guerrera 01',
                costNFT: 3,
                ownerNFT: '0x1234...5678',
                imageUrlNFT: '../assets/boceto02.jpg'
              },
              {
                idNFT: 2,
                nameNFT:'Célula Guerrera 02',
                shortDescNFT:'Esta es una célula Guerrera 02',
                costNFT: 1,
                ownerNFT: '0x1234...5678',
                imageUrlNFT: '../assets/boceto03.jpg'
              },
              {
                idNFT: 3,
                nameNFT:'Célula Guerrera 03',
                shortDescNFT:'Esta es una célula Guerrera 03',
                costNFT: 2,
                ownerNFT: '0x1234...5678',
                imageUrlNFT: '../assets/boceto04.jpg'
              },
              {
                idNFT: 4,
                nameNFT:'Célula Guerrera 04',
                shortDescNFT:'Esta es una célula Guerrera 04',
                costNFT: 3,
                ownerNFT: '0x1234...5678',
                imageUrlNFT: '../assets/boceto05.jpg'
              },
              {
                idNFT: 5,
                nameNFT:'Célula Guerrera 05',
                shortDescNFT:'Esta es una célula Guerrera 05',
                costNFT: 3,
                ownerNFT: '0x1234...5678',
                imageUrlNFT: '../assets/boceto06.jpg'
              },
              {
                idNFT: 6,
                nameNFT:'Célula Guerrera 06',
                shortDescNFT:'Esta es una célula Guerrera 06',
                costNFT: 3,
                ownerNFT: '0x1234...5678',
                imageUrlNFT: '../assets/boceto07.jpg'
              },
              // Más NFTs...
            ]
       }      
    },
    // Más colecciones...
  ];
  export default micollection;