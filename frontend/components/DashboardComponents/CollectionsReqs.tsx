import React, { useEffect, useState } from "react"
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { useCanister } from "@connect2ic/react"
import {
  CollectionPreInit,
  DeployConfig,
  Dip721NonFungibleToken,
  Tier
} from "../CommonTypes"
import { readFileLines } from "../CommonHelpers"

const CollectionsReqs: React.FC = () => {
  const [backend] = useCanister("backend")
  const [incomingCollectionsRequests, setIncomingCollectionsRequests] =
    useState<string[]>()
  const [responseBackend, setResponseBackend] = useState<any>(null)
  const [formDataDeploy, setFormDataDeploy] = useState({
    toPrincipal: "",
    nftName: "",
    nftLogo: "",
    nftSymbol: "",
    nftMaxLimit: "",
    nftProyectId: "",
    nftBaseUrl: "",
    nftAssetsNamesFile: null as File | null,
    // nftAssetsNames: [],
    nftCustodian: "",
    nftDistribution: [],
    nftComposition: [],
    nftFee: ""
  })
  const [tierTotalColumns, setTierTotalColumns] = useState({
    tierA: 0,
    tierB: 0,
    tierC: 0
  })
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const getIncomingCollectionsRequests = async () => {
      try {
        const resIncomingCollectionsRequests: string[] =
          (await backend.getIncomingCollectionsRequests()) as string[]
        setIncomingCollectionsRequests(resIncomingCollectionsRequests)
        return resIncomingCollectionsRequests
      } catch (error) {
        console.error(
          "Error on backend.getIncomingCollectionsRequests() call:",
          error,
        )
      }
    }

    getIncomingCollectionsRequests()
      .then((incomingCollectionsRequests) =>
        console.log("getIncomingCollectionsRequests"),
      )
      .catch((error) => console.error(error))
  }, [responseBackend])

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormDataDeploy((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormDataDeploy((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleOpenModal = async (currStartup: string) => {
    toast({
      title: "Loading forms...",
      status: "loading", // 'loading' es el status para el estilo de carga
      duration: 2000,
      isClosable: false,
      variant: "solid",
    })

    const resProjectsByStartup: string[] | null | undefined = await backend.getProjectsByStartup(currStartup) as string[] | null | undefined
    setFormDataDeploy(prevData => {
      return {
        ...prevData,
        nftProyectId: resProjectsByStartup[0]
      }
    })

    const resCollectionRequestByStartUp: CollectionPreInit | null | undefined = await backend.getCollectionRequestByStartUp(currStartup) as CollectionPreInit | null | undefined
    setFormDataDeploy(prevData => ({...prevData, nftDistribution: resCollectionRequestByStartUp[0].distribution, nftComposition: resCollectionRequestByStartUp[0].composition, nftMaxLimit: resCollectionRequestByStartUp[0].totalSupply}))

    onOpen()
  }

  const handleReject = async (currStartup: string) => {
    await backend.rejectCollection(currStartup)
  }

  const buildTiersAssets = (mainFileLines: string[]): any => {
    let tiersAssetsNames = {}
    mainFileLines.map(mainFileLine => {
      let extractedTierName = mainFileLine.substring(mainFileLine.indexOf("-")+1, mainFileLine.lastIndexOf("-"))
      extractedTierName = extractedTierName.substring(0, 1).toLowerCase() + extractedTierName.substring(1)
      tiersAssetsNames = {...tiersAssetsNames, [extractedTierName]: tiersAssetsNames[extractedTierName] ? [...tiersAssetsNames[extractedTierName], mainFileLine] : [mainFileLine]}
    })
    return tiersAssetsNames
  }

  const handleDeploy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const targetForm = event.target
    let loadingToastId: string | number | undefined

    try {
      loadingToastId = toast({
        title: "Submitting Form",
        status: "loading", // 'loading' es el status para el estilo de carga
        duration: null,
        isClosable: false,
        variant: "solid",
      })

      const initDip721: Dip721NonFungibleToken = {
        logo: {logo_type: "png", data: formDataDeploy.nftLogo},
        name: formDataDeploy.nftName,
        symbol: formDataDeploy.nftSymbol,
        maxLimit: Number(formDataDeploy.nftMaxLimit),
      }

      const mainFileLines = await readFileLines(targetForm[8].files[0])
      const tiersAssets = buildTiersAssets(mainFileLines)
      Object.keys(tiersAssets).map(tierElm => {
        formDataDeploy.nftComposition.map(nftElm => {
          if (tierElm.toLowerCase() === nftElm.tierName.toLowerCase()) {
            nftElm.assetsNames = tiersAssets[nftElm.tierName]
            nftElm.qty = tiersAssets[nftElm.tierName].length
            setFormDataDeploy(prevData => {
              return {
                ...prevData, nftComposition: formDataDeploy.nftComposition.map(compositionElm => {
                  if (compositionElm.tierName.toLowerCase() === nftElm.tierName.toLowerCase()) return nftElm
                  else return compositionElm
                })
              }
            })
          }
        })
      })
      const cfgMushroom: DeployConfig = {
        projectId: formDataDeploy.nftProyectId[0],
        baseUrl: formDataDeploy.nftBaseUrl,
        assetsNames: await readFileLines(targetForm[8].files[0]),
        custodian: formDataDeploy.nftCustodian,
        distribution: formDataDeploy.nftDistribution,
        composition: formDataDeploy.nftComposition
      }

      const resDeployCollection: any = (await backend.deployCollection(
        initDip721,
        cfgMushroom,
        Number(formDataDeploy.nftFee),
      )) as any
      setResponseBackend(resDeployCollection)

      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      if (resDeployCollection["ok"]) {
        toast({
          title: "Successful Submission",
          description: `Collection deployed`,
          status: "success", // 'success' es el status para el estilo de éxito
          duration: 5000,
          isClosable: true,
          variant: "solid",
        })
        onClose()
      } else {
        toast({
          title: "Error deploying collection",
          description: resDeployCollection["err"],
          status: "error", // 'error' es el status para el estilo de error
          duration: 5000,
          isClosable: true,
          variant: "solid",
        })
        console.error(resDeployCollection)
      }
    } catch (error) {
      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      toast({
        title: "Submission Error",
        description:
          "There was an error submitting the form. Please try again.",
        status: "error", // 'error' es el status para el estilo de error
        duration: 5000,
        isClosable: true,
        variant: "solid",
      })

      console.error("Error deploying collection:", error)
    }
  }

  return (
    <>
      <Heading fontSize="4xl">Collection registration requests</Heading>
      <List spacing={3}>
        {incomingCollectionsRequests?.map((incomingCollectionsRequest, idx) => {
          return (
            <ListItem key={idx}>
              <Card maxW="sm">
                <CardBody>
                  <Heading color="blue.600" fontSize="2xl">
                    {incomingCollectionsRequest}
                  </Heading>
                  <Text size="md">{incomingCollectionsRequest}</Text>
                </CardBody>
                <Divider />
                <CardFooter>
                  <ButtonGroup spacing="2">
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      onClick={() => handleOpenModal(incomingCollectionsRequest)}
                    >
                      Deploy
                    </Button>
                    <Button
                      type="button"
                      mt={4}
                      variant="ghost"
                      onClick={() => handleReject(incomingCollectionsRequest)}
                    >
                      Reject
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            </ListItem>
          )
        })}
      </List>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
          {/* Agregar el estilo para el ModalOverlay */}
          <ModalOverlay style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} />

          {/* Agregar estilo para centrar el ModalContent */}
          <ModalContent
            backgroundColor="#1E1E1E"
            position="absolute"
            top="30%"
            left="40%"
            transform="translate(-50%, -50%)"
          >
            <ModalHeader>Deploy collection</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleDeploy}>
                <fieldset>
                  <legend>Sección DIP-721</legend>
                  <FormControl isRequired>
                    <Input
                      placeholder="Logo..."
                      id="nftLogo"
                      name="nftLogo"
                      value={formDataDeploy.nftLogo}
                      onChange={handleChangeForm}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <Input
                      placeholder="Name..."
                      id="nftName"
                      name="nftName"
                      value={formDataDeploy.nftName}
                      onChange={handleChangeForm}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      placeholder="Symbol..."
                      id="nftSymbol"
                      name="nftSymbol"
                      value={formDataDeploy.nftSymbol}
                      onChange={handleChangeForm}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      placeholder="Max supply..."
                      id="nftMaxLimit"
                      name="nftMaxLimit"
                      type="number"
                      disabled
                      value={String(formDataDeploy.nftMaxLimit)}
                      onChange={handleChangeForm}
                    />
                  </FormControl>
                </fieldset>
                <br />
                <fieldset>
                  <legend>Sección Mushroom</legend>
                  <FormControl>
                    <Input
                      id="nftProyectId"
                      name="nftProyectId"
                      placeholder="Project Id..."
                      disabled
                      value={formDataDeploy.nftProyectId}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      id="nftBaseUrl"
                      name="nftBaseUrl"
                      type="url"
                      placeholder="Base URL..."
                      value={formDataDeploy.nftBaseUrl}
                      onChange={handleChangeForm}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      id="nftAssetsNamesFile"
                      name="nftAssetsNamesFile"
                      placeholder="Assets names..."
                      type="file"
                      onChange={handleChangeFile}
                      accept="text/*" // Asegura que solo se puedan seleccionar archivos de texto
                    />
                  </FormControl>
                  {/* <FormControl>
                    <Input
                      id="nftAssetsNames"
                      name="nftAssetsNames"
                      placeholder="Assets names..."
                      value={formDataDeploy.nftAssetsNames}
                      onChange={handleChangeForm}
                    />
                  </FormControl> */}
                  <FormControl>
                    <Input
                      id="nftCustodian"
                      name="nftCustodian"
                      placeholder="Custodian..."
                      value={formDataDeploy.nftCustodian}
                      onChange={handleChangeForm}
                    />
                  </FormControl>
                  <FormControl>
                    Distribution:
                    <hr />
                    {formDataDeploy.nftDistribution.map(elm => {
                      return <>
                        <Text><b>Principal:</b> {elm.principal.toText()}</Text>
                        <Text><b>Category:</b> {Object.keys(elm.category)}</Text>
                        <p>
                          <Text><b>Quantity per Tier:</b></Text>
                          {elm.qtyPerTier.map(qtyTier => {
                            return <Text>{`${qtyTier.tierName}: ${qtyTier.qty}`}</Text>
                          })}
                        </p>
                        <Text><b>Is Vesting:</b> {elm.isVesting.toString()}</Text>
                        <hr />
                      </>
                    })}
                  </FormControl>
                </fieldset>
                <br />
                <fieldset>
                <FormControl isRequired mt={4}>
                  <FormLabel>Distribution</FormLabel>
                    <Flex>
                      <Text width="30%" alignItems="right">Category</Text>
                      <Text width="10%" alignItems="right">Tier A</Text>
                      <Text width="10%" alignItems="right">Tier B</Text>
                      <Text width="10%" alignItems="right">Tier C</Text>
                      <Text width="10%">Total NFTs</Text>
                      <Text width="30%" alignItems="right">Holder</Text>
                    </Flex>
                    {formDataDeploy.nftDistribution.map(distributionCategory => {
                      let totalRow = 0
                      return <Flex>
                        <Text width="30%">{Object.keys(distributionCategory.category)[0]}</Text>
                        {distributionCategory.qtyPerTier.map(tierInfo => {
                          totalRow = totalRow + Number(tierInfo.qty)
                          // setTierTotalColumns(prevData => {
                          //   console.log(prevData)
                          //   return {
                          //     ...prevData,
                          //     [tierInfo.tierName]: tierTotalColumns[tierInfo.tierName] + Number(tierInfo.qty)
                          //   }
                          // })
                          return <Text width="10%">{Number(tierInfo.qty)}</Text>
                        })}
                        <Text width="10%">{totalRow}</Text>
                        <Text width="30%">{distributionCategory.principal.toText()}</Text>
                      </Flex>
                    })}
                    <Flex>
                      <Text width="30%" alignItems="right"></Text>
                      <Text width="10%" alignItems="right">{tierTotalColumns.tierA}</Text>
                      <Text width="10%" alignItems="right">{tierTotalColumns.tierB}</Text>
                      <Text width="10%" alignItems="right">{tierTotalColumns.tierC}</Text>
                      <Text width="10%"></Text>
                      <Text width="30%" alignItems="right"></Text>
                    </Flex>
                  </FormControl>
                </fieldset>
                <fieldset>
                  <legend>Sección Fee</legend>
                  <FormControl>
                    <Input
                      id="nftFee"
                      name="nftFee"
                      type="number"
                      placeholder="Total fee..."
                      value={formDataDeploy.nftFee}
                      onChange={handleChangeForm}
                    />
                  </FormControl>
                </fieldset>
                {/* <FormControl> */}
                  <Button
                    type="submit"
                    mt={4}
                    colorScheme="teal"
                    variant="solid"
                    borderRadius="10px"
                  >
                    Do deploy
                  </Button>
                {/* </FormControl> */}
              </form>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="teal"
                variant="ghost"
                mr={3}
                onClick={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </>
  )
}

export default CollectionsReqs
