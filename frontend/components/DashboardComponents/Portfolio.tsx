import React, { useEffect, useState } from "react"
import { useCanister, useConnect } from "@connect2ic/react"
import { UserType } from "../CommonTypes"

const currentUserInitialState: UserType = {
  name: "",
  email: "",
  verified: { Success: false },
  roles: [],
}

const Portfolio: React.FC = () => {
  const { principal } = useConnect()
  const [backend] = useCanister("backend")
  const [currentUser, setCurrentUser] = useState<UserType | null | undefined>(
    currentUserInitialState,
  )

  useEffect(() => {
    const getcurrentUser = async () => {
      try {
        const resGetUser = await backend.getUser(principal)
        console.log("resGetUser")
        console.log(resGetUser)
        setCurrentUser(resGetUser as UserType)
      } catch (error) {
        console.error("Error obtaining current user.", error)
      }
    }

    // getcurrentUser();
  }, [])

  return (
    <>
      <h1>NFT</h1>
    </>
  )
}

export default Portfolio
