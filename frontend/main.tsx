import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';


const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#001122', // 
        // color: 'yourFontColor',
        color: 'white',
      },
    },
  }
  // Agrega otras modificaciones según sea necesario
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);