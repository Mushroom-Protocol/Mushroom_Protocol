import React from 'react'
import BannerLaunchpad from '../components/Launchpad/BannerLaunchpad'
import { Flex } from "@chakra-ui/react"
import LaunchpadNFT from '../components/Launchpad/LaunchpadNFT'
import JoinDiscord from '../components/home/JoinDiscord'

export default function LaunchPadPage() {
  return (
    <>
    <Flex p={2}></Flex>
    <LaunchpadNFT/>
    <Flex p={0}></Flex>
      <br/>
  
    </>
  )
}
