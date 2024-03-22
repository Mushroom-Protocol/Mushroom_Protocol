import React, { useEffect, useState } from 'react';
import { List, ListItem, Text } from '@chakra-ui/react';
import { useCanister } from "@connect2ic/react";

const Whitelist: React.FC = () => {
  const [backend] = useCanister("backend");
  const [startups, setStartups] = useState<[] | null>([]);

  useEffect(() => {
    const getIncomingStartUps = async () => {
      try {
        const response = await backend.getIncomingStartUps()
        setStartups(response as [])
      } catch (error) {
        console.error('Error al obtener datos de startups:', error)
      }
    };

    getIncomingStartUps();
  }, []);

  return (
    <>
      <h1>Whitelist</h1>
      <List spacing={3}>
        {startups.map(startup => {
          return (<ListItem>
            <Text>
              {JSON.stringify(startup)}
            </Text>
          </ListItem>)
        })}
      </List>
    </>
  );
};

export default Whitelist;
