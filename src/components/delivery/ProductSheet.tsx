import { useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Divider,
  Group,
  Image,
  Modal,
  Radio,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { Minus, Plus } from "lucide-react";
import type { CatalogItem, CatalogModifierGroup } from "@/api/deliveries";
import type { CartSelection } from "@/lib/deliveryCart";

const formatCop = (n: number) => `$${Math.round(Number(n)).toLocaleString("es-CO")}`;

export interface ProductSheetResult {
  quantity: number;
  notes: string | null;
  selections: CartSelection[];
  /** Composed unit price: base + Σ priceDelta. */
  unitPrice: number;
}

interface Props {
  item: CatalogItem | null;
  /** Member discount % (catalog.discount.pct) — 0 when none. Mirrors the tile. */
  discountPct: number;
  onClose: () => void;
  onAdd: (result: ProductSheetResult) => void;
}

const isRadio = (g: CatalogModifierGroup) => g.minSelect === 1 && g.maxSelect === 1;

function groupHint(g: CatalogModifierGroup): string {
  if (isRadio(g)) return "Obligatorio · elige 1";
  if (g.minSelect > 0 && g.minSelect === g.maxSelect) return `Obligatorio · elige ${g.minSelect}`;
  if (g.minSelect > 0) return `Elige entre ${g.minSelect} y ${g.maxSelect}`;
  return g.maxSelect === 1 ? "Opcional · máximo 1" : `Opcional · hasta ${g.maxSelect}`;
}

// Catalog v2 — the ONLY add path for every product (with or without groups):
// qty stepper + modifier groups + observation → "Agregar $X" adds a cart line.
export function ProductSheet({ item, discountPct, onClose, onAdd }: Props) {
  // Keyed remount on item change keeps state fresh per product.
  return (
    <Modal
      opened={!!item}
      onClose={onClose}
      title={item?.name ?? ""}
      centered
      radius="lg"
      size="md"
    >
      {item && (
        <SheetBody key={item.masterProductId} item={item} discountPct={discountPct} onAdd={onAdd} />
      )}
    </Modal>
  );
}

function SheetBody({
  item,
  discountPct,
  onAdd,
}: {
  item: CatalogItem;
  discountPct: number;
  onAdd: (r: ProductSheetResult) => void;
}) {
  const groups = useMemo(() => item.modifierGroups ?? [], [item.modifierGroups]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  // groupId → selected option ids
  const [picked, setPicked] = useState<Record<number, number[]>>({});

  const selections = useMemo<CartSelection[]>(() => {
    const out: CartSelection[] = [];
    for (const g of groups) {
      for (const id of picked[g.modifierGroupId] ?? []) {
        const o = g.options.find((x) => x.modifierOptionId === id);
        if (o) out.push({ modifierOptionId: o.modifierOptionId, name: o.name, priceDelta: o.priceDelta, quantity: 1 });
      }
    }
    return out;
  }, [groups, picked]);

  const unitPrice = Math.round(selections.reduce((s, x) => s + x.priceDelta, item.price));
  const discounted = (p: number) => Math.round((p * (100 - discountPct)) / 100);
  const valid = groups.every((g) => {
    const n = (picked[g.modifierGroupId] ?? []).length;
    return n >= g.minSelect && n <= g.maxSelect;
  });
  const lineTotal = unitPrice * quantity;
  const lineTotalDiscounted = discounted(unitPrice) * quantity;

  return (
    <Stack gap="md">
      {item.imageUrl && <Image src={item.imageUrl} radius="md" h={160} fit="cover" />}
      {item.description && (
        <Text size="sm" c="dimmed">
          {item.description}
        </Text>
      )}
      {discountPct > 0 ? (
        <Group gap={6}>
          <Text fw={700} c="green.8">
            {formatCop(discounted(unitPrice))}
          </Text>
          <Text size="sm" c="dimmed" td="line-through">
            {formatCop(unitPrice)}
          </Text>
        </Group>
      ) : (
        <Text fw={700}>{formatCop(unitPrice)}</Text>
      )}

      {groups.map((g) => {
        const sel = picked[g.modifierGroupId] ?? [];
        const atMax = sel.length >= g.maxSelect;
        return (
          <Stack key={g.modifierGroupId} gap={6}>
            <Divider />
            <Group justify="space-between" align="baseline">
              <Text fw={600} size="sm">
                {g.name}
              </Text>
              <Text size="xs" c={g.minSelect > 0 ? "orange.8" : "dimmed"}>
                {groupHint(g)}
              </Text>
            </Group>
            {isRadio(g) ? (
              <Radio.Group
                value={sel[0] != null ? String(sel[0]) : null}
                onChange={(v) => setPicked({ ...picked, [g.modifierGroupId]: v ? [Number(v)] : [] })}
              >
                <Stack gap={6}>
                  {g.options.map((o) => (
                    <Radio
                      key={o.modifierOptionId}
                      value={String(o.modifierOptionId)}
                      disabled={!o.isAvailable}
                      label={<OptionLabel name={o.name} priceDelta={o.priceDelta} isAvailable={o.isAvailable} />}
                    />
                  ))}
                </Stack>
              </Radio.Group>
            ) : (
              <Checkbox.Group
                value={sel.map(String)}
                onChange={(v) =>
                  setPicked({ ...picked, [g.modifierGroupId]: v.map(Number).slice(0, g.maxSelect) })
                }
              >
                <Stack gap={6}>
                  {g.options.map((o) => {
                    const checked = sel.includes(o.modifierOptionId);
                    return (
                      <Checkbox
                        key={o.modifierOptionId}
                        value={String(o.modifierOptionId)}
                        disabled={!o.isAvailable || (!checked && atMax)}
                        label={<OptionLabel name={o.name} priceDelta={o.priceDelta} isAvailable={o.isAvailable} />}
                      />
                    );
                  })}
                </Stack>
              </Checkbox.Group>
            )}
          </Stack>
        );
      })}

      <Divider />
      <Textarea
        label="Observación"
        placeholder="Ej. sin queso, sin salsas"
        maxLength={200}
        autosize
        minRows={2}
        value={notes}
        onChange={(e) => setNotes(e.currentTarget.value)}
      />

      <Group justify="space-between" wrap="nowrap">
        <Group gap="xs" wrap="nowrap">
          <ActionIcon
            variant="light"
            color="dark"
            radius="xl"
            size="lg"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Menos"
          >
            <Minus size={16} />
          </ActionIcon>
          <Text fw={700} w={24} ta="center">
            {quantity}
          </Text>
          <ActionIcon
            variant="filled"
            color="dark"
            radius="xl"
            size="lg"
            disabled={quantity >= 50}
            onClick={() => setQuantity((q) => Math.min(50, q + 1))}
            aria-label="Más"
          >
            <Plus size={16} />
          </ActionIcon>
        </Group>
        <Button
          color="dark"
          radius="xl"
          disabled={!valid}
          style={{ flex: 1 }}
          onClick={() =>
            onAdd({ quantity, notes: notes.trim() || null, selections, unitPrice })
          }
        >
          {discountPct > 0
            ? `Agregar ${formatCop(lineTotalDiscounted)}`
            : `Agregar ${formatCop(lineTotal)}`}
        </Button>
      </Group>
      {!valid && (
        <Text size="xs" c="dimmed" ta="center">
          Completa las elecciones obligatorias para agregar.
        </Text>
      )}
    </Stack>
  );
}

function OptionLabel({
  name,
  priceDelta,
  isAvailable,
}: {
  name: string;
  priceDelta: number;
  isAvailable: boolean;
}) {
  return (
    <Group gap={6} wrap="nowrap">
      <Text size="sm" c={isAvailable ? undefined : "dimmed"}>
        {name}
      </Text>
      {priceDelta > 0 && (
        <Text size="xs" c="dimmed">
          +{formatCop(priceDelta)}
        </Text>
      )}
      {!isAvailable && (
        <Badge size="xs" color="gray">
          Agotado
        </Badge>
      )}
    </Group>
  );
}
