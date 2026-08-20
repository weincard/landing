import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Badge,
  Box,
  Button,
  Center,
  Group,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { AlertCircle, ArrowLeft, Bike, Clock, MapPinOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBranchCatalog } from "@/api/deliveries";
import { useBranchDetail } from "@/hooks/useBranches";
import { useDeliveryPin } from "@/lib/deliveryLocation";
import { DeliveryLocationBar } from "@/components/delivery/DeliveryLocationBar";
import { PageMeta } from "@/components/layout/PageMeta";

const formatCop = (n: number) =>
  `$${Math.round(Number(n)).toLocaleString("es-CO")}`;

// Browse-only branch menu (deliveries v2 catalogs). The order itself still
// goes through the contact flow (/app/delivery/:branchId) — this page shows
// what the ally offers, with per-branch prices and availability. openNow /
// inCoverage are re-checked here (the race guard: the branch may have closed,
// or the pin moved, while the user browsed the listing).
export function MenuPage() {
  const { branchId: branchIdParam } = useParams<{ branchId: string }>();
  const branchId = Number(branchIdParam ?? "0");
  const navigate = useNavigate();
  const pin = useDeliveryPin();

  const { data: branch } = useBranchDetail(branchId, []);
  const {
    data: catalog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["branch-catalog", branchId, pin],
    enabled: branchId > 0,
    queryFn: () => getBranchCatalog(branchId, pin).then((r) => r.data),
  });

  const closed = catalog ? !catalog.openNow : false;
  const outOfCoverage = catalog?.inCoverage === false;
  const canOrder = !!catalog && !closed && !outOfCoverage;

  return (
    <>
      <PageMeta
        title={branch ? `Menú — ${branch.name}` : "Menú"}
        description="Menú de domicilios del aliado."
        path={`/menu/${branchId}`}
      />
      <Stack gap="lg" py="lg" maw={640} mx="auto" px="md">
        <Button
          variant="subtle"
          color="dark"
          size="xs"
          leftSection={<ArrowLeft size={14} />}
          onClick={() => navigate(-1)}
          style={{ alignSelf: "flex-start" }}
        >
          Volver
        </Button>

        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
              {branch?.name ?? "Menú"}
            </Title>
            {branch?.deliveryConfig?.estimatedTime && (
              <Group gap={6}>
                <Clock size={13} />
                <Text size="xs" c="dimmed">
                  {branch.deliveryConfig.estimatedTime}
                </Text>
              </Group>
            )}
          </Stack>
          <DeliveryLocationBar />
        </Group>

        {closed && (
          <Alert
            icon={<Clock size={16} />}
            color="yellow"
            variant="light"
            title="Cerrado en este momento"
          >
            Esta sucursal no está recibiendo domicilios ahora. Puedes mirar el
            menú y volver en su horario.
          </Alert>
        )}
        {outOfCoverage && (
          <Alert
            icon={<MapPinOff size={16} />}
            color="red"
            variant="light"
            title="Fuera de cobertura"
          >
            Esta sucursal no llega a la ubicación que elegiste. Cambia la
            ubicación de entrega o explora otros domicilios.
          </Alert>
        )}

        {isLoading && (
          <Center py={60}>
            <Loader color="dark" />
          </Center>
        )}
        {isError && (
          <Alert icon={<AlertCircle size={16} />} color="red" variant="light">
            No pudimos cargar el menú. Intenta de nuevo.
          </Alert>
        )}
        {catalog && !catalog.sections.length && (
          <Text c="dimmed" size="sm">
            Este aliado aún no tiene menú publicado.
          </Text>
        )}

        {(catalog?.sections ?? []).map((section) => (
          <Stack key={section.name} gap="xs">
            <Title order={4} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
              {section.name}
            </Title>
            {section.items.map((item) => (
              <Paper
                key={item.masterProductId}
                withBorder
                radius="lg"
                p="sm"
                style={{ opacity: item.isAvailable ? 1 : 0.55 }}
              >
                <Group wrap="nowrap" align="flex-start" justify="space-between">
                  <Box style={{ flex: 1 }}>
                    <Group gap="xs">
                      <Text fw={600} size="sm">
                        {item.name}
                      </Text>
                      {!item.isAvailable && (
                        <Badge size="xs" color="gray">
                          Agotado
                        </Badge>
                      )}
                    </Group>
                    {item.description && (
                      <Text size="xs" c="dimmed" mt={2} lineClamp={2}>
                        {item.description}
                      </Text>
                    )}
                    <Text fw={700} size="sm" mt={4}>
                      {formatCop(item.price)}
                    </Text>
                  </Box>
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      w={72}
                      h={72}
                      radius="md"
                      fit="cover"
                    />
                  )}
                </Group>
              </Paper>
            ))}
          </Stack>
        ))}

        {catalog && catalog.sections.length > 0 && (
          <Button
            color="dark"
            radius="xl"
            size="md"
            leftSection={<Bike size={16} />}
            disabled={!canOrder}
            onClick={() => navigate(`/app/delivery/${branchId}`)}
          >
            {canOrder ? "Pedir domicilio" : closed ? "Cerrado ahora" : "Fuera de cobertura"}
          </Button>
        )}
      </Stack>
    </>
  );
}
