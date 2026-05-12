import { Navigate, Outlet } from "react-router-dom";
import { Center, Loader } from "@mantine/core";
import { useAuth } from "@/context/AuthContext";

export function RequireAuth() {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader color="dark" size="md" />
      </Center>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
