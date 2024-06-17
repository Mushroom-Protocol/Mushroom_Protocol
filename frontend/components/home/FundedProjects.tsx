import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";  // Import Link from react-router-dom
import { Center, Box, Flex, Text, Image } from "@chakra-ui/react";
import PathNathera from "../../assets/PathNathera.jpg";
import biopolimero from "../../assets/biopolimero.jpg";
import SilkongProduct from "../../assets/SilkonkProduct.jpg";
import nanocouting from "../../assets/nanocouting.jpg";
import Natheralogo from "../../assets/Natheralogo.png";
import faviconico from "../../assets/Faviconico.png";
import CityFounders from "../../assets/CityFounders.jpg";
import Landoppicon from "../../assets/Landopp_icon.png";
import ReciqloLogo from "../../assets/ReciqloLogo.jpg";
import EONlogo from "../../assets/EONlogo.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FundedProjects: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
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
      imgSrc: biopolimero,
      logoSrc: Landoppicon,
      title: "Landopp",
      description: "Biopolymer developed with biomass",
      detail:
        "We develop alternative raw materials to plastic that come from the earth and return to it, respecting the environment, without toxics and 100% organic.",
      tag: "Green Tech",
      tagColor: "#64B344",
      link: "/landopp"
    },
    {
      imgSrc: CityFounders,
      logoSrc: faviconico,
      title: "Founders",
      description: "Driving the financial revolution in Biotech",
      detail:
        "The protocol enables global investors to fund biotech research by tokenizing it and using intellectual property as collateral.",
      tag: "Synthetic Tech",
      tagColor: "#4A1985",
      link: "/founders"
    },
    {
      imgSrc: SilkongProduct,
      logoSrc: ReciqloLogo,
      title: "Reciqlo",
      description: "Recycling today is caring for the future",
      detail:
        "Reciqlo is a company dedicated to the promotion and innovation of the recycling system, with the aim of moving towards a sustainable circular economy.",
      tag: "Green Tech",
      tagColor: "#64B344",
      link: "/reciqlo"
    },
    {
      imgSrc: PathNathera,
      logoSrc: Natheralogo,
      title: "Nathera",
      description: "Nanotherapy to improve well-being",
      detail:
        "The project is developing a treatment for musculoskeletal diseases such as arthrosis, low back pain, and rheumatoid arthritis using nanotechnology.",
      tag: "Health Tech",
      tagColor: "#1FAFC8",
      link: "/nathera"
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
      link: "/eon"
    },
  ];

  return (
    <Center>
      <Flex color="#FFFFFF" flexDirection="column" alignItems="center" position="relative" marginLeft="0px" marginTop="0px" width="100%">
        <Slider {...settings} style={{ width: '100%' }}>
          {projects.map((project, index) => (
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
              <Box position="relative" height="250px" width="100%">
                <Link to={project.link}>
                  <Image src={project.imgSrc} alt={`Main Image ${index + 1}`} objectFit="cover" borderRadius="8px 8px 0 0" height="100%" width="100%" />
                </Link>
              </Box>
              <Box display="flex" alignItems="center" mt="20px">
                <Image src={project.logoSrc} alt={`Secondary Image ${index + 1}`} borderRadius="10px" w="50px" h="50px" mr="10px" />
                <Text fontSize="25px">{project.title}</Text>
              </Box>
              <Text fontSize="22px" my="10px" textAlign="justify">
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
