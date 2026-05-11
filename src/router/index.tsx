import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegistroPage } from "@/pages/RegistroPage";
import { PlanesPage } from "@/pages/PlanesPage";
import { CatalogoPage } from "@/pages/CatalogoPage";
import { VerificacionPage } from "@/pages/VerificacionPage";
import { DeleteAccountPage } from "@/pages/DeleteAccountPage";
import { PoliticaPrivacidadPage } from "@/pages/legal/PoliticaPrivacidadPage";
import { PoliticaCookiesPage } from "@/pages/legal/PoliticaCookiesPage";
import { TerminosPage } from "@/pages/legal/TerminosPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/registro", element: <RegistroPage /> },
  { path: "/planes", element: <PlanesPage /> },
  { path: "/catalogo", element: <CatalogoPage /> },
  { path: "/verificacion", element: <VerificacionPage /> },
  { path: "/delete-account", element: <DeleteAccountPage /> },
  { path: "/politica-de-privacidad", element: <PoliticaPrivacidadPage /> },
  { path: "/politica-de-cookies", element: <PoliticaCookiesPage /> },
  { path: "/terminos-y-condiciones", element: <TerminosPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
