import React, { useEffect, useState } from 'react';
import { List, ListItem, Text } from '@chakra-ui/react';
import { useCanister, useConnect } from "@connect2ic/react";
import { UserType } from "../CommonTypes";


const currentUserInitialState: UserType = {
  name: "",
  email: "",
  verified: {Success: false},
  roles: []
}


const DashboardHome: React.FC = () => {
  const {principal} = useConnect();
  const [backend] = useCanister("backend");
  const [currentUser, setCurrentUser] = useState<UserType | null | undefined>(currentUserInitialState);

  useEffect(() => {
    const getcurrentUser = async () => {
      try {
        const resGetMyUser: [UserType] = await backend.getMyUser() as [UserType]
        console.log("resGetMyUser")
        console.log(resGetMyUser)
        setCurrentUser(resGetMyUser[0] as UserType)
      } catch (error) {
        console.error("Error obtaining current user.", error)
      }
    };

    getcurrentUser();
  }, []);


  return (
    <>
      <h1>{currentUser?.name}</h1>
    </>
  );
};

export default DashboardHome;
