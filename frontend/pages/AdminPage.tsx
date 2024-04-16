import React from 'react'
import AdminPanel from '../components/DashboardComponents/AdminPanel';
import { useLocation } from 'react-router-dom';
import StartupsReqs from '../components/DashboardComponents/StartupsReqs';
import StartupsList from '../components/DashboardComponents/StartupsList';
import ProjectsList from '../components/DashboardComponents/ProjectsList';
import ProjectsReqs from '../components/DashboardComponents/ProjectsReqs';

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
        case "/Dashboard/Admin/StartupsList":
            return (
                <StartupsList />
            )
        case "/Dashboard/Admin/ProjectsReqs":
            return (
                <ProjectsReqs />
            )
        case "/Dashboard/Admin/Projects":
            return (
                <ProjectsList />
            )
    
        default:
            return <AdminPanel />
    }
}
