import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { ErrorPage } from "@/pages/ErrorPage";
import { RegistroPage } from "@/pages/RegistroPage";
import { PlanesPage } from "@/pages/PlanesPage";
import { CatalogoPage } from "@/pages/CatalogoPage";
import { VerificacionPage } from "@/pages/VerificacionPage";
import { DeleteAccountPage } from "@/pages/DeleteAccountPage";
import { PoliticaPrivacidadPage } from "@/pages/legal/PoliticaPrivacidadPage";
import { PoliticaCookiesPage } from "@/pages/legal/PoliticaCookiesPage";
import { TerminosPage } from "@/pages/legal/TerminosPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { MembershipCardPage } from "@/pages/app/MembershipCardPage";
import { MembershipManagementPage } from "@/pages/app/MembershipManagementPage";
import { ExplorePage } from "@/pages/app/ExplorePage";
import { BranchDetailPage } from "@/pages/app/BranchDetailPage";
import { RedeemPage } from "@/pages/app/RedeemPage";
import { SavingsPage } from "@/pages/app/SavingsPage";
import { FavoritesPage } from "@/pages/app/FavoritesPage";
import { ProfilePage } from "@/pages/app/ProfilePage";

export const router = createBrowserRouter([
  // Pathless root route: its errorElement catches any render/loader error from
  // any descendant route, so users get the friendly ErrorPage instead of React
  // Router's raw error screen.
  {
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
  // Public routes
  { path: "/", element: <HomePage /> },
  // Unified auth entry point at /registro (marketing-locked path). Legacy /login
  // redirects here so existing links keep working.
  { path: "/registro", element: <RegistroPage /> },
  { path: "/login", element: <Navigate to="/registro" replace /> },
  { path: "/planes", element: <PlanesPage /> },
  { path: "/catalogo", element: <CatalogoPage /> },
  { path: "/verificacion", element: <VerificacionPage /> },
  { path: "/delete-account", element: <DeleteAccountPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/politica-de-privacidad", element: <PoliticaPrivacidadPage /> },
  { path: "/politica-de-cookies", element: <PoliticaCookiesPage /> },
  { path: "/terminos-y-condiciones", element: <TerminosPage /> },

  // Protected app shell
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/app", element: <Navigate to="/app/card" replace /> },
          { path: "/app/card", element: <MembershipCardPage /> },
          { path: "/app/explore", element: <ExplorePage /> },
          { path: "/app/explore/:branchId", element: <BranchDetailPage /> },
          { path: "/app/savings", element: <SavingsPage /> },
          { path: "/app/favorites", element: <FavoritesPage /> },
          { path: "/app/profile", element: <ProfilePage /> },
          { path: "/app/membership", element: <MembershipManagementPage /> },
          { path: "/app/redeem/:branchId", element: <RedeemPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
