import { useMemo, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import {
  Stack,
  Group,
  Paper,
  TextInput,
  Chip,
  Text,
  Button,
  SimpleGrid,
  Skeleton,
  Center,
} from "@mantine/core";
import { Search, Compass } from "lucide-react";
import { useMerchantCategories } from "@/hooks/useMerchantCategories";
import { useUserLocation } from "@/hooks/useUserLocation";
import {
  useBranchBrowse,
  useDeliveryBranches,
  browseBranches,
  type BrowseFilters,
} from "@/hooks/useBranches";
import { BranchCard } from "@/components/catalog/BranchCard";
import { DAY_ORDER, DAY_LETTER } from "@/components/catalog/DayBadges";
import type { Branch } from "@/types";

const INITIAL: BrowseFilters = {
  search: "",
  merchantCategoryId: null,
  validDays: [],
};

const MC_ALL = "all";

interface Props {
  /** What to do when a branch card is opened (route push vs modal). */
  onOpenBranch: (branch: Branch) => void;
}

// Shared browse experience for /app/explore and /catalogo. Both are about
// helping users find what they want, so they render the exact same component;
// only the "open a branch" behavior differs (passed via onOpenBranch).
export function BranchBrowser({ onOpenBranch }: Props) {
  const [filters, setFilters] = useState<BrowseFilters>(INITIAL);
  // Debounce so typing / toggling chips doesn't fire a request per keystroke.
  const [debounced] = useDebouncedValue(filters, 350);

  const location = useUserLocation();
  const { data: merchantCategories = [] } = useMerchantCategories();

  // "Domicilios" is special: like Flutter, it lists via GET /deliveries/branches
  // instead of /branches/tiles. Resolve the selected category's slug to decide.
  const selectedSlug = merchantCategories
    .find((mc) => mc.merchantCategoryId === debounced.merchantCategoryId)
    ?.slug?.toLowerCase();
  const isDelivery = selectedSlug === "domicilios";

  const browse = useBranchBrowse(debounced, location, !isDelivery);
  const delivery = useDeliveryBranches(location, isDelivery);

  // The delivery endpoint returns ALL matching branches (no pagination, no
  // server-side text filter), so filter by the search box client-side.
  const branches = useMemo(() => {
    if (isDelivery) {
      const q = debounced.search.trim().toLowerCase();
      const all = delivery.data ?? [];
      return q ? all.filter((b) => b.name.toLowerCase().includes(q)) : all;
    }
    return browseBranches(browse.data?.pages);
  }, [isDelivery, delivery.data, debounced.search, browse.data]);

  const isLoading = isDelivery ? delivery.isLoading : browse.isLoading;
  const isError = isDelivery ? delivery.isError : browse.isError;
  const hasNextPage = !isDelivery && browse.hasNextPage;
  const isFetchingNextPage = browse.isFetchingNextPage;
  const fetchNextPage = browse.fetchNextPage;

  return (
    <Stack gap="lg">
      {/* Filters bar */}
      <Paper radius="xl" p="lg" withBorder>
        <Stack gap="md">
          <TextInput
            placeholder="Buscar restaurante, comida, categoría..."
            leftSection={<Search size={16} />}
            value={filters.search}
            onChange={(e) => {
              // Read synchronously: e.currentTarget is null by the time the
              // functional setState updater runs.
              const search = e.currentTarget.value;
              setFilters((f) => ({ ...f, search }));
            }}
          />

          {merchantCategories.length > 0 && (
            <Chip.Group
              value={filters.merchantCategoryId ? String(filters.merchantCategoryId) : MC_ALL}
              onChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  merchantCategoryId: !v || v === MC_ALL ? null : Number(v),
                }))
              }
            >
              <Group gap={6}>
                <Chip value={MC_ALL} size="sm" radius="xl">
                  Todos
                </Chip>
                {merchantCategories.map((mc) => (
                  <Chip key={mc.merchantCategoryId} value={String(mc.merchantCategoryId)} size="sm" radius="xl">
                    {mc.name}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          )}

          <Chip.Group
            multiple
            value={filters.validDays}
            onChange={(vals) => setFilters((f) => ({ ...f, validDays: vals }))}
          >
            <Group gap={4}>
              <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: "0.07em", marginRight: 4 }}>
                Días
              </Text>
              {DAY_ORDER.map((day) => (
                <Chip key={day} value={day} size="xs" radius="sm">
                  {DAY_LETTER[day]}
                </Chip>
              ))}
            </Group>
          </Chip.Group>
        </Stack>
      </Paper>

      {/* Results */}
      {isLoading && (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={260} radius="lg" />
          ))}
        </SimpleGrid>
      )}

      {isError && (
        <Paper radius="xl" p="xl" withBorder style={{ textAlign: "center" }}>
          <Text c="red" size="sm">
            No se pudieron cargar los restaurantes. Intenta de nuevo.
          </Text>
        </Paper>
      )}

      {!isLoading && !isError && branches.length === 0 && (
        <Center py={80}>
          <Stack align="center" gap="sm">
            <Compass size={48} strokeWidth={1} style={{ opacity: 0.3 }} />
            <Text c="dimmed" size="sm">
              No se encontraron resultados con esos filtros.
            </Text>
            <Button variant="subtle" color="dark" size="xs" onClick={() => setFilters(INITIAL)}>
              Limpiar filtros
            </Button>
          </Stack>
        </Center>
      )}

      {!isLoading && branches.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
          {branches.map((branch) => (
            <BranchCard key={branch.branchId} branch={branch} onOpen={onOpenBranch} />
          ))}
        </SimpleGrid>
      )}

      {hasNextPage && (
        <Group justify="center" mt="md">
          <Button
            variant="outline"
            color="dark"
            radius="xl"
            onClick={() => fetchNextPage()}
            loading={isFetchingNextPage}
          >
            Ver más
          </Button>
        </Group>
      )}
    </Stack>
  );
}
