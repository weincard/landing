import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Title,
  SimpleGrid,
  Group,
  Button,
  Text,
  Skeleton,
  Paper,
  Center,
  Box,
} from "@mantine/core";
import { Compass } from "lucide-react";
import { useFilteredBranches } from "@/hooks/useBranches";
import { useCategories } from "@/hooks/useCategories";
import { FilterPanel, type ExploreFilters } from "@/components/explore/FilterPanel";
import { BranchCard } from "@/components/catalog/BranchCard";
import { PageMeta } from "@/components/layout/PageMeta";
import type { Branch } from "@/types";

const INITIAL_FILTERS: ExploreFilters = {
  search: "",
  categoryIds: [],
  validDays: [],
  offerTypes: [],
};

export function ExplorePage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ExploreFilters>(INITIAL_FILTERS);
  const { data: categories = [] } = useCategories();

  const apiFilters = useMemo(
    () => ({
      name: filters.search || undefined,
      categoryIds: filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
      validDays: filters.validDays.length > 0 ? filters.validDays : undefined,
      offerTypes: filters.offerTypes.length > 0 ? filters.offerTypes : undefined,
    }),
    [filters]
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useFilteredBranches(apiFilters);

  const branches: Branch[] = data?.pages.flatMap((p) => p.branches) ?? [];
  const totalCount = data?.pages[0]?.count ?? 0;

  function handleOpen(branch: Branch) {
    navigate(`/app/explore/${branch.branchId}`);
  }

  return (
    <>
      <PageMeta title="Explorar" description="Descubre restaurantes Weincard." path="/app/explore" />
      <Stack gap="lg" py="lg">
        <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
          Explorar
        </Title>

        <Group align="flex-start" gap="xl">
          {/* Sidebar filters */}
          <Box
            w={240}
            visibleFrom="md"
            style={{ flexShrink: 0, position: "sticky", top: 80 }}
          >
            <Paper radius="xl" p="lg" withBorder>
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                categories={categories}
              />
            </Paper>
          </Box>

          {/* Results */}
          <Stack flex={1} gap="md" style={{ minWidth: 0 }}>
            {/* Mobile filters */}
            <Box hiddenFrom="md">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                categories={categories}
              />
            </Box>

            {!isLoading && !isError && (
              <Text size="sm" c="dimmed">
                {totalCount} restaurante{totalCount !== 1 ? "s" : ""}
              </Text>
            )}

            {isLoading && (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} height={260} radius="lg" />
                ))}
              </SimpleGrid>
            )}

            {isError && (
              <Paper radius="xl" p="xl" withBorder style={{ textAlign: "center" }}>
                <Text c="red" size="sm">
                  Error al cargar restaurantes. Intenta de nuevo.
                </Text>
              </Paper>
            )}

            {!isLoading && !isError && branches.length === 0 && (
              <Center py={80}>
                <Stack align="center" gap="sm">
                  <Compass size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
                  <Text c="dimmed" size="sm">
                    No se encontraron restaurantes con esos filtros.
                  </Text>
                  <Button
                    variant="subtle"
                    color="dark"
                    size="xs"
                    onClick={() => setFilters(INITIAL_FILTERS)}
                  >
                    Limpiar filtros
                  </Button>
                </Stack>
              </Center>
            )}

            {!isLoading && branches.length > 0 && (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                {branches.map((branch) => (
                  <BranchCard key={branch.branchId} branch={branch} onOpen={handleOpen} />
                ))}
              </SimpleGrid>
            )}

            {hasNextPage && (
              <Group justify="center" mt="md">
                <Button
                  variant="outline"
                  color="dark"
                  onClick={() => fetchNextPage()}
                  loading={isFetchingNextPage}
                >
                  Ver más
                </Button>
              </Group>
            )}
          </Stack>
        </Group>
      </Stack>
    </>
  );
}
