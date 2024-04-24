import React, { useEffect, useState } from "react"
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
  CheckboxGroup,
  FormLabel,
  Collapse,
  Input,
  Checkbox,
  Tooltip,
  useToast,
} from "@chakra-ui/react"
import { AiFillPicture } from "react-icons/ai"
import { IoInformationCircleOutline } from "react-icons/io5"
import { useCanister, useConnect } from "@connect2ic/react"
import { getRoleStartup } from "../CommonHelpers"
import { UserType, initialStateUser } from "../CommonTypes"

const ColecctionForm = () => {
  const [backend] = useCanister("backend")
  const { isConnected } = useConnect()
  const [user, setUser] = useState<UserType>()
  const [userRoleStartups, setUserRoleStartups] = useState<string[]>()
  const [projectsByStartup, setProjectsByStartup] = useState<string[]>()
  const { isOpen, onToggle } = useDisclosure()
  const toast = useToast()

  interface FormData {
    collectionName: string
    shortStorytelling: string
    storytellingCollection: string
    totalSupply: string
    // totalSupply: number
    // totalSupply: bigint
    distribution: any[]
    utilities: any[]
    tokenPrice: string
    // tokenPrice: number
    // tokenPrice: bigint
    documentsFolderUrl: string
    typesImages: string
    nftImagesUrl: string
    creator: string
    // collectionStatus: string
  }

  const initialFormData: FormData = {
    collectionName: "",
    shortStorytelling: "",
    storytellingCollection: "",
    totalSupply: "",
    // totalSupply: 0,
    // totalSupply: BigInt(0),
    distribution: [],
    utilities: [],
    tokenPrice: "",
    // tokenPrice: 0,
    // tokenPrice: BigInt(0),
    documentsFolderUrl: "",
    typesImages: "",
    nftImagesUrl: "",
    creator: "",
    // collectionStatus: "",
  }

  const [formData, setFormData] = useState<FormData>(initialFormData)

  /*const [formData, setFormData] = useState({
    collectionName: "",
    shortStorytelling: "",
    storytellingCollection: "",
    totalSupply: "",
    distribution: "",
    utilities: [], // 
    tokenPrices: "",
    documents: "",
    typesImages: "",
    nftImages: "",
    creator: "",
    collectionStatus: "",
  });*/

  useEffect(() => {
    const getMyUser = async () => {
      const myUser = await backend.getMyUser()
      return myUser as UserType[]
    }

    isConnected
      ? getMyUser().then((responseUser) => {
          if (responseUser.length > 0) {
            setUser(responseUser[0] as UserType)
            const extractedRoleStartups: string[] = getRoleStartup(
              responseUser[0].roles,
            )
            setUserRoleStartups(extractedRoleStartups)
            getProjectsByStartup(extractedRoleStartups[0])
          }
        })
      : setUser(initialStateUser)
  }, [isConnected])

  const getProjectsByStartup = async (startupId: string): Promise<string[]> => {
    const resGetProjectsByStartup: string[] =
      (await backend.getProjectsByStartup(startupId)) as string[]
    const resGetProjectsByStartupFlatted: string[] =
      resGetProjectsByStartup.flat()
    setProjectsByStartup(resGetProjectsByStartupFlatted)
    return resGetProjectsByStartupFlatted
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (checkedValues: string[]) => {
    setFormData({
      ...formData,
      utilities: checkedValues,
    })
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
        startupID: getRoleStartup(user.roles)[0],
        pojectID: projectsByStartup[0],
        typesImages: {PNG: null},
        // totalSupply: parseInt(formData.totalSupply),
        // tokenPrice: parseInt(formData.tokenPrice),
        totalSupply: BigInt(parseInt(formData.totalSupply)),
        tokenPrice: BigInt(parseInt(formData.tokenPrice)),
        // totalSupply: BigInt(formData.totalSupply),
        // tokenPrice: BigInt(formData.tokenPrice),
        distribution: [{category: "PublicSale", percentage: 30.25}],
        utilities: [{Governance: null}],
      }
      const resCreateCollection = await backend.createCollection(formDataToSend)
      console.log("resCreateCollection")
      console.log(resCreateCollection)

      // Cierra el toast de carga cuando la acción se completa
      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      // Muestra un toast de éxito con formato sólido y color verde
      toast({
        title: "Successful Submission",
        description: "Your form was submitted successfully.",
        status: "success", // 'success' es el status para el estilo de éxito
        duration: 5000,
        isClosable: true,
        variant: "solid",
      })
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
            <Icon as={AiFillPicture} boxSize={12} marginRight={6} />
            <Box>
              <Text fontWeight="bold" fontSize="lg" color="white">
                Collection
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
              <Heading>Collection Register Form</Heading>
              <Text>
                *Enlists a collection of IP-NFTs and accesses fundraising in a
                decentralized fashion.
              </Text>
              <br />
              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <FormLabel>Collection Name</FormLabel>
                  <Input
                    id="collectionName"
                    name="collectionName"
                    value={formData.collectionName}
                    onChange={handleChange}
                    placeholder="Collection fantasy name"
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Short Storytelling</FormLabel>
                  <Input
                    id="shortStorytelling"
                    name="shortStorytelling"
                    value={formData.shortStorytelling}
                    onChange={handleChange}
                    placeholder="Short Storytelling Description"
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Storytelling Collection</FormLabel>
                  <Input
                    id="storytellingCollection"
                    name="storytellingCollection"
                    value={formData.storytellingCollection}
                    onChange={handleChange}
                    placeholder="Detailed Story Collection"
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Total Supply</FormLabel>
                  <Input
                    id="totalSupply"
                    name="totalSupply"
                    // type="number"
                    value={formData.totalSupply}
                    onChange={handleChange}
                    placeholder="Tokenomics: Total number of tokens issued"
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Distribution</FormLabel>
                  <Input
                    id="distribution"
                    name="distribution"
                    value={formData.distribution}
                    onChange={handleChange}
                    placeholder="Tokenomics: Percentage or amount of tokens assigned to each item"
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Utilities</FormLabel>
                  <CheckboxGroup
                    colorScheme="teal" // ajusta según tus preferencias
                    value={formData.utilities}
                    onChange={handleCheckboxChange}
                  >
                    <Checkbox value="Governance">Governance</Checkbox>
                    <br />
                    <Checkbox value="IPNFT">IP-NFT</Checkbox>
                    <br />
                    <Checkbox value="Membership">Membership</Checkbox>
                    <br />
                    <Checkbox value="DeFiServices">DeFi Services</Checkbox>
                    {/* Agrega más opciones según sea necesario */}
                  </CheckboxGroup>
                </FormControl>

                {/* Campo para Nombre del representante o team leader */}
                <FormControl isRequired mt={4}>
                  <FormLabel>Token Price</FormLabel>
                  <Input
                    id="tokenPrice"
                    name="tokenPrice"
                    // type="number"
                    value={formData.tokenPrice}
                    onChange={handleChange}
                    placeholder="Amount in $USD"
                  />
                </FormControl>

                {/* Campo para Detalles del representante o team leader */}
                <FormControl isRequired mt={4}>
                  <FormLabel>Documents to be tokenized</FormLabel>
                  <Input
                    id="documentsFolderUrl"
                    name="documentsFolderUrl"
                    value={formData.documentsFolderUrl}
                    onChange={handleChange}
                    placeholder="Upload documents"
                  />
                </FormControl>

                {/* Campo para Perfil de Linkedin o similar */}
                <FormControl isRequired mt={4}>
                  <FormLabel>Type of images</FormLabel>
                  <Input
                    id="typesImages"
                    name="typesImages"
                    value={formData.typesImages}
                    onChange={handleChange}
                    placeholder="Full images o Generated programmatically"
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Upload images</FormLabel>
                  <Input
                    id="nftImagesUrl"
                    name="nftImagesUrl"
                    value={formData.nftImagesUrl}
                    onChange={handleChange}
                    placeholder="Load full images or attributes."
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Creator</FormLabel>
                  <Input
                    id="creator"
                    name="creator"
                    value={formData.creator}
                    onChange={handleChange}
                    placeholder="Name, nickname or entity of the creator of the collection."
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
            label="Your Startup and R&D Project must be registered on the platform and have been approved in order to complete this form."
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

export default ColecctionForm
