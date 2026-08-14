import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Stack,
  Title,
  Text,
  Paper,
  Button,
  Group,
  Center,
  Loader,
  Alert,
  Code,
  CopyButton,
  ActionIcon,
  Badge,
  Box,
} from "@mantine/core";
import {
  ArrowLeft,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  MessageCircle,
  Phone,
  Globe,
  Clock,
  Bike,
  ShoppingBag,
} from "lucide-react";
import { useGenerateDeliveryCode } from "@/hooks/useRedemptions";
import { useBranchDetail } from "@/hooks/useBranches";
import { PageMeta } from "@/components/layout/PageMeta";

function formatMoney(v: number | null | undefined): string | null {
  if (v == null) return null;
  return `$${Math.round(Number(v)).toLocaleString("es-CO")}`;
}

// wa.me wants digits only (country code included, no "+").
function waHref(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

// Same "Pedir domicilio" flow as the mobile RequestDeliveryWidget: generate a
// delivery code for the branch, show the delivery terms + admin-configured
// instructions, then the contact CTA the branch is configured for —
// WhatsApp (prefill + code appended), phone, or the ally's own webpage
// (opened as-is; the user keeps the code at hand).
export function DeliveryPage() {
  const { branchId: branchIdParam } = useParams<{ branchId: string }>();
  const branchId = Number(branchIdParam ?? "0");
  const navigate = useNavigate();
  const { data: branch } = useBranchDetail(branchId, []);
  const generate = useGenerateDeliveryCode();

  // Generate on mount; "Generar otro" re-fires the same mutation.
  useEffect(() => {
    if (branchId > 0) generate.mutate(branchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  const code = generate.data?.code ?? null;
  // The generate response is authoritative for contact; the branch detail's
  // config fills the terms (fee/minimum/time) it doesn't carry.
  const contact = generate.data?.delivery ?? null;
  const cfg = branch?.deliveryConfig ?? null;

  const ct = contact?.contactType ?? cfg?.contactType ?? null;
  const whatsapp = contact?.whatsapp ?? cfg?.whatsapp ?? null;
  const phone = contact?.phone ?? cfg?.phone ?? null;
  const webpageUrl = contact?.webpageUrl ?? cfg?.webpageUrl ?? null;
  const contactMessage = contact?.contactMessage ?? cfg?.contactMessage ?? "";
  const instructions = (contact?.instructions ?? cfg?.instructions ?? "").trim();

  // Mirrors the Flutter sheet: contactType decides the buttons; null falls
  // back to whatever contact exists. Webpage mode is exclusive.
  const showWhatsApp =
    !!whatsapp?.trim() && (ct === "whatsapp" || ct === "both" || ct === null);
  const showPhone =
    !!phone?.trim() && (ct === "phone" || ct === "both" || ct === null);
  const showWebpage = !!webpageUrl?.trim() && ct === "webpage";

  const terms = [
    cfg?.estimatedTime ? { icon: Clock, label: cfg.estimatedTime } : null,
    formatMoney(cfg?.deliveryFee)
      ? { icon: Bike, label: `Envío ${formatMoney(cfg?.deliveryFee)}` }
      : null,
    formatMoney(cfg?.minimumOrder)
      ? { icon: ShoppingBag, label: `Mínimo ${formatMoney(cfg?.minimumOrder)}` }
      : null,
  ].filter(Boolean) as { icon: typeof Clock; label: string }[];

  return (
    <>
      <PageMeta
        title="Pedir domicilio"
        description="Pide a domicilio con tu Weincard."
        path="/app/delivery"
      />
      <Stack gap="lg" py="lg" maw={500} mx="auto">
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

        <Stack gap={4}>
          <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
            Pedir domicilio
          </Title>
          {branch && (
            <Text size="sm" c="dimmed">
              {branch.name}
            </Text>
          )}
        </Stack>

        {terms.length > 0 && (
          <Group gap="xs">
            {terms.map(({ icon: Icon, label }) => (
              <Badge
                key={label}
                variant="light"
                color="gray"
                size="lg"
                radius="xl"
                leftSection={<Icon size={12} />}
              >
                {label}
              </Badge>
            ))}
          </Group>
        )}

        {/* Loading state */}
        {generate.isPending && (
          <Center py={80}>
            <Stack align="center" gap="md">
              <Loader color="dark" size="lg" />
              <Text c="dimmed" size="sm">
                Generando tu código...
              </Text>
            </Stack>
          </Center>
        )}

        {/* Error state */}
        {generate.isError && (
          <Alert
            icon={<AlertCircle size={16} />}
            title="No se pudo generar el código"
            color="red"
            variant="light"
          >
            <Text size="sm" mb="sm">
              {(generate.error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message ?? "Intenta de nuevo."}
            </Text>
            <Button
              size="xs"
              color="red"
              variant="outline"
              onClick={() => generate.mutate(branchId)}
            >
              Reintentar
            </Button>
          </Alert>
        )}

        {/* Success state */}
        {code && (
          <Paper radius="xl" p="xl" withBorder>
            <Stack gap="lg">
              <Stack gap={4} align="center">
                <Text
                  size="xs"
                  fw={700}
                  tt="uppercase"
                  c="dimmed"
                  style={{ letterSpacing: "0.1em" }}
                >
                  Tu código de domicilio
                </Text>
                <Text size="xs" c="dimmed" fs="italic">
                  Comparte este código al hacer tu pedido.
                </Text>
                <Group gap="xs" align="center" mt={4}>
                  <Box
                    style={{
                      padding: "12px 20px",
                      background: "#1B1A1A",
                      borderRadius: 12,
                    }}
                  >
                    <Code
                      style={{
                        fontSize: 28,
                        fontWeight: 900,
                        letterSpacing: "0.15em",
                        background: "transparent",
                        color: "#fff",
                        fontFamily: '"Clash Grotesk", sans-serif',
                      }}
                    >
                      {code}
                    </Code>
                  </Box>
                  <CopyButton value={code} timeout={2000}>
                    {({ copied, copy }) => (
                      <ActionIcon
                        onClick={copy}
                        variant={copied ? "filled" : "outline"}
                        color={copied ? "green" : "gray"}
                        radius="xl"
                        size="lg"
                        title="Copiar código"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </ActionIcon>
                    )}
                  </CopyButton>
                </Group>
              </Stack>

              <Stack gap="xs">
                <Text fw={700} size="sm">
                  Haz tu pedido
                </Text>
                {instructions && (
                  <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                    {instructions}
                  </Text>
                )}

                {showWebpage && (
                  <>
                    <Button
                      component="a"
                      href={webpageUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="dark"
                      radius="xl"
                      leftSection={<Globe size={16} />}
                    >
                      Pedir en la página
                    </Button>
                    <Text size="xs" c="dimmed">
                      Ten a la mano tu código: {code}
                    </Text>
                  </>
                )}
                {showWhatsApp && (
                  <Button
                    component="a"
                    href={waHref(
                      whatsapp!,
                      `${contactMessage}\n\nMi código: ${code}`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="green"
                    radius="xl"
                    leftSection={<MessageCircle size={16} />}
                  >
                    Pedir por WhatsApp
                  </Button>
                )}
                {showPhone && (
                  <>
                    <Button
                      component="a"
                      href={`tel:${phone}`}
                      variant="outline"
                      color="dark"
                      radius="xl"
                      leftSection={<Phone size={16} />}
                    >
                      Llamar para pedir
                    </Button>
                    <Text size="xs" c="dimmed">
                      Al llamar, ten a la mano tu código: {code}
                    </Text>
                  </>
                )}
              </Stack>

              <Button
                variant="subtle"
                color="dark"
                size="sm"
                leftSection={<RefreshCw size={14} />}
                loading={generate.isPending}
                onClick={() => generate.mutate(branchId)}
              >
                Generar otro código
              </Button>
            </Stack>
          </Paper>
        )}
      </Stack>
    </>
  );
}
