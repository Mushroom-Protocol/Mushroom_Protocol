import React from "react";
import Slider from "react-slick";
import { Center, Box, Flex, Text, Image } from "@chakra-ui/react";
import PathNathera from "../../assets/PathNathera.jpg";
import biopolimero from "../../assets/biopolimero.jpg";
import nanocouting from "../../assets/nanocouting.jpg";
import Natheralogo from "../../assets/Natheralogo.png";
import Landoppicon from "../../assets/Landopp_icon.png";
import EONlogo from "../../assets/EONlogo.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FundedProjects: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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

  const projects = [
    {
      imgSrc: PathNathera,
      logoSrc: Natheralogo,
      title: "Nathera",
      description: "Nanotherapy to improve well-being",
      detail:
        "The project is developing a treatment for musculoskeletal diseases such as arthrosis, low back pain, and rheumatoid arthritis using nanotechnology.",
      tag: "Health Tech",
      tagColor: "#1FAFC8",
    },
    {
      imgSrc: biopolimero,
      logoSrc: Landoppicon,
      title: "Landopp",
      description: "Biopolymer developed with biomass",
      detail:
        "We develop alternative raw materials to plastic that come from the earth and return to it, respecting the environment, without toxics and 100% organic.",
      tag: "Green Tech",
      tagColor: "#64B344",
    },
    {
      imgSrc: nanocouting,
      logoSrc: EONlogo,
      title: "EON",
      description: "Extends the shelf life of food",
      detail:
        "Every year, tons of food are wasted during export and transportation. EON develops a coating to extend the shelf life of food.",
      tag: "Agro Tech",
      tagColor: "#EA332B",
    },
  ];

  return (
    <Center>
      <Flex color="#FFFFFF" flexDirection="column" alignItems="center" position="relative" marginLeft="0px" width="100%">
        <Slider {...settings} style={{ width: '100%' }}>
          {projects.map((project, index) => (
            <Box
              key={index}
              border="1px solid #1FAFC8"
              borderRadius="8px"
              minWidth="340px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              p="20px"
              textAlign="center"
              m="10px"
              backgroundColor="#000000"
              color="#FFFFFF"
            >
              <Image src={project.imgSrc} alt={`Main Image ${index + 1}`} w="250px" h="250px" />
              <Box display="flex" alignItems="center" mt="20px">
                <Image src={project.logoSrc} alt={`Secondary Image ${index + 1}`} w="50px" h="50px" mr="10px" />
                <Text fontSize="25px">{project.title}</Text>
              </Box>
              <Text fontSize="22px" my="10px">
                {project.description}
              </Text>
              <Text fontSize="16px" color="#CCCCCC" textAlign="justify" my="10px">
                {project.detail}
              </Text>
              <Text
                fontSize="16px"
                backgroundColor={project.tagColor}
                color="#000000"
                p="8px"
                borderRadius="8px"
                mt="20px"
              >
                {project.tag}
              </Text>
            </Box>
          ))}
        </Slider>
      </Flex>
    </Center>
  );
};

export default FundedProjects;
