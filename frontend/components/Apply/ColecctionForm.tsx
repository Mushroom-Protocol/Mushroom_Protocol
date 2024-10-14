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
  Tier,
  initialStateCollectionPreInit,
} from "../CommonTypes"
import { EstadoContext } from "../utils/estadoContex"
import { useNavigate } from "react-router-dom"
import { Principal } from '@dfinity/principal';

interface TierFields {
  tierA: {
    principal: string
    category: string
    qty: number
    isVesting: boolean
    price: number
  },
  tierB: {
    principal: string
    category: string
    qty: number
    isVesting: boolean
    price: number
  },
  tierC: {
    principal: string
    category: string
    qty: number
    isVesting: boolean
    price: number
  }
}

const TierFieldsInit: TierFields = {
  tierA: {
    principal: '',
    category: '',
    qty: 0,
    isVesting: false,
    price: 0
  },
  tierB: {
    principal: '',
    category: '',
    qty: 0,
    isVesting: false,
    price: 0
  },
  tierC: {
    principal: '',
    category: '',
    qty: 0,
    isVesting: false,
    price: 0
  }
}

const tiersPrices = {
  tierA: "",
  tierB: "",
  tierC: "",
}

interface DistributionType {
  Airdrop: {tiers: TierFields, holder: string, isVesting: boolean}
  InventorTeam: {tiers: TierFields, holder: string, isVesting: boolean}
  ReserveFund: {tiers: TierFields, holder: string, isVesting: boolean}
  PublicSale: {tiers: TierFields, holder: string, isVesting: boolean}
}

const formDataDistribution: DistributionType = {
  Airdrop: {tiers: TierFieldsInit, holder: "", isVesting: false},
  InventorTeam: {tiers: TierFieldsInit, holder: "", isVesting: true},
  ReserveFund: {tiers: TierFieldsInit, holder: "", isVesting: true},
  PublicSale: {tiers: TierFieldsInit, holder: "", isVesting: true}
}

