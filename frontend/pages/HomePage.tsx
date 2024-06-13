import React from "react"

import PrincipalBanner from "../components/home/PrincipalBanner"
import Statistics from "../components/home/Statistics"
import Banner from "../components/home/Banner"
import FundedProjects from "../components/home/FundedProjects"
import Dappfunctions from "../components/home/Dappfunctions"
import { Flex } from "@chakra-ui/react"
import DeSciEcosystem from "../components/home/DeSciEcosystem"
import JoinDiscord from "../components/home/JoinDiscord"

export const HomePage = () => {
  return (
    <>
      <Flex p={8}></Flex>
      <FundedProjects />
      <Statistics />
      <Flex p={0}></Flex>
      <DeSciEcosystem />
      <Flex p={0}></Flex>
      <Dappfunctions />
      <br/>

      {/*<TableTopUser4iIndustria/>*/}
    </>
  )
}
