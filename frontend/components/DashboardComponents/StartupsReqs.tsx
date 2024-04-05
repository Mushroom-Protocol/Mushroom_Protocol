import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, Input, List, ListItem, Stack, Text, useToast } from '@chakra-ui/react';
import { useCanister } from "@connect2ic/react";


interface Startup {
  owner: object;
  admissionDate: number;
  startupId: string;
  startUpName: string;
  email: string;
  website: string;
  startUpSlogan: string;
  shortDes: string;
  logo: Uint8Array | null;
  documents: [[]];
  startupStatus: string;
  tlr: number;
  fullNameTl: string;
  specializationTL: string;
  linkedinTL: string;
  industry: string;
  country: string;
  valoration: number;
  projects: [string];
}

const initialStateStartups = [
  {
    owner: {},
    admissionDate: 0,
    startupId: "",
    startUpName: "",
    email: "",
    website: "",
    startUpSlogan: "",
    shortDes: "",
    logo: null,
    documents: [[]],
    startupStatus: "",
    tlr: 0,
    fullNameTl: "",
    specializationTL: "",
    linkedinTL: "",
    industry: "",
    country: "",
    valoration: 0,
    projects: [""]
  }
] as [Startup]

function blobToBase64(buffer: Uint8Array) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}


const StartupsReqs: React.FC = () => {
  const [backend] = useCanister("backend")
  const [startups, setStartups] = useState<[Startup] | null>(initialStateStartups)
  const [formApprove, setFormApprove] = useState({
    startupValoration: 0,
  })
  const [approvedStartupId, setapprovedStartupId] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    const getIncomingStartUps = async () => {
      try {
        const response = await backend.getIncomingStartUps()
        setStartups(response as [Startup])
      } catch (error) {
        console.error('Error al obtener datos de startups:', error)
      }
    };

    getIncomingStartUps();
  }, [approvedStartupId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormApprove((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleApprove = async (owner, valoration) => {
    let loadingToastId: string | number | undefined

    try {
      loadingToastId = toast({
        title: "Submitting Form",
        status: "loading", // 'loading' es el status para el estilo de carga
        duration: null,
        isClosable: false,
        variant: "solid",
      })

      const resGetIncomingStartupByOwner = await backend.getIncomingStartupByOwner(owner);
      const resGetIncomingStartupByOwnerOk = resGetIncomingStartupByOwner['ok']
      const resApproveStartUp = await backend.approveStartUp(resGetIncomingStartupByOwnerOk, parseInt(valoration), owner)
      setapprovedStartupId(resApproveStartUp['ok'])

      if (loadingToastId !== undefined) {
        toast.close(loadingToastId)
      }

      toast({
        title: "Successful Submission",
        // description: `Id de statup aprobada: ${approvedStartupId}`,
        description: `Id de statup aprobada: ${resApproveStartUp['ok']}`,
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

      console.error("Error al aprobar startup:", error)
    }
  }


  return (
    <>
      <h1>Solicitudes de Registro de Startup</h1>
      <List spacing={3}>
        {startups.map(startup => {
          return (<ListItem>
            <Card maxW='sm'>
              <CardBody>
                <Image
                  src={"data:image/png;base64," + blobToBase64(startup.logo)}
                  alt='Green double couch with wooden legs'
                  borderRadius='lg'
                />
                <Stack mt='6' spacing='3'>
                  <Heading size='md'>{startup && startup.startUpName}</Heading>
                  <Text>
                    {startup.shortDes}
                  </Text>
                  <Text color='blue.600' fontSize='2xl'>
                    {startup.startUpSlogan}
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <Input id="startupValoration" name="startupValoration" value={formApprove.startupValoration} onChange={handleChange} placeholder="Ingresar valoración..." type="number" />
                <ButtonGroup spacing='2'>
                  <Button colorScheme='blue' onClick={() => handleApprove(startup.owner, formApprove.startupValoration)}>
                    Approve
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          </ListItem>)
        })}
      </List>
    </>
  );
};

export default StartupsReqs;
