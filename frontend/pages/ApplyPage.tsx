import React, { useEffect, useState } from 'react'
import { Flex, Center, Text } from '@chakra-ui/react';
import BannerApply from "../components/Apply/BannerApply"
import StartupForms from "../components/Apply/StartupForms"
import ProyectForms from "../components/Apply/ProyectForms"
import ColecctionForm from "../components/Apply/ColecctionForm"
import JoinDiscord from '../components/home/JoinDiscord'
import { useCanister, useConnect } from '@connect2ic/react';


interface UserType {
  name: string
  email: string
  verified: object
  roles: []
}

const initialStateUser = {
  name: "",
  email: "",
  verified: {},
  roles: []
}


export default function ApplyPage() {
  const [backend] = useCanister("backend");
  const { isConnected } = useConnect()
  const [user, setUser] = useState(initialStateUser)

  useEffect(() => {
    const getMyUser = async () => {
      const myUser = await backend.getMyUser()
      return myUser as [UserType]
    }

    isConnected
      ? getMyUser().then((responseUser) => {
          if (responseUser.length > 0) {
            setUser(responseUser[0] as UserType)
          }
        })
      : setUser(initialStateUser)
  }, [isConnected])

  const isUserRoleStartup = roles => {
    let isUserRoleStartupFlag = false
    roles.map(elm => {
      if (elm.Startup && elm.Startup.length > 0) {
        isUserRoleStartupFlag = true
      }
    })
    return isUserRoleStartupFlag
  }


  return (
    <>
      {
        !window.location.pathname.startsWith('/Dashboard') &&
        <BannerApply/>
      }
      {
        window.location.pathname.startsWith('/Dashboard') && <br />
      }
      {
        user?.verified['Success'] === true && !isUserRoleStartup(user.roles) ?
          <StartupForms/>
        : <></>
      }
      <br />
      {
        window.location.pathname.startsWith('/Dashboard') &&
        <>
          {
            user?.verified['Success'] === true 
              && user?.roles.length > 0 
              && isUserRoleStartup(user.roles) 
            ?
              <>
                <ProyectForms/>
                <br />
                <ColecctionForm/>
              </>
            : <></>
          }
        </>
      }
      <br />
      <br />
    </>
  )
}