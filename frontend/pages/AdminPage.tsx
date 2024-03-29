import React from 'react'
import { Flex, Center } from '@chakra-ui/react';
import AdminPanel from '../components/DashboardComponents/AdminPanel';
import NatheraDetails from '../components/Nathera/NatheraDetails';
import { Outlet, useLocation } from 'react-router-dom';
import StartupsReqs from '../components/DashboardComponents/StartupsReqs';

export default function AdminPage() {
    const location = useLocation()

    switch (location.pathname) {
        case "/Dashboard/Admin":
            return (
                <AdminPanel />
            )
        case "/Dashboard/Admin/StartupsReqs":
            return (
                <StartupsReqs />
            )
    
        default:
            return <AdminPanel />
    }
}
