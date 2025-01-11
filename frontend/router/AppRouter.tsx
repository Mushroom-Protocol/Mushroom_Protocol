import { createBrowserRouter, Navigate } from "react-router-dom"
import {
  WithSubnavigation,
  LargeWithNewsletter,
} from "../components"
import { useEffect } from "react"
import { useNavigate, Outlet } from "react-router-dom"
import { HomePage } from "../pages/HomePage"
import LaunchPadPage from "../pages/LaunchPadPage"
import ErrorPage from "../pages/error-page"
import FungiDAOPage from "../pages/FungiDAOPage"
import MarketPlacePage from "../pages/MarketPlacePage"
import StakingPage from "../pages/StakinPage"
import VaultPage from "../pages/VaultPage"
import NatheraPage from "../pages/NatheraPage"
import LandoppPage from "../pages/LandoppPage"
import FoundersPage from "../pages/FoundersPage"
import ApplyPage from "../pages/ApplyPage"
import EONPage from "../pages/EONPage"
import ReciqloPage from "../pages/ReciqloPage"
import DashboardSidebar from "../components/DashboardSidebar"
import AdminPage from "../pages/AdminPage"
import { EstadoProvider } from "../components/utils/estadoContex"
import React from "react"
import StartupsReqs from "../components/DashboardComponents/StartupsReqs"
import Whitelist from "../components/DashboardComponents/Whitelist"
import LaunchpadNFT from "../components/Launchpad/LaunchpadNFT"
import DashboardHome from "../components/DashboardComponents/DashboardHome"
import Portfolio from "../components/DashboardComponents/Portfolio"
import StartupsList from "../components/DashboardComponents/StartupsList"
import ProjectsList from "../components/DashboardComponents/ProjectsList"
import ProjectsReqs from "../components/DashboardComponents/ProjectsReqs"
import UsersPendingVerification from "../components/DashboardComponents/UsersPendingVerification"
import ConnectionsRecords from "../components/DashboardComponents/ConnectionsRecords"
import CollectionsReqs from "../components/DashboardComponents/CollectionsReqs"
import StartupPage from "../pages/StartupPage"
import CollectionsList from "../components/DashboardComponents/CollectionsList"


function Layout() {
  const navigate = useNavigate()

  useEffect(() => {
    // Ejemplo: Si la ruta actual comienza con "/Dashboard", navegar sin el menú principal
    if (window.location.pathname.startsWith("/Dashboard")) {
      navigate("/Dashboard", { replace: true })
    }
  }, [navigate])

  return (
    <>
      <EstadoProvider>
        {/* Renderizar el menú principal solo si no es la ruta del dashboard */}
        {/* {!window.location.pathname.startsWith('/Dashboard') && <WithSubnavigation />} */}
        {!window.location.pathname.startsWith("/Dashboard") && (
          <WithSubnavigation />
        )}
        {/* Outlet renderizará las rutas anidadas */}
        <Outlet />
        {!window.location.pathname.startsWith("/Dashboard") && (
          <LargeWithNewsletter />
        )}
      </EstadoProvider>
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Navigate to="Discover" /> },
      { path: "Discover", element: <HomePage /> },
      { path: "LaunchPad", element: <LaunchPadPage /> },
      { path: "StartupInfo", element: <FoundersPage /> },
      { path: "Nathera", element: <NatheraPage /> },
      { path: "Landopp", element: <LandoppPage /> },
      { path: "EON", element: <EONPage /> },
      { path: "Reciqlo", element: <ReciqloPage /> },
      { path: "Founders", element: <FoundersPage /> },
      { path: "Apply", element: <ApplyPage /> },
      {
        path: "Dashboard",
        // element: <DashboardSidebar children={undefined} />,
        element: <DashboardSidebar children={undefined} />,
        children: [
          { path: "", element: <DashboardHome /> }, // Cambié "/" a ""
          { path: "Admin", element: <AdminPage /> },
          { path: "Portfolio", element: <Portfolio /> },
          { path: "Launchpad", element: <LaunchpadNFT /> },
          { path: "ForResearcher", element: <ApplyPage /> },
          {
            path: "Admin",
            element: <AdminPage />,
            children: [
              { path: "Whitelist", element: <Whitelist /> },
              { path: "StartupsReqs", element: <StartupsReqs /> },
              { path: "StartupsList", element: <StartupsList /> },
              { path: "ProjectsReqs", element: <ProjectsReqs /> },
              { path: "Projects", element: <ProjectsList /> },
              { path: "CollectionsList", element: <CollectionsList /> },
              { path: "CollectionsReqs", element: <CollectionsReqs /> },
              { path: "UsersPendingVerification", element: <UsersPendingVerification /> },
              { path: "ConnectionsRecords", element: <ConnectionsRecords /> },
              { path: "FundReqs", element: <Navigate to="Home" /> },
            ],
          },
        ],
      },
      { path: "MarketPlace", element: <MarketPlacePage /> },
      { path: "FungiDAO", element: <FungiDAOPage /> },
      { path: "Staking", element: <StakingPage /> },
      { path: "Vault", element: <VaultPage /> },
      { path: "/StartUp/:startupId", element: <StartupPage /> },
      { path: "/Project/:projectId", element: <StartupPage /> }
    ],
  },
])
