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
import { ProjectCard } from "../CommonTypes";
import { useCanister } from "@connect2ic/react";
import { getProjectsPreview } from "../CommonHelpers";

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
    
    getProjectsInfo(backend).then(resProjectsInfo => {
      console.log({resProjectsInfo})
      const buildedStartups = resProjectsInfo.map(projectInfo => {
        console.log({projectInfo})
        return {
          imgSrc: Mushroomfounders,
          logoSrc: Mushroomfounders,
          startUpName: projectInfo.startupName,
          shortDes: projectInfo.projectTitle,
          story: projectInfo.problemSolving,
          status: projectInfo.collectionCanisterId.length > 0,
          opendate: "17.11.24",
          closedate: "17.12.24",
          badgeSrc: [Mushroomfounders], // Array de insignias
          owner: String(projectInfo.owner),
          // url: startUpInfo[0].website // Ruta específica para este startup
          url: "/Project/" + projectInfo.pojectID
        }
      })
      console.log({buildedStartups})
      setIncomingCollectionsRequests(buildedStartups);
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
          {incomingCollectionsRequests.map((collection, index) => {
            console.log({collection})
            console.log({index})
            return <Box
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
          })}
        </Slider>
      </Flex>
    </Center>
  );
};

export default LaunchpadNFT;
