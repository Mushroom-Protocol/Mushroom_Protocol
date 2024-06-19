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
  ProjectCard,
} from "../CommonTypes"

const CollectionsReqs: React.FC = () => {
  const [backend] = useCanister("backend")
  const [incomingCollectionsRequests, setIncomingCollectionsRequests] =
    useState<string[]>()
  const [responseBackend, setResponseBackend] = useState<
    string | null | DataProject
  >()
  const [formDataDeploy, setFormDataDeploy] = useState({
    toPrincipal: "",
    nftName: "",
    nftSymbol: "",
    nftMaxLimit: 0,
    nftProyectId: "",
    nftBaseUrl: "",
    nftAssetsNames: [],
    nftCustodian: "",
    nftFee: "",
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
        console.log(incomingCollectionsRequests),
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

  const handleDeploy = async (startupID: string) => {
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
        logo: {logo_type: "png", data: "https://nys2z-xaaaa-aaaak-qddoq-cai.icp0.io/assets/MpFavicon.c07f4d7e.png"},
        name: "Founders",
        symbol: "MRPF",
        maxLimit: 10,
      }
      const cfgMushroom: DeployConfig = {
        projectId: "PR507005",
        baseUrl: "https://5tauz-siaaa-aaaag-qjxnq-cai.icp0.io/",
        assetsNames: [
          "m49y4-e209u-1vca2-k0xqi-3rv.jpg",
          "md14e-yz64m-zovii-2a5io-cpe.jpg",
          "jajcd-s1ndi-gsomc-9vn7w-ean.jpg",
          "kz4fs-mv9y7-5dobw-e842k-mc6.jpg",
          "y1l9l-5vn4t-5wmpu-vcrms-zpq.jpg",
          "rktq0-sypbn-uco8c-ttcjk-oot.jpg",
          "m4uax-mdpfl-3q8c3-gy9k7-sh1.jpg",
          "k00jl-65v0g-obsc2-itlt9-87n.jpg",
          "36ns1-jrwym-ps933-hw2ht-c27.jpg",
          "y7njg-kpxay-j32ip-ybzu2-0j1.jpg"
        ],
        custodian: "ymgon-r53wh-becic-fsvsr-uajvf-5cpzw-pfk5m-phy5p-n5vhe-ihoz6-gqe",
      }
      const feeDeploy: number = 50692307692
      console.log(cfgMushroom)
      const resDeployCollection: any = (await backend.deployCollection(
        initDip721,
        cfgMushroom,
        feeDeploy,
      )) as any
      console.log(resDeployCollection)

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
      } else {
        toast({
          title: "Error deploying collection",
          description: `Error on backend.deployCollection() .`,
          status: "error", // 'error' es el status para el estilo de error
          duration: 5000,
          isClosable: true,
          variant: "solid",
        })
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

      console.error("Error approving project:", error)
    }
  }

  const handleReject = async (owner) => {
    let loadingToastId: string | number | undefined

    try {
      loadingToastId = toast({
        title: "Submitting Form",
        status: "loading", // 'loading' es el status para el estilo de carga
        duration: null,
        isClosable: false,
        variant: "solid",
      })

      // const resRejectProject = await backend.rejectProject(owner) as DataProject | null
      const resRejectProject = (await backend.rejectProject(owner)) as
        | DataProject
        | null
        | string
      setResponseBackend(resRejectProject)

      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      toast({
        title: "Successful Submission",
        description: `Project rejected successfully.`,
        status: "success", // 'success' es el status para el estilo de éxito
        duration: 5000,
        isClosable: true,
        variant: "solid",
      })
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

      console.error("Error approving startup:", error)
    }
  }

  return (
    <>
      <Heading fontSize="4xl">Collection registration requests</Heading>
      <List spacing={3}>
        {incomingCollectionsRequests?.map((incomingCollectionsRequest) => {
          return (
            <ListItem>
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
                      onClick={onOpen}
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
              <form>
                <fieldset>
                  <legend>Sección DIP-721</legend>
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
                      placeholder="Project Id..."
                      id="nftProyectId"
                      name="nftProyectId"
                      value={formDataDeploy.nftProyectId}
                      onChange={handleChangeForm}
                    />
                  </FormControl>
                  {/* <FormControl>
                    <Input
                      placeholder="Canister Id assets..."
                      id="nftCanisterIdAssets"
                      name="nftCanisterIdAssets"
                      value={formDataDeploy.nftBaseUrl}
                      onChange={handleChangeForm}
                    />
                  </FormControl> */}
                  <FormControl>
                    <Input
                      placeholder="Assets names..."
                      id="nftAssetsNames"
                      name="nftAssetsNames"
                      value={formDataDeploy.nftAssetsNames}
                      onChange={handleChangeForm}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      placeholder="Custodian..."
                      id="nftCustodian"
                      name="nftCustodian"
                      value={formDataDeploy.nftCustodian}
                      onChange={handleChangeForm}
                    />
                  </FormControl>
                </fieldset>
                <fieldset>
                  <legend>Sección Fee</legend>
                  <FormControl>
                    <Text>Total:</Text>
                  </FormControl>
                </fieldset>
                {/* <FormControl> */}
                  <Button
                    type="button"
                    mt={4}
                    colorScheme="teal"
                    variant="solid"
                    borderRadius="10px"
                    onClick={() => handleDeploy("abcd0123")}
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
