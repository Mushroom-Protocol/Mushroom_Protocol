import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, List, ListItem, Stack, Text } from '@chakra-ui/react';
import { useCanister } from "@connect2ic/react";

const StartupsReqs: React.FC = () => {
  const [backend] = useCanister("backend");
  const [startups, setStartups] = useState<[
    {
      startUpName: string;
      email: string;
      website: string;
      startUpSlogan: string;
      shortDes: string;
      logo: [];
      startupStatus: string;
      tlr: number;
      fullNameTl: string;
      specializationTL: string;
      linkedinTL: string;
      industry: string;
      country: string;
    }
  ]>([
    {
      startUpName: "",
      email: "",
      website: "",
      startUpSlogan: "",
      shortDes: "",
      logo: [],
      startupStatus: "",
      tlr: 0,
      fullNameTl: "",
      specializationTL: "",
      linkedinTL: "",
      industry: "string",
      country: ""
    }
  ]);

  useEffect(() => {
    const getIncomingStartUps = async () => {
      try {
        const response = await backend.getIncomingStartUps()
        await setStartups(response as [{
          startUpName: string;
          email: string;
          website: string;
          startUpSlogan: string;
          shortDes: string;
          logo: [];
          startupStatus: string;
          tlr: number;
          fullNameTl: string;
          specializationTL: string;
          linkedinTL: string;
          industry: string;
          country: string;
        }])
      } catch (error) {
        console.error('Error al obtener datos de startups:', error)
      }
    };

    getIncomingStartUps();
  }, []);

  return (
    <>
      <h1>Solicitudes de Registro de Startup</h1>
      <List spacing={3}>
        {startups.map(startup => {
          return (<ListItem>
            <Card maxW='sm'>
              <CardBody>
                <Image
                  src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
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
                  <Button variant='ghost' colorScheme='blue'>
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