import React, { createContext, useState, ReactNode } from 'react';

// Definir el tipo para el estado
interface EstadoType {
estado: string,
setEstado: React.Dispatch<React.SetStateAction<string>>
}

// Crear un Context con el tipo definido
export const EstadoContext = createContext<EstadoType | undefined>(undefined);

interface EstadoProviderProps {
  children: ReactNode;
}

export const EstadoProvider = ({ children }: EstadoProviderProps) => {
  const [estado, setEstado] = useState<string>('');

  return (
    <EstadoContext.Provider value={{ estado, setEstado }}>
      {children}
    </EstadoContext.Provider>
  );
};
