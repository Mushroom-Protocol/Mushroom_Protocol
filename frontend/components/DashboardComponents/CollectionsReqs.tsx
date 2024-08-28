import React, { useEffect, useState } from "react"
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  FormControl,
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
  DataProject,
  DeployConfig,
  Dip721NonFungibleToken,
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
    nftMaxLimit: 0,
    nftProyectId: "",
    nftBaseUrl: "",
    nftAssetsNamesFile: null as File | null,
    // nftAssetsNames: [],
    nftCustodian: "",
    nftFee: 0,
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

  const handleOpenModal = async (currStartup: string) => {
    toast({
      title: "Loading forms...",
      status: "loading", // 'loading' es el status para el estilo de carga
      duration: 2000,
      isClosable: false,
      variant: "solid",
    })
    const resProjectsByStartup: string[] | null | undefined = await backend.getProjectsByStartup(currStartup) as string[] | null | undefined
    formDataDeploy.nftProyectId = resProjectsByStartup[0]
    onOpen()
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
      const cfgMushroom: DeployConfig = {
        projectId: formDataDeploy.nftProyectId[0],
        baseUrl: formDataDeploy.nftBaseUrl,
        assetsNames: await readFileLines(targetForm[8].files[0]),
        custodian: formDataDeploy.nftCustodian,
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
                      placeholder="Max limit..."
                      id="nftMaxLimit"
                      name="nftMaxLimit"
                      value={formDataDeploy.nftMaxLimit}
                      onChange={handleChangeForm}
                    />
                  </FormControl>
                </fieldset>
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
                      onChange={handleChangeForm}
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
                </fieldset>
                <fieldset>
                  <legend>Sección Fee</legend>
                  <FormControl>
                    <Input
                      id="nftFee"
                      name="nftFee"
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
