import React from 'react'
import { Flex, Center } from '@chakra-ui/react';
import BannerApply from "../components/Apply/BannerApply"
import StartupForms from "../components/Apply/StartupForms"
import ProyectForms from "../components/Apply/ProyectForms"
import ColecctionForm from "../components/Apply/ColecctionForm"
import JoinDiscord from '../components/home/JoinDiscord'

export default function ApplyPage() {
  return (
    <>
    <BannerApply/>
    <StartupForms/>
    <br />
    <ProyectForms/>
    <br />
    <ColecctionForm/>

    <br />
    <br />
    </>
  )
}