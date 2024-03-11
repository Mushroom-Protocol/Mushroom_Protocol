import React, { useState } from "react";
import {
  Box,
  Center,
  Flex,
  Button,
  Text,
  Heading,
  Icon,
  useDisclosure,
  FormControl,
  FormLabel,
  Collapse,
  Input,
  Select,
  FormHelperText,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/react';
import { BsFillRocketTakeoffFill } from "react-icons/bs";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useCanister } from "@connect2ic/react";
// import {Industry} from "../../declarations/backend";


//--------------------- funciones para codificar y decodificar imagenes entre base64 y Blob -----------------
function base64ToBlob(dataUrl: String) {
  var base64Content = dataUrl.split(',')[1];  // Extraer el contenido codificado en base64 de la URL de datos
  var byteCharacters = atob(base64Content);   // Convertir el contenido base64 a un array de bytes (Uint8Array)
  var byteArray = new Uint8Array(byteCharacters.length);
  for (var i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }
  return byteArray;
};

function blobToBase64(buffer: Uint8Array) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
// -----------------------------------------------------------------------------------------------------------




const StartupForms = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [backend] = useCanister("backend");
  const toast = useToast();

  const [formData, setFormData] = useState({
    startUpName: "",
    email: "",
    website: "",
    startUpSlogan: "",
    shortDes: "",
    logo: null as File | null, // Asegúrate de proporcionar un array válido aquí
    status: "",
    tlr: 1,
    fullNameTl: "",
    specializationTL: "",
    linkedinTL: "",
    industry: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Solo toma el primer archivo, puedes ajustar según tus necesidades
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let loadingToastId: string | number | undefined;

    try {
      // Muestra un toast de carga con formato sólido y color azul
      loadingToastId = toast({
        title: 'Submitting Form',
        status: 'loading', // 'loading' es el status para el estilo de carga
        duration: null,
        isClosable: false,
        variant: 'solid',
      });

      // Filtra los campos opcionales antes de enviar al backend
      const formDataToSend = {
        ...formData,
        website: formData.website || "",
        startUpSlogan: formData.startUpSlogan || "", // Asigna un valor por defecto en caso de que sea null
        logo: [],
        tlr: parseInt(formData.tlr.toString())
      };

      // Intenta realizar la acción de envío
      const response = await backend.registerStartUp(
        {
          startUpName: formDataToSend.startUpName,
          email: formDataToSend.email,
          website: formDataToSend.website,
          startUpSlogan: formDataToSend.startUpSlogan,
          shortDes: formDataToSend.shortDes,
          logo: formData.logo ? base64ToBlob(await convertFileToBase64(formData.logo)) : null,
          startupStatus: formDataToSend.status,
          tlr: Number(formDataToSend.tlr),
          fullNameTl: formDataToSend.fullNameTl,
          specializationTL: formDataToSend.specializationTL,
          linkedinTL: formDataToSend.linkedinTL,
          industry: formDataToSend.industry,
          country: formDataToSend.country
        }
      );

      /*
      
        
        */

      // Cierra el toast de carga cuando la acción se completa
      if (loadingToastId !== undefined) {
        toast.close(loadingToastId);
      }

      // Muestra un toast de éxito con formato sólido y color verde
      toast({
        title: 'Successful Submission',
        description: 'Your form was submitted successfully.',
        status: 'success', // 'success' es el status para el estilo de éxito
        duration: 5000,
        isClosable: true,
        variant: 'solid',
      });

      console.log(response);
    } catch (error) {
      // Cierra el toast de carga cuando la acción falla
      if (loadingToastId !== undefined) {
        toast.close(loadingToastId);
      }

      // Muestra un toast de error con formato sólido y color rojo
      toast({
        title: 'Submission Error',
        description: 'There was an error submitting the form. Please try again.',
        status: 'error', // 'error' es el status para el estilo de error
        duration: 5000,
        isClosable: true,
        variant: 'solid',
      });

      console.error(error);
    }
  };

  return (
    <Center>
      <Flex direction="row" align="center" gap={5}>
        <Flex direction="column" align="center">

          <Button
            as={Flex}
            direction="row"
            alignItems="center"
            bg="#000000"
            borderColor="#1FAFC8"
            borderWidth="1px"
            p={10}
            boxShadow="sm"
            width="230px"
            size="lg"
            borderRadius="20px"
            fontSize="16px"
            _hover={{ bg: '#1FAFC8' }}
            _active={{ bg: '#1FAFC8' }}
            onClick={onToggle}
          >
            <Icon as={BsFillRocketTakeoffFill} boxSize={12} marginRight={6} />
            <Box>
              <Text fontWeight="bold" fontSize="lg" color="white">
                Start-Up
              </Text>
              <Text fontWeight="bold" fontSize="lg" color="#737373">
                Registration
              </Text>
            </Box>
          </Button>

          <Collapse in={isOpen} animateOpacity>

            <Box
              p="60px"
              color="white"
              mt="4"
              bg="#000000"
              borderWidth="1px"
              rounded="lg"
            >
              <Heading>Start-Up Registration Form</Heading>
              <Text>*Form open to established startups and research that are taking the first steps towards a startup.</Text>
              <br />
              <form onSubmit={handleSubmit}>

                <FormControl isRequired>
                  <FormLabel>Start-Up Name</FormLabel>
                  <Input id="startupName" name="startUpName" value={formData.startUpName} onChange={handleChange} placeholder="Brand Name" />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Email</FormLabel>
                  <Input id="emailCompany" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Website or Social Media Profile</FormLabel>
                  <Input id="Website" name="website" value={formData.website} onChange={handleChange} placeholder="Website/Profile URL" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Startup Slogan</FormLabel>
                  <Input id="startupSlogan" name="startUpSlogan" value={formData.startUpSlogan} onChange={handleChange} placeholder="e.g. Biotechnology for Life" />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Short Description</FormLabel>
                  <Input id="shortDes" name="shortDes" value={formData.shortDes} onChange={handleChange} placeholder="Describe what your startup does in a paragraph" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Upload Logo</FormLabel>
                  <Input
                    id="uploadLogo"
                    name="logo"
                    onChange={handleChange}
                    type="file"
                    accept="image/*" // Asegura que solo se puedan seleccionar archivos de imagen
                  />
                  <FormHelperText>Recommended size 200x200 px</FormHelperText>
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Startup Status</FormLabel>
                  <Select id="startupStatus" name="startupStatus" value={formData.status} onChange={handleSelectChange} placeholder="Select status">
                    <option value="ResearchStage" selected>Research stage</option>
                    <option value="EarlyStartUp">Early Start-Up</option>
                    <option value="PreSeed" >Pre-seed</option>
                    <option value="Seed">Seed</option>
                  </Select>
                </FormControl>

                {/* Campo para Madurez tecnológica */}
                <FormControl isRequired mt={4}>
                  <FormLabel>Technology Readiness Level (TRL)</FormLabel>
                  <Select id="tlr" name="tlr" value={formData.tlr} onChange={handleSelectChange} placeholder="Select TRL">
                    <option value="1" selected>TRL-1: Basic principles</option>
                    <option value="2">TRL-2: Technology concept formulated</option>
                    <option value="3">TRL-3: Experimental proof of concept</option>
                    <option value="4">TRL-4: Technology validated in lab</option>
                    <option value="5">TRL-5: Technology validated in relevant environment</option>
                    <option value="6">TRL-6 or higher</option>
                  </Select>
                  <FormHelperText>
                    Please describe the TRL level for your technology.
                  </FormHelperText>
                </FormControl>

                {/* Campo para Nombre del representante o team leader */}
                <FormControl isRequired mt={4}>
                  <FormLabel>Full Name of Legal Representative / Team Leader</FormLabel>
                  <Input id="fullNameTL" name="fullNameTl" value={formData.fullNameTl} onChange={handleChange} placeholder="Full Name" />
                </FormControl>

                {/* Campo para Detalles del representante o team leader */}
                <FormControl isRequired mt={4}>
                  <FormLabel>Specialization Legal Representative / Team Leader</FormLabel>
                  <Input id="specializationTL" name="specializationTL" value={formData.specializationTL} onChange={handleChange} placeholder="Specialization" />
                </FormControl>

                {/* Campo para Perfil de Linkedin o similar */}
                <FormControl isRequired mt={4}>
                  <FormLabel>LinkedIn Profile of Legal Representative / Team Leader</FormLabel>
                  <Input id="linkedinTL" name="linkedinTL" value={formData.linkedinTL} onChange={handleChange} placeholder="LinkedIn Profile URL" />
                </FormControl>

                {/* Campo para Industria / sector productivo */}
                <FormControl isRequired mt={4}>
                  <FormLabel>Industry / Productive Sector</FormLabel>
                  <Select id="industry" name="industry" onChange={handleSelectChange} placeholder="Select Industry">
                    <option value="HealthTech" selected>HealthTech</option>
                    <option value="Agri-FoodTech">Agri-foodTech</option>
                    <option value="GreenTech">GreenTech</option>
                    <option value="SyntheticTech">SyntheticTech</option>
                    <option value="MiningTech">MiningTech</option>
                  </Select>
                </FormControl>

                {/* Campo para País de origen */}
                <FormControl isRequired mt={4}>
                  <FormLabel>Country of Origin</FormLabel>
                  <Select id="country" name="country" value={formData.country} onChange={handleSelectChange}>
                    <option value="ar">Argentina</option>
                    <option value="bo">Bolivia</option>
                    <option value="br">Brasil</option>
                    <option value="cl">Chile</option>
                    <option value="co">Colombia</option>
                    <option value="cr">Costa Rica</option>
                    <option value="cu">Cuba</option>
                    <option value="do">República Dominicana</option>
                    <option value="ec">Ecuador</option>
                    <option value="sv">El Salvador</option>
                    <option value="gt">Guatemala</option>
                    <option value="hn">Honduras</option>
                    <option value="mx">México</option>
                    <option value="ni">Nicaragua</option>
                    <option value="pa">Panamá</option>
                    <option value="py">Paraguay</option>
                    <option value="pe">Perú</option>
                    <option value="pr">Puerto Rico</option>
                    <option value="uy">Uruguay</option>
                    <option value="ve">Venezuela</option>
                    {/* Agregar más países según sea necesario */}
                  </Select>
                </FormControl>

                <Button type="submit" mt={4} colorScheme="teal">
                  Submit
                </Button>
              </form>
            </Box>
          </Collapse>
        </Flex>
        <Flex direction="column" align="center">
          <Tooltip label="The information you enter in this form will be published for the sponsors." textColor="#FFFFFF" bg="#000000" fontSize="md" placement="right-start">
            <Box>
              <IoInformationCircleOutline size={25} color="#737373" />
            </Box>
          </Tooltip>
        </Flex>
      </Flex>
    </Center>
  );
};

export default StartupForms;
