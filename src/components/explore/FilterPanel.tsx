import { Stack, TextInput, MultiSelect, Chip, Group, Button, Text } from "@mantine/core";
import { Search, X } from "lucide-react";
import type { Category } from "@/types";
import { DAY_ORDER, DAY_LETTER } from "@/components/catalog/DayBadges";

export interface ExploreFilters {
  search: string;
  categoryIds: number[];
  validDays: string[];
  offerTypes: string[];
}

const OFFER_TYPES = [
  { value: "PERCENTAGE", label: "% Descuento" },
  { value: "FIXED_AMOUNT", label: "Monto fijo" },
  { value: "PROMOTION", label: "Promoción" },
  { value: "MENU", label: "Menú" },
];

interface Props {
  filters: ExploreFilters;
  onChange: (f: ExploreFilters) => void;
  categories: Category[];
}

const EMPTY_FILTERS: ExploreFilters = {
  search: "",
  categoryIds: [],
  validDays: [],
  offerTypes: [],
};

function isDirty(f: ExploreFilters) {
  return (
    f.search !== "" ||
    f.categoryIds.length > 0 ||
    f.validDays.length > 0 ||
    f.offerTypes.length > 0
  );
}

export function FilterPanel({ filters, onChange, categories }: Props) {
  const categoryOptions = categories.map((c) => ({
    value: String(c.categoryId),
    label: c.name,
  }));

  return (
    <Stack gap="lg">
      <TextInput
        placeholder="Buscar restaurante..."
        leftSection={<Search size={14} />}
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.currentTarget.value })}
      />

      {categories.length > 0 && (
        <Stack gap={6}>
          <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: "0.07em" }}>
            Categoría
          </Text>
          <MultiSelect
            data={categoryOptions}
            placeholder="Todas"
            value={filters.categoryIds.map(String)}
            onChange={(vals) =>
              onChange({ ...filters, categoryIds: vals.map(Number) })
            }
            clearable
            searchable
          />
        </Stack>
      )}

      <Stack gap={6}>
        <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: "0.07em" }}>
          Días disponibles
        </Text>
        <Chip.Group
          multiple
          value={filters.validDays}
          onChange={(vals) => onChange({ ...filters, validDays: vals })}
        >
          <Group gap={4}>
            {DAY_ORDER.map((day) => (
              <Chip key={day} value={day} size="xs" radius="sm">
                {DAY_LETTER[day]}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      </Stack>

      <Stack gap={6}>
        <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: "0.07em" }}>
          Tipo de beneficio
        </Text>
        <Chip.Group
          multiple
          value={filters.offerTypes}
          onChange={(vals) => onChange({ ...filters, offerTypes: vals })}
        >
          <Group gap={4}>
            {OFFER_TYPES.map((t) => (
              <Chip key={t.value} value={t.value} size="xs" radius="sm">
                {t.label}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      </Stack>

      {isDirty(filters) && (
        <Button
          variant="subtle"
          color="gray"
          size="xs"
          leftSection={<X size={12} />}
          onClick={() => onChange(EMPTY_FILTERS)}
        >
          Limpiar filtros
        </Button>
      )}
    </Stack>
  );
}
