import React, { useContext, useEffect, useState } from "react"
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
  Select,
} from "@chakra-ui/react"
import { AiFillPicture } from "react-icons/ai"
import { IoInformationCircleOutline } from "react-icons/io5"
import { useCanister } from "@connect2ic/react"
import { getRoleStartup } from "../CommonHelpers"
import {
  CollectionPreInit,
  initialStateCollectionPreInit,
} from "../CommonTypes"
import { EstadoContext } from "../utils/estadoContex"
import { useNavigate } from "react-router-dom"
import { Principal } from '@dfinity/principal';

interface DistributionType {
  Airdrop: {
    principal: string,
    category: string,
    qty: number,
    isVesting: boolean
  }
  // Liquidity: number
  InventorTeam: {
    principal: string,
    category: string,
    qty: number,
    isVesting: boolean
  }
  ReserveFund: {
    principal: string,
    category: string,
    qty: number,
    isVesting: boolean
  }
  PublicSale: {
    principal: string,
    category: string,
    qty: number,
    isVesting: boolean
  }
  // AdvisorNCollaborators: number
}

const formDataDistribution: DistributionType = {
  Airdrop: {
    principal: '',
    category: '',
    qty: 0,
    isVesting: false
  },
  // Liquidity: 0,
  InventorTeam: {
    principal: '',
    category: '',
    qty: 0,
    isVesting: false
  },
  ReserveFund: {
    principal: '',
    category: '',
    qty: 0,
    isVesting: false
  },
  PublicSale: {
    principal: '',
    category: '',
    qty: 0,
    isVesting: false
  },
  // AdvisorNCollaborators: 0,
}

