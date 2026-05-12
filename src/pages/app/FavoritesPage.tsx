import { Link, useNavigate } from "react-router-dom";
import {
  Stack,
  Title,
  Text,
  SimpleGrid,
  Center,
  Button,
  Skeleton,
  ActionIcon,
  Box,
} from "@mantine/core";
import { Heart, HeartOff } from "lucide-react";
import { toast } from "sonner";
import { useFavorites, useRemoveFavorite } from "@/hooks/useFavorites";
import { BranchCard } from "@/components/catalog/BranchCard";
import { PageMeta } from "@/components/layout/PageMeta";
import type { Branch } from "@/types";

export function FavoritesPage() {
  const navigate = useNavigate();
  const { data: favorites = [], isLoading } = useFavorites();
  const removeFav = useRemoveFavorite();

  function handleRemove(branchId: number, branchName: string) {
    removeFav.mutate(branchId, {
      onSuccess: () => toast.success(`${branchName} eliminado de favoritos.`),
      onError: () => toast.error("No se pudo eliminar."),
    });
  }

  return (
    <>
      <PageMeta title="Favoritos" description="Tus restaurantes guardados." path="/app/favorites" />
      <Stack gap="xl" py="lg">
        <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
          Favoritos
        </Title>

        {isLoading && (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={260} radius="lg" />
            ))}
          </SimpleGrid>
        )}

        {!isLoading && favorites.length === 0 && (
          <Center py={80}>
            <Stack align="center" gap="sm">
              <Heart size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
              <Text c="dimmed" size="sm">
                No tienes restaurantes guardados todavía
              </Text>
              <Button component={Link} to="/app/explore" variant="subtle" color="dark" size="xs">
                Explorar restaurantes
              </Button>
            </Stack>
          </Center>
        )}

        {!isLoading && favorites.length > 0 && (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {favorites.map(({ favoriteId, branch }) => (
              <Box key={favoriteId} style={{ position: "relative" }}>
                <BranchCard
                  branch={branch}
                  onOpen={(b: Branch) => navigate(`/app/explore/${b.branchId}`)}
                />
                <ActionIcon
                  onClick={() => handleRemove(branch.branchId, branch.name)}
                  loading={removeFav.isPending}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "rgba(255,255,255,0.9)",
                  }}
                  variant="filled"
                  color="red"
                  size="sm"
                  radius="xl"
                  title="Quitar de favoritos"
                >
                  <HeartOff size={12} />
                </ActionIcon>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </>
  );
}
