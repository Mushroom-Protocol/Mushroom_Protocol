export type NFT1 = {
                idNFT: number;
                nameNFT: string;
                shortDescNFT: string;
                costNFT: number;
                ownerNFT: string;
                imageUrlNFT: string;
  };
  
  export type Collection1 = {
    collection:
    {  
        idCollection: number;
        nameCollection: string;
        shortDescCollect: string;
        imgCollection: string;
        nfts: NFT1[];
    }
  };
  
  export type NFT2 = {
    nft: {
    idNFT: number;
    nameNFT: string;
    shortDescNFT: string;
    costNFT: number;
    ownerNFT: string;
    imageUrlNFT: string;
    }
};

