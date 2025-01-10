import React, { useEffect, useState } from "react";
import { Box, Text, Image, Button, Center, Flex, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Mushroomfounders from "../../assets/Mushroomfounders.gif";
import faviconico from "../../assets/Faviconico.png";
import GreenTech from "../../assets/GreenTech.png";
import FoodTech from "../../assets/FoodTech.png";
import HealthTech from "../../assets/HealthTech.png";
import SyntheticTech from "../../assets/SyntheticTech.png";
import Natheralogo from "../../assets/Natheralogo.png";
import CityFounders from "../../assets/CityFounders.jpg";
import Silkongv1 from "../../assets/SilkongV1.jpg";
import EONNFTV1 from "../../assets/EONNFTV1.jpg";
import Landoppicon from "../../assets/Landopp_icon.png";
import Landoppnft01 from "../../assets/Landoppnft01.mp4"; // Importar el video aquí
import NatheraNFTv1 from "../../assets/NatheraNFTv1.jpg";
import ReciqloLogo from "../../assets/ReciqloLogo.jpg";
import EONlogo from "../../assets/EONlogo.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProjectCard, Startup, StartupCard } from "../CommonTypes";
import { useCanister } from "@connect2ic/react";
import { getProjectsPreview, getStartUpByID, getStartUpsPreview } from "../CommonHelpers";

const LaunchpadNFT: React.FC = () => {
  const navigate = useNavigate();
  const [incomingCollectionsRequests, setIncomingCollectionsRequests] = useState<any[]>([]);
  const [backend] = useCanister("backend")

  useEffect(() => {
    const getProjectsInfo = async (backend: any): Promise<ProjectCard[]> => {
      const projectCards: ProjectCard[] = await getProjectsPreview(backend)
      console.log({projectCards})
      const projectsWithCanister: ProjectCard[] = projectCards.filter(projectCard => projectCard.collectionCanisterId.length > 0)
      console.log({projectsWithCanister})
      return projectsWithCanister
    }
    
    // Datos hardcodeados para prueba
    const hardcodedData = [
      // {
      //   imgSrc: Mushroomfounders,
      //   logoSrc: faviconico,
      //   startUpName: "Mushroom Founders",
      //   shortDes: "Mushroom Founders",
      //   story: "Alien race of mushrooms traveling the universe, founding civilizations and decentralizing science and technology.",
      //   status: "Active",
      //   opendate: "12.06.24",
      //   closedate: "12.08.24",
      //   badgeSrc: [SyntheticTech], // Array de insignias
      //   owner: "Owner1",
      //   url: "/founders" // Ruta específica para este startup
      // },
      // {
      //   imgSrc: Landoppnft01, // Utilizando el video Landoppnft01 directamente
      //   logoSrc: Landoppicon,
      //   startUpName: "Landopp",
      //   shortDes: "NoPlas",
      //   story: "Mysterious Organic Gems from sacred plants, can fuse with elements, regenerate, and create strong, flexible matter in harmony with nature.",
      //   status: "Coming Soon",
      //   opendate: "31.07.24",
      //   closedate: "31.09.24",
      //   badgeSrc: [GreenTech, FoodTech], // Array de insignias
      //   owner: "Owner2",
      //   url: "/landopp" // Ruta específica para este startup
      // },
      // {
      //   imgSrc: Silkongv1,
      //   logoSrc: ReciqloLogo,
      //   startUpName: "Reciqlo",
      //   shortDes: "Reciqlo",
      //   story: "Stellar gorillas who guard the healing power of silicon. These extraordinary beings act as powerful regenerators of planets throughout the universe.",
      //   status: "Coming Soon",
      //   opendate: "31.09.24",
      //   closedate: "31.11.24",
      //   badgeSrc: [GreenTech, SyntheticTech], // Array de insignias
      //   owner: "Owner3",
      //   url: "/reciqlo" // Ruta específica para este startup
      // },
      // {
      //   imgSrc: NatheraNFTv1,
      //   logoSrc: Natheralogo,
      //   startUpName: "Nathera",
      //   shortDes: "Warriors Cells",
      //   story: "A powerful army of fibroblasts uses its potent nanofilaments to accelerate tissue regeneration, a medical breakthrough pioneered in the galaxy.",
      //   status: "Coming Soon",
      //   opendate: "17.10.24",
      //   closedate: "17.11.24",
      //   badgeSrc: [HealthTech], // Array de insignias
      //   owner: "Owner4",
      //   url: "/nathera" // Ruta específica para este startup
      // },
      // {
      //   imgSrc: EONNFTV1,
      //   logoSrc: EONlogo,
      //   startUpName: "EON",
      //   shortDes: "Broccoli Pickers",
      //   story: "Plant creatures genetically created in the laboratory to collect garbage and clean the city, symbols of hope.",
      //   status: "Coming Soon",
      //   opendate: "17.11.24",
      //   closedate: "17.12.24",
      //   badgeSrc: [FoodTech], // Array de insignias
      //   owner: "Owner5",
      //   url: "/eon" // Ruta específica para este startup
      // },
    ];

    // setIncomingCollectionsRequests(hardcodedData);
    getProjectsInfo(backend).then(resProjectsInfo => {
      const buildedStartups = resProjectsInfo.map(projectInfo => {
        return {
          imgSrc: Mushroomfounders,
          logoSrc: Mushroomfounders,
          startUpName: projectInfo[0].startUpName,
          shortDes: projectInfo[0].projectTitle,
          story: projectInfo[0].problemSolving,
          status: projectInfo[0].startupStatus,
          opendate: "17.11.24",
          closedate: "17.12.24",
          badgeSrc: [Mushroomfounders], // Array de insignias
          owner: String(projectInfo[0].owner),
          // url: startUpInfo[0].website // Ruta específica para este startup
          url: "/Project/" + projectInfo[0].pojectID
        }
      })
      const concatenatedData = hardcodedData.concat(buildedStartups)
      setIncomingCollectionsRequests(concatenatedData);
    }).catch(error => console.error(error))
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 50000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (incomingCollectionsRequests.length === 0) {
    return (
      <Center>
        <Text>No collections available at the moment.</Text>
      </Center>
    );
  }

  return (
    <Center>
      <Flex color="#FFFFFF" flexDirection="column" alignItems="center" position="relative" marginLeft="0px" marginTop="0px" width="100%">
        <Slider {...settings} style={{ width: '100%' }}>
          {incomingCollectionsRequests.map((collection, index) => (
            <Box
              key={index}
              border="1px solid #1E1E1E"
              borderRadius="8px"
              minWidth="340px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              p="25px"
              textAlign="center"
              m="0px"
              backgroundColor="#000000"
              color="#FFFFFF"
            >
              <Center>
                {collection.startUpName === "Landopp" ? (
                  <video
                    src={collection.imgSrc} // Utilizando imgSrc para el video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      borderRadius: "10px",
                      objectFit: "cover",
                      width: "250px",
                      height: "300px",
                    }}
                  />
                ) : (
                  <Image src={collection.imgSrc} alt={collection.startUpName} w="250px" h="300px" borderRadius="10px" />
                )}
              </Center>
              <Box display="flex" alignItems="center" mt="20px">
                <Image src={collection.logoSrc} alt={collection.startUpName + " logo"} borderRadius="10px" w="50px" h="50px" mr="10px" />
                <Text fontSize="25px">{collection.shortDes}</Text>
              </Box>
              <Text fontSize="18px" my="10px" textAlign="justify">
                {collection.story}
              </Text>
              <Text fontSize="16px" color="gray.500" my="10px" textAlign="justify">
                Status: {collection.status}
                <br />
                Date: {collection.opendate} / {collection.closedate}
              </Text>
              <Flex justifyContent="space-between" alignItems="center" mt="20px" width="100%">
                <HStack spacing="10px">
                  {collection.badgeSrc.map((badge, badgeIndex) => (
                    <Image key={badgeIndex} src={badge} alt={`Badge ${badgeIndex}`} w="50px" h="50px" />
                  ))}
                </HStack>
                <Button
                  colorScheme="teal"
                  backgroundColor="#1FAFC8"
                  variant="solid"
                  color="#000000"
                  fontSize="xl"
                  borderRadius="5px"
                  _hover={{ bg: "#01B994" }}
                  onClick={() => navigate(collection.url)}
                >
                  Explore Collection
                </Button>
              </Flex>
            </Box>
          ))}
        </Slider>
      </Flex>
    </Center>
  );
};

export default LaunchpadNFT;
