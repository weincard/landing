import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  Switch,
} from "@mantine/core";
import { Search, Compass, MapPin } from "lucide-react";
import { useMerchantCategories } from "@/hooks/useMerchantCategories";
import { useCategories } from "@/hooks/useCategories";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useAppConfig } from "@/hooks/useAppConfig";
import {
  useBranchBrowse,
  useDeliveryBranches,
  browseBranches,
  type BrowseFilters,
} from "@/hooks/useBranches";
import type { FoodCategory } from "@/api/categories";
import { BranchCard } from "@/components/catalog/BranchCard";
import { SomosPromoModal } from "@/components/catalog/SomosPromoModal";
import { DAY_ORDER, DAY_LETTER } from "@/components/catalog/DayBadges";
import type { Branch } from "@/types";

const INITIAL: BrowseFilters = {
  search: "",
  merchantCategoryId: null,
  categoryId: null,
  validDays: [],
  nearMe: false,
};

const MC_ALL = "all";
// URL search param mirroring the selected category, so filtered views can be
// linked/shared (e.g. /catalogo?merchantCategoryId=3). Absent = "Todos".
const MC_PARAM = "merchantCategoryId";
const SOMOS = "somos";

interface Props {
  /** What to do when a branch card is opened (route push vs modal). Receives the
   *  browsing category's `allowedChannelIds` so the opener can scope the branch
   *  detail to those channels (e.g. Domicilios → delivery), same as Flutter. */
  onOpenBranch: (branch: Branch, channelIds: number[]) => void;
}

