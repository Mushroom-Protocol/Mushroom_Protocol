import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, List, ListItem, Stack, Text } from '@chakra-ui/react';
import { useCanister, useConnect } from "@connect2ic/react";

interface IncomingStartUp {
  startUpName : string;
  email : string;
  website : string;
  startUpSlogan : string;
  shortDes : string;
  logo : [];
  startupStatus : string;
  tlr : number;
  fullNameTl : string;
  specializationTL : string;
  linkedinTL : string;
  industry : string;
  country : string;
};

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
  const {principal} = useConnect()
  const [startups, setStartups] = useState<[Startup] | null>(initialStateStartups)

  useEffect(() => {
    const getIncomingStartUps = async () => {
      try {
        const response = await backend.getIncomingStartUps()
        console.log(response)
        setStartups(response as [Startup])
      } catch (error) {
        console.error('Error al obtener datos de startups:', error)
      }
    };

    getIncomingStartUps();
  }, []);

  const approveStartUp = async (owner) => {
    const resGetIncomingStartupByOwner = await backend.getIncomingStartupByOwner(owner);
    const resGetIncomingStartupByOwnerOk = resGetIncomingStartupByOwner['ok']
    const valoration = 4
    const resApproveStartUp = await backend.approveStartUp(resGetIncomingStartupByOwnerOk, valoration, owner)
    console.log(resApproveStartUp)
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
                <ButtonGroup spacing='2'>
                  <Button variant='ghost' colorScheme='blue' onClick={() => approveStartUp(startup.owner)}>
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
