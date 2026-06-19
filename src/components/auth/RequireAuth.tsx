import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Center, Loader } from "@mantine/core";
import { useAuth } from "@/context/AuthContext";

export function RequireAuth() {
  const { isLoading, isLoggedIn } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader color="dark" size="md" />
      </Center>
    );
  }

  if (!isLoggedIn) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/registro?next=${next}`} replace />;
  }

  return <Outlet />;
}