const formDataComposition: Tier[] = [
  {
    tierName: "TierA",
    price: 0,
    qty: 0,
    assetsNames: []
  },
  {
    tierName: "TierB",
    price: 0,
    qty: 0,
    assetsNames: []
  },
  {
    tierName: "TierC",
    price: 0,
    qty: 0,
    assetsNames: []
  }
]

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
  const [formTiersPrices, setFormTiersPrices] = useState(tiersPrices)
  const [isCheckedReserveFund, setIsCheckedReserveFund] = useState(false)
  const [isCheckedInventorTeam, setIsCheckedInventorTeam] = useState(false)
  const [isCheckedAirdrop, setIsCheckedAirdrop] = useState(false)
  const [isCheckedPublicSale, setIsCheckedPublicSale] = useState(false)
  const [totalNFTCategories, setTotalNFTCategories] = useState<{PublicSale: number, InventorTeam: number, ReserveFund: number, Airdrop: number}>({PublicSale: 0, InventorTeam: 0, ReserveFund: 0, Airdrop: 0})
  const [totalTiersQuantity, setTotalTiersQuantity] = useState<{tierA: number, tierB: number, tierC: number}>({tierA: 0, tierB: 0, tierC: 0})

  useEffect(() => {
    const extractedRoleStartups: string[] = getRoleStartup(currentUser.roles)
    setUserRoleStartups(extractedRoleStartups)
    getProjectsByStartup(extractedRoleStartups[0])
  }, [currentUser])

  useEffect(() => {
    Object.keys(formDistribution).map(elm => {
      setTotalNFTCategories(prevData => {
        return {...prevData, [elm]: calculateTotalNFTCategory(elm)}
      })
    })

    Object.keys(tiersPrices).map(elm => {
      setTotalTiersQuantity(prevData => {
        return {...prevData, [elm]: calculateTierQuantity(elm)}
      })
    })
  }, [formDistribution])

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
    const [ category, tier ] = name.split("_")
    setFormDistribution((prevData) => {
      return {
        ...prevData,
        [category]: {...prevData[category], tiers: {...prevData[category].tiers, [tier]: {...prevData[category].tiers[tier], qty: parseInt(value)}}},
      }
    })
  }

  const handleChangeDistributionHolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const nameModified = name.substring(0, name.indexOf("Holder"))
    setFormDistribution((prevData) => {
      return {
        ...prevData,
        [nameModified]: {...prevData[nameModified], holder: value}
      }
    })
  }

  const handleChangeTiersPrices = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const nameModified = name.substring(0, name.indexOf("Price"))
    setFormTiersPrices((prevData) => ({
      ...prevData,
      [nameModified]: value
    }))
  }

  const calculateTierQuantity = (tierName): number => {
    return Object.keys(formDistribution).reduce((acc, curr) => {
      return acc + parseInt(formDistribution[curr].tiers[tierName].qty)
    }, 0)
  }

  const calculateTotalNFTCategory = (category: string): number => {
    const categoryTiers = Object.keys(formDistribution[category].tiers)
    return categoryTiers.reduce((acc, curr) => {
      return acc + parseInt(formDistribution[category].tiers[curr].qty)
    }, 0)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // if (Object.keys(formDistribution).reduce((acc, curr) => acc + parseFloat(formDistribution[curr]), 0) !== 100) {
    // if (Object.keys(formDistribution).reduce((acc, curr) => {
    //     return acc + parseInt(formDistribution[curr].qty)
    // }, 0) !== 100) {
    //   toast({
    //     title: "Submission Error",
    //     description: "Tokenomics distribution out of range.",
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //     variant: "solid",
    //   })
    //   return false
    // }

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
        projectID: projectsByStartup[0],
        totalSupply: BigInt(formData.totalSupply),
        tokenPrice: BigInt(formData.tokenPrice),
        typesImages: {PNG: null},
        distribution: Object.keys(formDistribution).map((elm) => {
          return {
            principal: Principal.fromText(formDistribution[elm].holder),
            category: { [elm]: null },
            qtyPerTier: Object.keys(formDistribution[elm].tiers).map(elmTier => {
              return {
                tierName: elmTier,
                qty: BigInt(formDistribution[elm].tiers[elmTier].qty)
              }
            }),
            isVesting: getFormVesting(elm)
          }
        }),
        // distribution: [],
        composition: Object.keys(tiersPrices).map(elm => {
          return {
            tierName: elm,
            price: BigInt(formTiersPrices[elm]),
            qty: BigInt(calculateTierQuantity(elm)),
            assetsNames: []
          }
        }),
        // composition: [],
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
                    placeholder="Total number of tokens issued..."
                  />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Distribution</FormLabel>
                  <Flex>
                    <Text width="30%" alignItems="right">Category</Text>
                    <Text width="10%" alignItems="right">Tier A</Text>
                    <Text width="10%" alignItems="right">Tier B</Text>
                    <Text width="10%" alignItems="right">Tier C</Text>
                    <Text width="10%"></Text>
                    <Text width="30%" alignItems="right">Holder</Text>
                    {/* <Checkbox
                      id="ReserveFundVesting"
                      name="ReserveFundVesting"
                      onChange={handleChangeReserveFund}
                      isChecked={isCheckedReserveFund}
                      required={false}
                    >Is vesting</Checkbox> */}
                  </Flex>
                  <Flex>
                    <Text width="30%" alignContent="right">Public Sale</Text>
                    <Input
                      id="PublicSale_tierA"
                      name="PublicSale_tierA"
                      type="number"
                      width="10%"
                      value={formDistribution.PublicSale.tiers.tierA.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Public Sale, Tier A quantity of tokens..."
                    />
                    <Input
                      id="PublicSale_tierB"
                      name="PublicSale_tierB"
                      type="number"
                      width="10%"
                      value={formDistribution.PublicSale.tiers.tierB.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Public Sale, Tier B quantity of tokens..."
                    />
                    <Input
                      id="PublicSale_tierC"
                      name="PublicSale_tierC"
                      type="number"
                      width="10%"
                      value={formDistribution.PublicSale.tiers.tierC.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Public Sale, Tier C quantity of tokens..."
                    />
                    <Text width="10%" alignItems="center">{totalNFTCategories.PublicSale}</Text>
                    <Input
                      id="PublicSaleHolder"
                      name="PublicSaleHolder"
                      type="text"
                      width="30%"
                      value={formDistribution.PublicSale.holder}
                      onChange={handleChangeDistributionHolder}
                      placeholder="Public Sale holder..."
                    />
                  </Flex>
                  <Flex>
                    <Text width="30%" alignContent="right">Inventor Team</Text>
                    <Input
                      id="InventorTeam_tierA"
                      name="InventorTeam_tierA"
                      type="number"
                      width="10%"
                      value={formDistribution.InventorTeam.tiers.tierA.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Inventor Team, Tier A quantity of tokens..."
                    />
                    <Input
                      id="InventorTeam_tierB"
                      name="InventorTeam_tierB"
                      type="number"
                      width="10%"
                      value={formDistribution.InventorTeam.tiers.tierB.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Inventor Team, Tier B quantity of tokens..."
                    />
                    <Input
                      id="InventorTeam_tierC"
                      name="InventorTeam_tierC"
                      type="number"
                      width="10%"
                      value={formDistribution.InventorTeam.tiers.tierC.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Inventor Team, Tier C quantity of tokens..."
                    />
                    <Text width="10%">{totalNFTCategories.InventorTeam}</Text>
                    <Input
                      id="InventorTeamHolder"
                      name="InventorTeamHolder"
                      type="text"
                      width="30%"
                      value={formDistribution.InventorTeam.holder}
                      onChange={handleChangeDistributionHolder}
                      placeholder="Inventor Team holder..."
                    />
                  </Flex>
                  <Flex>
                    <Text width="30%" alignContent="right">Reserve Fund</Text>
                    <Input
                      id="ReserveFund_tierA"
                      name="ReserveFund_tierA"
                      type="number"
                      width="10%"
                      value={formDistribution.ReserveFund.tiers.tierA.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Reserve Fund, Tier A quantity of tokens..."
                    />
                    <Input
                      id="ReserveFund_tierB"
                      name="ReserveFund_tierB"
                      type="number"
                      width="10%"
                      value={formDistribution.ReserveFund.tiers.tierB.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Reserve Fund, Tier B quantity of tokens..."
                    />
                    <Input
                      id="ReserveFund_tierC"
                      name="ReserveFund_tierC"
                      type="number"
                      width="10%"
                      value={formDistribution.ReserveFund.tiers.tierC.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Reserve Fund, Tier C quantity of tokens..."
                    />
                    <Text width="10%">{totalNFTCategories.ReserveFund}</Text>
                    <Input
                      id="ReserveFundHolder"
                      name="ReserveFundHolder"
                      type="text"
                      width="30%"
                      value={formDistribution.ReserveFund.holder}
                      onChange={handleChangeDistributionHolder}
                      placeholder="Reserve Fund holder..."
                    />
                  </Flex>
                  <Flex>
                    <Text width="30%" alignContent="right">Airdrop</Text>
                    <Input
                      id="Airdrop_tierA"
                      name="Airdrop_tierA"
                      type="number"
                      width="10%"
                      value={formDistribution.Airdrop.tiers.tierA.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Airdrop, Tier A quantity of tokens..."
                    />
                    <Input
                      id="Airdrop_tierB"
                      name="Airdrop_tierB"
                      type="number"
                      width="10%"
                      value={formDistribution.Airdrop.tiers.tierB.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Airdrop, Tier B quantity of tokens..."
                    />
                    <Input
                      id="Airdrop_tierC"
                      name="Airdrop_tierC"
                      type="number"
                      width="10%"
                      value={formDistribution.Airdrop.tiers.tierC.qty}
                      onChange={handleChangeDistribution}
                      placeholder="Airdrop, Tier C quantity of tokens..."
                    />
                    <Text width="10%">{totalNFTCategories.Airdrop}</Text>
                    <Input
                      id="AirdropHolder"
                      name="AirdropHolder"
                      type="text"
                      width="30%"
                      value={formDistribution.Airdrop.holder}
                      onChange={handleChangeDistributionHolder}
                      placeholder="Airdrop holder..."
                    />
                  </Flex>
                  <Flex>
                    <Text width="30%"></Text>
                    <Text width="10%">{totalTiersQuantity.tierA}</Text>
                    <Text width="10%">{totalTiersQuantity.tierB}</Text>
                    <Text width="10%">{totalTiersQuantity.tierC}</Text>
                    <Text width="10%"></Text>
                    <Text width="30%"></Text>
                  </Flex>
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Tiers Prices</FormLabel>
                  <Flex>
                    <Text width="20%" alignItems="right">Tier A price:</Text>
                    <Input
                      id="tierAPrice"
                      name="tierAPrice"
                      type="number"
                      width="20%"
                      value={formTiersPrices.tierA}
                      onChange={handleChangeTiersPrices}
                      placeholder="Tier A price..."
                    />
                  </Flex>
                  <Flex>
                    <Text width="20%" alignItems="right">Tier B price:</Text>
                    <Input
                      id="tierBPrice"
                      name="tierBPrice"
                      type="number"
                      width="20%"
                      value={formTiersPrices.tierB}
                      onChange={handleChangeTiersPrices}
                      placeholder="Tier B price..."
                    />
                  </Flex>
                  <Flex>
                    <Text width="20%" alignItems="right">Tier C price:</Text>
                    <Input
                      id="tierCPrice"
                      name="tierCPrice"
                      type="number"
                      width="20%"
                      value={formTiersPrices.tierC}
                      onChange={handleChangeTiersPrices}
                      placeholder="Tier C price..."
                    />
                  </Flex>
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
                  </CheckboxGroup>
                </FormControl>

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
