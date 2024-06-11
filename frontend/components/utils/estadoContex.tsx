import { useCanister, useConnect } from "@connect2ic/react"
import React, { createContext, useState, ReactNode, useEffect } from "react"
import { UserType, initialStateUser } from "../CommonTypes"

// Definir el tipo para el estado
interface EstadoType {
  estado: string
  setEstado: React.Dispatch<React.SetStateAction<string>>
  currentUser: UserType
  setCurrentUser: React.Dispatch<React.SetStateAction<UserType>>
}

// Crear un Context con el tipo definido
export const EstadoContext = createContext<EstadoType | undefined>(undefined)

interface EstadoProviderProps {
  children: ReactNode
}

export const EstadoProvider = ({ children }: EstadoProviderProps) => {
  const [estado, setEstado] = useState<string>("")
  const [backend] = useCanister("backend")
  const { isConnected } = useConnect()
  const [currentUser, setCurrentUser] = useState<UserType>()

  useEffect(() => {
    const getMyUser = async () => {
      const myUser = (await backend.getMyUser()) as UserType[]
      return myUser
    }

    isConnected
      ? getMyUser().then((responseUser) => {
          if (responseUser.length > 0) {
            setCurrentUser(responseUser[0] as UserType)
          }
        })
      : setCurrentUser(initialStateUser)
  }, [isConnected])

  return (
    <EstadoContext.Provider value={{ estado, setEstado, currentUser, setCurrentUser }}>
      {children}
    </EstadoContext.Provider>
  )
}
