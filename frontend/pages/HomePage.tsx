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
      <PrincipalBanner />
      <Statistics />
      <Flex p={8}></Flex>
      <Banner />
      <Flex p={8}></Flex>
      <FundedProjects />
      <Flex p={8}></Flex>
      <Dappfunctions />
      <Flex p={8}></Flex>
      <DeSciEcosystem />
      <Flex p={8}></Flex>
      <JoinDiscord />

      {/*<TableTopUser4iIndustria/>*/}
    </>
  )
}
