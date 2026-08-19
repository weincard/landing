import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Paper,
  Stack,
  Title,
  Text,
  TextInput,
  Button,
  Badge,
  Group,
  Alert,
  Divider,
  Loader,
  Center,
} from "@mantine/core";
import { Gift as GiftIcon, TriangleAlert, CircleCheck, XCircle } from "lucide-react";
import {
  validateGift,
  consumeGift,
  type LoyaltyValidateResult,
  type LoyaltyGiftStatus,
} from "@/api/loyalty";
import { PageMeta } from "@/components/layout/PageMeta";

const STATUS_LABEL: Record<LoyaltyGiftStatus, string> = {
  pending_selection: "El cliente aún no ha elegido su premio",
  claimable: "Listo para entregar",
  redeemed: "Ya fue reclamado",
  expired: "Expirado",
  voided: "Anulado",
};

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ValidarRegaloPage() {
  const [params] = useSearchParams();
  const tokenFromUrl = params.get("token") ?? "";

  const [token, setToken] = useState(tokenFromUrl);
  const [result, setResult] = useState<LoyaltyValidateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [consuming, setConsuming] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [consumed, setConsumed] = useState<{ ok: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (t: string) => {
    const trimmed = t.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setConsumed(null);
    setConfirming(false);
    try {
      const r = await validateGift(trimmed);
      if (!r.found) setError("No se encontró ningún premio con ese código.");
      else setResult(r);
    } catch {
      setError("Ocurrió un error al buscar. Verifica el código e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-lookup when arriving via a scanned QR (?token=…).
  useEffect(() => {
    if (tokenFromUrl) lookup(tokenFromUrl);
  }, [tokenFromUrl, lookup]);

  const doConsume = async () => {
    setConsuming(true);
    setError(null);
    try {
      const r = await consumeGift(token.trim());
      if (r.ok) {
        setConsumed({ ok: true, message: "Premio marcado como entregado." });
        setResult((prev) => (prev ? { ...prev, status: "redeemed" } : prev));
      } else {
        const reasonMsg =
          r.reason === "already_redeemed"
            ? "Este premio ya había sido reclamado."
            : r.reason === "pending_selection"
              ? "El cliente todavía no ha elegido su premio."
              : "Este premio no se puede entregar (expirado, anulado o no válido).";
        setConsumed({ ok: false, message: reasonMsg });
      }
    } catch {
      setConsumed({ ok: false, message: "Error al marcar el premio. Inténtalo de nuevo." });
    } finally {
      setConsuming(false);
      setConfirming(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Validar regalo"
        description="Validación de premios de fidelidad Weincard para restaurantes aliados."
      />
      <Container size="xs" py="xl">
        <Stack gap="lg">
          <Group gap="xs" justify="center">
            <GiftIcon size={28} />
            <Title order={2} ta="center">
              Validar premio Weincard
            </Title>
          </Group>
          <Text c="dimmed" size="sm" ta="center">
            Escanea el QR del cliente o escribe el código de su premio para validarlo y entregarlo.
          </Text>

          <Paper withBorder radius="lg" p="md">
            <Group align="flex-end" gap="sm">
              <TextInput
                label="Código del premio"
                placeholder="Ej. ABCD1234EF"
                value={token}
                onChange={(e) => setToken(e.currentTarget.value)}
                onKeyDown={(e) => e.key === "Enter" && lookup(token)}
                style={{ flex: 1 }}
              />
              <Button onClick={() => lookup(token)} loading={loading}>
                Buscar
              </Button>
            </Group>
          </Paper>

          {loading && (
            <Center py="md">
              <Loader />
            </Center>
          )}

          {error && (
            <Alert color="red" icon={<XCircle size={18} />}>
              {error}
            </Alert>
          )}

          {result && result.found && (
            <Paper withBorder radius="lg" p="lg">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Badge size="lg" variant="light" color="dark">
                    {result.tierName}
                  </Badge>
                  <Badge
                    variant="light"
                    color={
                      result.status === "claimable"
                        ? "teal"
                        : result.status === "redeemed"
                          ? "green"
                          : "gray"
                    }
                  >
                    {result.status ? STATUS_LABEL[result.status] : ""}
                  </Badge>
                </Group>

                <div>
                  <Text fw={700} size="lg">
                    {result.item ?? "Sin elegir"}
                  </Text>
                  {result.merchant && (
                    <Text size="sm" c="dimmed">
                      {result.merchant}
                    </Text>
                  )}
                </div>

                {result.status === "redeemed" && (
                  <Alert color="green" icon={<CircleCheck size={18} />}>
                    Ya reclamado{result.redeemedAt ? ` el ${formatDateTime(result.redeemedAt)}` : ""}.
                  </Alert>
                )}

                {consumed && (
                  <Alert
                    color={consumed.ok ? "green" : "red"}
                    icon={consumed.ok ? <CircleCheck size={18} /> : <XCircle size={18} />}
                  >
                    {consumed.message}
                  </Alert>
                )}

                {result.status === "claimable" && !consumed && (
                  <>
                    <Divider />
                    {!confirming ? (
                      <Button
                        color="teal"
                        size="md"
                        radius="md"
                        onClick={() => setConfirming(true)}
                      >
                        Marcar como entregado
                      </Button>
                    ) : (
                      <Alert color="orange" icon={<TriangleAlert size={18} />}>
                        <Text size="sm" mb="sm">
                          Marca esto solo cuando entregues el premio al cliente. La acción es
                          permanente y consume el premio: no se podrá volver a reclamar.
                        </Text>
                        <Group>
                          <Button
                            color="teal"
                            onClick={doConsume}
                            loading={consuming}
                          >
                            Sí, entregar y consumir
                          </Button>
                          <Button variant="default" onClick={() => setConfirming(false)}>
                            Cancelar
                          </Button>
                        </Group>
                      </Alert>
                    )}
                  </>
                )}
              </Stack>
            </Paper>
          )}
        </Stack>
      </Container>
    </>
  );
}
