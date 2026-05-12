import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppShell,
  NavLink,
  Group,
  Text,
  Avatar,
  Menu,
  Burger,
  Stack,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  CreditCard,
  Compass,
  TrendingUp,
  Heart,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/app/card",       label: "Mi tarjeta",  icon: CreditCard },
  { href: "/app/explore",    label: "Explorar",    icon: Compass },
  { href: "/app/savings",    label: "Mis ahorros", icon: TrendingUp },
  { href: "/app/favorites",  label: "Favoritos",   icon: Heart },
  { href: "/app/profile",    label: "Perfil",      icon: User },
];

export function AppLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasMembership, membershipName, logout } = useAuth();

  const initials = `${user?.name?.[0] ?? ""}${user?.lastname?.[0] ?? ""}`.toUpperCase() || "WC";
  const fullName = [user?.name, user?.lastname].filter(Boolean).join(" ") || "Usuario";

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <AppShell
      navbar={{ width: 260, breakpoint: "md", collapsed: { mobile: !opened } }}
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="md"
              size="sm"
              color="white"
            />
            <Link to="/" style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/logo-weincard.png"
                alt="Weincard"
                style={{ height: "18px", width: "auto" }}
              />
            </Link>
          </Group>

          <Menu shadow="md" width={220} radius="lg" position="bottom-end">
            <Menu.Target>
              <Avatar
                size={36}
                style={{
                  cursor: "pointer",
                  background: "#fff",
                  color: "#000",
                  fontFamily: '"Clash Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {initials}
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Box px="sm" py="xs">
                <Text
                  size="xs"
                  c="dimmed"
                  tt="uppercase"
                  fw={700}
                  style={{ letterSpacing: "0.08em" }}
                >
                  Sesión iniciada
                </Text>
                <Text fw={700} size="sm" truncate>
                  {fullName}
                </Text>
                {hasMembership && (
                  <Text size="xs" c="green" fw={700} mt={2}>
                    {membershipName ?? "Plan activo"}
                  </Text>
                )}
              </Box>
              <Menu.Divider />
              <Menu.Item
                leftSection={<Settings size={14} />}
                onClick={() => navigate("/app/profile")}
              >
                Perfil y configuración
              </Menu.Item>
              <Menu.Item
                leftSection={<CreditCard size={14} />}
                onClick={() => navigate("/app/membership")}
              >
                Membresía
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<LogOut size={14} />}
                onClick={handleLogout}
              >
                Cerrar sesión
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap={4}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <NavLink
              key={href}
              component={Link}
              to={href}
              label={label}
              leftSection={<Icon size={16} />}
              active={location.pathname.startsWith(href)}
              onClick={close}
              style={{
                color: location.pathname.startsWith(href)
                  ? "#fff"
                  : "rgba(255,255,255,0.6)",
              }}
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main bg="gray.0">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