// Shared browse experience for /app/explore and /catalogo. Both are about
// helping users find what they want, so they render the exact same component;
// only the "open a branch" behavior differs (passed via onOpenBranch).
export function BranchBrowser({ onOpenBranch }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<BrowseFilters>(() => {
    const id = Number(searchParams.get(MC_PARAM));
    return Number.isInteger(id) && id > 0
      ? { ...INITIAL, merchantCategoryId: id }
      : INITIAL;
  });
  const [somosModalOpened, setSomosModalOpened] = useState(false);

  const { data: appConfig } = useAppConfig();

  // Keep the URL in sync with the category selection. replace: true so toggling
  // chips doesn't pile up history entries.
  const setMerchantCategoryId = (merchantCategoryId: number | null) => {
    // Switching merchant category resets the food-category chip: the previous
    // selection belongs to another category's chip set.
    setFilters((f) => ({ ...f, merchantCategoryId, categoryId: null }));
    setSearchParams(
      (params) => {
        if (merchantCategoryId)
          params.set(MC_PARAM, String(merchantCategoryId));
        else params.delete(MC_PARAM);
        return params;
      },
      { replace: true },
    );
  };

  const clearFilters = () => {
    setFilters(INITIAL);
    setSearchParams(
      (params) => {
        params.delete(MC_PARAM);
        return params;
      },
      { replace: true },
    );
  };
  // Debounce so typing / toggling chips doesn't fire a request per keystroke.
  const [debounced] = useDebouncedValue(filters, 350);

  const location = useUserLocation();
  const { data: merchantCategories = [] } = useMerchantCategories();

  // LIVE (non-debounced) view of the selected category, for UI decisions like
  // which chip source to use — so the chips don't flash the wrong set for the
  // debounce window after switching category.
  const isDeliveryLive =
    merchantCategories
      .find((mc) => mc.merchantCategoryId === filters.merchantCategoryId)
      ?.slug?.toLowerCase() === "domicilios";

  // Food-category chips scoped to the selected merchant category (same fetch
  // the Flutter CategoryFilterBar uses). Not fetched while on "Todos" — the
  // chips only render inside a category context. Keyed on the LIVE filter (not
  // the debounced one) so the row appears as soon as a category is picked.
  // Domicilios doesn't use this set: its listed branches span all verticals,
  // so the Domicilios-scoped categories wouldn't match them.
  const { data: scopedCategories = [] } = useCategories(
    isDeliveryLive ? null : filters.merchantCategoryId,
  );

  // "Domicilios" is special: like Flutter, it lists via GET /deliveries/branches
  // instead of /branches/tiles. Resolve the selected category to decide, and to
  // carry its allowedChannelIds into the branch-detail navigation.
  const selectedCategory = merchantCategories.find(
    (mc) => mc.merchantCategoryId === debounced.merchantCategoryId,
  );
  const isDelivery = selectedCategory?.slug?.toLowerCase() === "domicilios";
  // The browsing category's channels (e.g. [2] for delivery). Empty when "Todos"
  // is selected → detail fetch stays unscoped, showing all offers.
  const channelIds = selectedCategory?.allowedChannelIds ?? [];

  const browse = useBranchBrowse(debounced, location, !isDelivery);
  // All Domicilios filtering happens SERVER-side (text via the Typesense
  // /deliveries/search, categoryId + validDays on both endpoints).
  const delivery = useDeliveryBranches(location, isDelivery, {
    q: debounced.search,
    categoryId: debounced.categoryId,
    validDays: debounced.validDays,
  });

  // Domicilios chips derive from the UNFILTERED listing (a chip then always
  // matches ≥1 branch, and the row doesn't shrink once a filter applies).
  // Same cache entry as the display query while no filter is active.
  const deliveryBase = useDeliveryBranches(location, isDeliveryLive);
  const deliveryCategories = useMemo<FoodCategory[]>(() => {
    const seen = new Map<number, string>();
    for (const b of deliveryBase.data ?? []) {
      if (b.category.categoryId) seen.set(b.category.categoryId, b.category.name);
    }
    return [...seen]
      .map(([categoryId, name]) => ({ categoryId, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [deliveryBase.data]);

  const foodCategories = isDeliveryLive ? deliveryCategories : scopedCategories;

  const branches = useMemo(() => {
    if (isDelivery) return delivery.data ?? [];
    return browseBranches(browse.data?.pages);
  }, [isDelivery, delivery.data, browse.data]);

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

          <Group gap="xs" align="center">
            <MapPin size={15} style={{ opacity: 0.6 }} />
            <Switch
              size="sm"
              color="dark"
              label="Cerca de mí"
              // Force a dark label so it stays readable on the white filter
              // Paper — the inherited color was rendering white-on-white.
              styles={{ label: { color: "#1B1A1A" } }}
              checked={filters.nearMe}
              onChange={(e) => {
                // Read synchronously: e.currentTarget is null by the time the
                // functional setState updater runs.
                const nearMe = e.currentTarget.checked;
                setFilters((f) => ({ ...f, nearMe }));
              }}
            />
          </Group>

          {merchantCategories.length > 0 && (
            <Chip.Group
              value={
                filters.merchantCategoryId
                  ? String(filters.merchantCategoryId)
                  : MC_ALL
              }
              onChange={(v) => {
                if (v === SOMOS) {
                  setSomosModalOpened(true);
                  return;
                }
                setMerchantCategoryId(!v || v === MC_ALL ? null : Number(v));
              }}
            >
              <Group gap={6}>
                <Chip value={MC_ALL} size="sm" radius="xl">
                  Todos
                </Chip>
                {merchantCategories.map((mc) => (
                  <Chip
                    key={mc.merchantCategoryId}
                    value={String(mc.merchantCategoryId)}
                    size="sm"
                    radius="xl"
                  >
                    {mc.name}
                  </Chip>
                ))}
                <Chip value={SOMOS} size="sm" radius="xl">
                  Somos Internet
                </Chip>
              </Group>
            </Chip.Group>
          )}

          {filters.merchantCategoryId != null && foodCategories.length > 0 && (
            <Chip.Group
              value={filters.categoryId ? String(filters.categoryId) : "all"}
              onChange={(v) => {
                const categoryId = !v || v === "all" ? null : Number(v);
                setFilters((f) => ({ ...f, categoryId }));
              }}
            >
              <Group gap={6}>
                <Chip value="all" size="xs" radius="xl" color="dark">
                  Todas
                </Chip>
                {foodCategories.map((cat) => (
                  <Chip
                    key={cat.categoryId}
                    value={String(cat.categoryId)}
                    size="xs"
                    radius="xl"
                    color="dark"
                  >
                    {cat.name}
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
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                c="dimmed"
                style={{ letterSpacing: "0.07em", marginRight: 4 }}
              >
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
            <Button
              variant="subtle"
              color="dark"
              size="xs"
              onClick={clearFilters}
            >
              Limpiar filtros
            </Button>
          </Stack>
        </Center>
      )}

      {!isLoading && branches.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
          {branches.map((branch) => (
            <BranchCard
              key={branch.branchId}
              branch={branch}
              onOpen={(b) => onOpenBranch(b, channelIds)}
            />
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

      {appConfig?.somosPromo && (
        <SomosPromoModal
          opened={somosModalOpened}
          onClose={() => setSomosModalOpened(false)}
          somosPromo={appConfig.somosPromo}
        />
      )}
    </Stack>
  );
}
