import React, { useContext, useState } from "react"
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
  Textarea,
  InputGroup,
  InputRightElement,
  Tooltip,
  useToast,
} from "@chakra-ui/react"
import { MdBiotech } from "react-icons/md"
import { IoInformationCircleOutline } from "react-icons/io5"
import { useCanister } from "@connect2ic/react"
import { EstadoContext } from "../utils/estadoContex"
import { getRoleStartup } from "../CommonHelpers"

const ProyectForms = () => {
  const [backend] = useCanister("backend")
  const { currentUser, setCurrentUser } = useContext(EstadoContext)
  const [extractedRolesStartup, setExtractedRolesStartup] = useState<string[]>()
  const { isOpen, onToggle } = useDisclosure()
  const toast = useToast()

  const [formData, setFormData] = useState({
    projectTitle: "",
    problemSolving: "",
    yoursolution: "",
    impact: "",
    productStatus: "",
    fundsRequired: "",
    projectDuration: "",
    implementation: "",
    milestones: "",
    budget: "",
    team: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let loadingToastId: string | number | undefined
    try {
      // Muestra un toast de carga con formato sólido y color azul
      loadingToastId = toast({
        title: "Submitting Form",
        status: "loading", // 'loading' es el status para el estilo de carga
        duration: null,
        isClosable: false,
        variant: "solid",
      })

      const formDataToSend = {
        ...formData,
        fundsRequired: parseInt(formData.fundsRequired),
        projectDuration: parseInt(formData.projectDuration),
        milestones: formData.milestones.split(","),
        budget: [formData.budget],
        startupID: getRoleStartup(currentUser.roles)[0],
        coverImage: [],
        team: formData.team.split(","),
      }
      const response: string = (await backend.registerProject(
        formDataToSend,
      )) as string

      // Cierra el toast de carga cuando la acción se completa
      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      if (response?.includes("project was successfully submitted")) {
        toast({
          title: "Successful Submission",
          description: response,
          status: "success", // 'success' es el status para el estilo de éxito
          duration: 5000,
          isClosable: true,
          variant: "solid",
        })
      } else {
        toast({
          title: "Submission Error",
          description: response,
          status: "error", // 'success' es el status para el estilo de éxito
          duration: 5000,
          isClosable: true,
          variant: "solid",
        })
      }
    } catch (error) {
      // Cierra el toast de carga cuando la acción falla
      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      // Muestra un toast de error con formato sólido y color rojo
      toast({
        title: "Submission Error",
        description:
          "There was an error submitting the form. Please try again.",
        status: "error", // 'error' es el status para el estilo de error
        duration: 5000,
        isClosable: true,
        variant: "solid",
      })

      console.error(error)
    }
  }

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
            _hover={{ bg: "#1FAFC8" }}
            _active={{ bg: "#1FAFC8" }}
            onClick={onToggle}
          >
            <Icon as={MdBiotech} boxSize={14} marginRight={4} />
            <Box>
              <Text fontWeight="bold" fontSize="lg" color="white">
                Project
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
              <Heading>Proyect Registration Form</Heading>
              <Text>*Register your research project.</Text>
              <br />
              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <FormLabel>Project Title</FormLabel>
                  <Input
                    id="projectTitle"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    placeholder="Describe what you want to do in one sentence"
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Problem Solving</FormLabel>
                  <Input
                    id="problemSolving"
                    name="problemSolving"
                    value={formData.problemSolving}
                    onChange={handleChange}
                    placeholder="How and how many people does it affect?"
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Your solution</FormLabel>
                  <Input
                    id="yoursolution"
                    name="yoursolution"
                    value={formData.yoursolution}
                    onChange={handleChange}
                    placeholder="What do they do and how do they do it?"
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Impact</FormLabel>
                  <Input
                    id="impact"
                    name="impact"
                    value={formData.impact}
                    onChange={handleChange}
                    placeholder="What will be the impact of your solution?"
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Product Status</FormLabel>
                  <Select
                    id="productStatus"
                    name="productStatus"
                    value={formData.productStatus}
                    onChange={handleSelectChange}
                    placeholder="Select Status"
                  >
                    <option value="ResearchPhase" selected>
                      Research Phase
                    </option>
                    <option value="ProductPrototype">Product Prototype</option>
                    <option value="EarlyAdoption">Early Adoption</option>
                    <option value="BusinessModelValidation">
                      Business Model Validation
                    </option>
                    <option value="Product-Market Fit">
                      Product-Market Fit
                    </option>
                  </Select>
                </FormControl>

                {/* Campo para Nombre del representante o team leader */}
                <FormControl isRequired mt={4}>
                  <FormLabel>Funds required</FormLabel>
                  <Input
                    id="fundsRequired"
                    name="fundsRequired"
                    value={formData.fundsRequired}
                    onChange={handleChange}
                    placeholder="Amount in $USD"
                  />
                </FormControl>

                {/* Campo para Detalles del representante o team leader */}
                <FormControl isRequired mt={4}>
                  <FormLabel>Project Duration</FormLabel>
                  <Input
                    id="projectDuration"
                    name="projectDuration"
                    value={formData.projectDuration}
                    onChange={handleChange}
                    placeholder="Type a number from 12 to 24 (months)"
                  />
                </FormControl>

                {/* Campo para Perfil de Linkedin o similar */}
                <FormControl isRequired mt={4}>
                  <FormLabel>Implementation Plan</FormLabel>
                  <Input
                    id="implementation"
                    name="implementation"
                    value={formData.implementation}
                    onChange={handleChange}
                    placeholder="Objectives to be achieved during the project"
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Milestones</FormLabel>
                  <Input
                    id="milestones"
                    name="milestones"
                    value={formData.milestones}
                    onChange={handleChange}
                    placeholder="2-3 milestones indicating the expected value and date."
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Budget</FormLabel>
                  <Input
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="Allocate percentage of resources."
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Team</FormLabel>
                  <Input
                    id="team"
                    name="team"
                    value={formData.team}
                    onChange={handleChange}
                    placeholder="List all team members, positions, specialty and LinkedIn."
                  />
                </FormControl>
                <Button type="submit" mt={4} colorScheme="teal">
                  Submit
                </Button>
              </form>
            </Box>
          </Collapse>
        </Flex>
        <Flex direction="column" align="center">
          <Tooltip
            label="Your startup must be registered on the platform and have been approved in order to complete this form."
            textColor="#FFFFFF"
            bg="#000000"
            fontSize="md"
            placement="right-start"
          >
            <Box>
              <IoInformationCircleOutline size={25} color="#737373" />
            </Box>
          </Tooltip>
        </Flex>
      </Flex>
    </Center>
  )
}

export default ProyectForms