const ColecctionForm = () => {
  const [backend] = useCanister("backend")
  const { currentUser, setCurrentUser } = useContext(EstadoContext)
  const [userRoleStartups, setUserRoleStartups] = useState<string[]>()
  const [projectsByStartup, setProjectsByStartup] = useState<string[]>()
  const { isOpen, onToggle } = useDisclosure()
  const toast = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<CollectionPreInit>(initialStateCollectionPreInit)
  const [formDistribution, setFormDistribution] = useState<DistributionType>(formDataDistribution)
  const [isCheckedReserveFund, setIsCheckedReserveFund] = useState(false)
  const [isCheckedInventorTeam, setIsCheckedInventorTeam] = useState(false)
  const [isCheckedAirdrop, setIsCheckedAirdrop] = useState(false)
  const [isCheckedPublicSale, setIsCheckedPublicSale] = useState(false)

  useEffect(() => {
    const extractedRoleStartups: string[] = getRoleStartup(currentUser.roles)
    setUserRoleStartups(extractedRoleStartups)
    getProjectsByStartup(extractedRoleStartups[0])
  }, [currentUser])

  const getProjectsByStartup = async (startupId: string): Promise<string[]> => {
    const resGetProjectsByStartup: string[] =
      (await backend.getProjectsByStartup(startupId)) as string[]
    const resGetProjectsByStartupFlatted: string[] =
      resGetProjectsByStartup.flat()
    setProjectsByStartup(resGetProjectsByStartupFlatted)
    return resGetProjectsByStartupFlatted
  }

  const getFormVesting = elm => {
    if (elm.indexOf("ReserveFund") !== -1) return isCheckedReserveFund
    if (elm.indexOf("InventorTeam") !== -1) return isCheckedInventorTeam
    if (elm.indexOf("Airdrop") !== -1) return isCheckedAirdrop
    if (elm.indexOf("PublicSale") !== -1) return isCheckedPublicSale
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

  const handleChangeReserveFund = (event) => {
    setIsCheckedReserveFund(event.target.checked);
  }
  const handleChangeInventorTeam = (event) => {
    setIsCheckedInventorTeam(event.target.checked);
  }
  const handleChangeAirdrop = (event) => {
    setIsCheckedAirdrop(event.target.checked);
  }
  const handleChangePublicSale = (event) => {
    setIsCheckedPublicSale(event.target.checked);
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleChangeDistribution = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormDistribution((prevData) => ({
      ...prevData,
      [name]: {...prevData[name], qty: value},
    }))
  }

  const handleChangeDistributionHolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const nameModified = name.substring(0, name.indexOf("Holder"))
    setFormDistribution((prevData) => {
      return {
        ...prevData,
        [nameModified]: {...prevData[nameModified], principal: value}
      }
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // if (Object.keys(formDistribution).reduce((acc, curr) => acc + parseFloat(formDistribution[curr]), 0) !== 100) {
    if (Object.keys(formDistribution).reduce((acc, curr) => {
        return acc + parseInt(formDistribution[curr].qty)
    }, 0) !== 100) {
      toast({
        title: "Submission Error",
        description: "Tokenomics distribution out of range.",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "solid",
      })
      return false
    }

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
        startupID: getRoleStartup(currentUser.roles)[0],
        pojectID: projectsByStartup[0],
        totalSupply: BigInt(formData.totalSupply),
        tokenPrice: BigInt(formData.tokenPrice),
        typesImages: {[formData.typesImages]: null},
        distribution: Object.keys(formDistribution).map((elm) => ({
          principal: Principal.fromText(formDistribution[elm].principal),
          category: { [elm]: null },
          qty: BigInt(formDistribution[elm].qty),
          isVesting: getFormVesting(elm)
        })),
        utilities: formData.utilities.map((e) => ({ [e]: null }))
      }

      const resCreateCollection = (await backend.createCollection(
        formDataToSend,
      )) as any

      // Cierra el toast de carga cuando la acción se completa
      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      // Muestra un toast dependiendo del tipo de respuesta del backend
      if (
        resCreateCollection.ok &&
        resCreateCollection.ok.includes("request was successfully")
      ) {
        toast({
          title: "Successful Submission",
          description: resCreateCollection.ok,
          status: "success", // 'success' es el status para el estilo de éxito
          duration: 5000,
          isClosable: true,
          variant: "solid",
        })
        navigate('/Dashboard')
      }
      if (resCreateCollection.err) {
        toast({
          title: "Submission Error",
          description: JSON.stringify(resCreateCollection.err),
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
                    placeholder="Collection fantasy name..."
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Short Storytelling</FormLabel>
                  <Input
                    id="shortStorytelling"
                    name="shortStorytelling"
                    value={formData.shortStorytelling}
                    onChange={handleChange}
                    placeholder="Short storytelling description..."
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Storytelling Collection</FormLabel>
                  <Input
                    id="storytellingCollection"
                    name="storytellingCollection"
                    value={formData.storytellingCollection}
                    onChange={handleChange}
                    placeholder="Detailed story collection..."
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Total Supply</FormLabel>
                  <Input
                    id="totalSupply"
                    name="totalSupply"
                    type="number"
                    value={formData.totalSupply}
                    onChange={handleChange}
                    placeholder="Tokenomics: Total number of tokens issued..."
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Distribution</FormLabel>
                  {/* <Flex>
                    <Text width="30%" justifyItems="right">Liquidity:</Text>
                    <Input
                      id="Liquidity"
                      name="Liquidity"
                      type="number"
                      width="70%"
                      value={formDistribution.Liquidity}
                      onChange={handleChangeDistribution}
                      placeholder="Liquidity percentage or amount of tokens"
                    />
                  </Flex> */}
                  <Flex>
                    <Text width="30%" alignItems="right">Reserve fund:</Text>
                    <Input
                      id="ReserveFund"
                      name="ReserveFund"
                      type="number"
                      width="70%"
                      value={formDistribution.ReserveFund.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Reserve fund quantity of tokens..."
                    />
                    <Input
                      id="ReserveFundHolder"
                      name="ReserveFundHolder"
                      type="text"
                      width="70%"
                      value={formDistribution.ReserveFund.principal}
                      onChange={handleChangeDistributionHolder}
                      placeholder="Reserve fund holder..."
                    />
                    <Checkbox
                      id="ReserveFundVesting"
                      name="ReserveFundVesting"
                      onChange={handleChangeReserveFund}
                      isChecked={isCheckedReserveFund}
                      required={false}
                    >Is vesting</Checkbox>
                    {/* <Checkbox required={false} id="ReserveFundVesting" name="ReserveFundVesting" value="ReserveFundVesting">Is vesting</Checkbox> */}
                  </Flex>
                  <Flex>
                    <Text width="30%" alignContent="right">Inventor team:</Text>
                    <Input
                      id="InventorTeam"
                      name="InventorTeam"
                      type="number"
                      width="70%"
                      value={formDistribution.InventorTeam.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Inventor Team quantity of tokens..."
                    />
                    <Input
                      id="InventorTeamHolder"
                      name="InventorTeamHolder"
                      type="text"
                      width="70%"
                      value={formDistribution.InventorTeam.principal}
                      onChange={handleChangeDistributionHolder}
                      placeholder="Inventor Team holder..."
                    />
                    <Checkbox
                      id="InventorTeamVesting"
                      name="InventorTeamVesting"
                      onChange={handleChangeInventorTeam}
                      isChecked={isCheckedInventorTeam}
                      required={false}
                    >Is vesting</Checkbox>
                    {/* <Checkbox required={false} id="InventorTeamVesting" name="InventorTeamVesting" value="InventorTeamVesting">Is vesting</Checkbox> */}
                  </Flex>
                  <Flex>
                    <Text width="30%" justifyContent="right">Airdrop:</Text>
                    <Input
                      id="Airdrop"
                      name="Airdrop"
                      type="number"
                      width="70%"
                      value={formDistribution.Airdrop.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Airdrop quantity of tokens..."
                    />
                    <Input
                      id="AirdropHolder"
                      name="AirdropHolder"
                      type="text"
                      width="70%"
                      value={formDistribution.Airdrop.principal}
                      onChange={handleChangeDistributionHolder}
                      placeholder="Airdrop holder..."
                    />
                    <Checkbox
                      id="AirdropVesting"
                      name="AirdropVesting"
                      onChange={handleChangeAirdrop}
                      isChecked={isCheckedAirdrop}
                      required={false}
                    >Is vesting</Checkbox>
                    {/* <Checkbox required={false} id="AirdropVesting" name="AirdropVesting" value="AirdropVesting">Is vesting</Checkbox> */}
                  </Flex>
                  <Flex>
                    <Text width="30%" alignItems="right">Public sale:</Text>
                    <Input
                      id="PublicSale"
                      name="PublicSale"
                      type="number"
                      width="70%"
                      value={formDistribution.PublicSale.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Public sale quantity of tokens..."
                    />
                    <Input
                      id="PublicSaleHolder"
                      name="PublicSaleHolder"
                      type="text"
                      width="70%"
                      value={formDistribution.PublicSale.principal}
                      onChange={handleChangeDistributionHolder}
                      placeholder="Public sale holder..."
                    />
                    <Checkbox
                      id="PublicSaleVesting"
                      name="PublicSaleVesting"
                      onChange={handleChangePublicSale}
                      isChecked={isCheckedPublicSale}
                      required={false}
                      >Is vesting</Checkbox>
                    {/* <Checkbox id="PublicSaleVesting" name="PublicSaleVesting" value="PublicSaleVesting">Is vesting</Checkbox> */}
                  </Flex>
                  {/* <Flex>
                    <Text width="30%" alignItems="right">AdvisorNCollaborators:</Text>
                    <Input
                      id="AdvisorNCollaborators"
                      name="AdvisorNCollaborators"
                      type="number"
                      width="70%"
                      value={formDistribution.AdvisorNCollaborators}
                      onChange={handleChangeDistribution}
                      placeholder="Advisor and Collaborators percentage or amount of tokens"
                    />
                  </Flex> */}
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Utilities</FormLabel>
                  <CheckboxGroup
                    colorScheme="teal" // ajusta según tus preferencias
                    value={formData.utilities}
                    onChange={handleCheckboxChange}
                  >
                    <Checkbox value="Governance">Governance</Checkbox>
                    <br />
                    <Checkbox value="IpNFT">IP-NFT</Checkbox>
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
                    type="number"
                    value={formData.tokenPrice}
                    onChange={handleChange}
                    placeholder="Amount in $USD..."
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
                    placeholder="Upload documents..."
                  />
                </FormControl>

                {/* Campo para formato de imágenes */}
                <FormControl isRequired mt={4}>
                  <FormLabel>Type of images</FormLabel>
                  <Select
                    id="typesImages"
                    name="typesImages"
                    value={formData.typesImages}
                    onChange={handleSelectChange}
                    placeholder="Images type format..."
                  >
                    <option value="PNG">PNG</option>
                    <option value="GIF">GIF</option>
                    <option value="JPG">JPG</option>
                    <option value="SVG">SVG</option>
                  </Select>
                </FormControl>

                {/* <FormControl isRequired mt={4}>
                  <FormLabel>Type of images</FormLabel>
                  <Input
                    id="typesImages"
                    name="typesImages"
                    value={formData.typesImages}
                    onChange={handleChange}
                    placeholder="Full images o Generated programmatically"
                  />
                </FormControl> */}

                <FormControl isRequired mt={4}>
                  <FormLabel>Upload images</FormLabel>
                  <Input
                    id="nftImagesUrl"
                    name="nftImagesUrl"
                    value={formData.nftImagesUrl}
                    onChange={handleChange}
                    placeholder="Load full images or attributes..."
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Creator</FormLabel>
                  <Input
                    id="creator"
                    name="creator"
                    value={formData.creator}
                    onChange={handleChange}
                    placeholder="Name, nickname or entity of the creator of the collection..."
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
