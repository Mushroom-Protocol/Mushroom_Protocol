import React, { useEffect, useState } from 'react';
import { Link as ChakraLink, List, ListItem } from '@chakra-ui/react';
import { useCanister } from "@connect2ic/react";
import { Link as ReactRouterLink } from 'react-router-dom'

const AdminPanel: React.FC = () => {
  const [backend] = useCanister("backend");
  const [startupInfo, setStartupInfo] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.getIncomingStartUps();
        const data = response[0];
        setStartupInfo(`<h1>${data.startUpName}</h1><h2>${data.shortDes}</h2>`);
      } catch (error) {
        console.error('Error al obtener datos de startups:', error);
        // Puedes manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: startupInfo || '' }} />

      <h1>Panel de administración</h1>
      <List spacing={3}>
        <ListItem>
          <ChakraLink as={ReactRouterLink} to='Whitelist'>
            Ver Whitelist
          </ChakraLink>
        </ListItem>
        <ListItem>
          <ChakraLink as={ReactRouterLink} to='StartupsReqs'>
            Solicitudes de Registro de Startup
          </ChakraLink>
        </ListItem>
        <ListItem>
          <ChakraLink as={ReactRouterLink} to='Admin/Startups'>
            Lista de Startups
          </ChakraLink>
        </ListItem>
        <ListItem>
          <ChakraLink as={ReactRouterLink} to='Admin/FundReqs'>
            Solicitudes de financiamiento
          </ChakraLink>
        </ListItem>
        <ListItem>
          <ChakraLink as={ReactRouterLink} to='Admin/Projects'>
            Lista de Proyectos
          </ChakraLink>
        </ListItem>
      </List>
    </>
  );
};

export default AdminPanel;
