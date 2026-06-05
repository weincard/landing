import { useState, useEffect, useRef } from "react";
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
import { ArrowLeft, Copy, Check, Clock, AlertCircle } from "lucide-react";
import { useGenerateCode } from "@/hooks/useRedemptions";
import { PageMeta } from "@/components/layout/PageMeta";
import type { GeneratedCode } from "@/types";

const COUNTDOWN_SECONDS = 300;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function RedeemPage() {
  const { branchId: branchIdParam } = useParams<{ branchId: string }>();
  const branchId = Number(branchIdParam ?? "0");
  const navigate = useNavigate();
  const generateCode = useGenerateCode();

  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate code on mount (once)
  useEffect(() => {
    if (branchId <= 0) return;
    generateCode.mutate(branchId, {
      onSuccess: (code) => {
        setGeneratedCode(code);
        // Start countdown after code is received
        intervalRef.current = setInterval(() => {
          setSecondsLeft((s) => {
            if (s <= 1) {
              clearInterval(intervalRef.current!);
              setExpired(true);
              return 0;
            }
            return s - 1;
          });
        }, 1000);
      },
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  const progressPercent = (secondsLeft / COUNTDOWN_SECONDS) * 100;
  const isUrgent = secondsLeft <= 60 && !expired;

  return (
    <>
      <PageMeta title="Generar código" description="Código único de canje Weincard." path="/app/redeem" />
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

        <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
          Código de canje
        </Title>

        {/* Loading state */}
        {generateCode.isPending && (
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
        {generateCode.isError && (
          <Alert
            icon={<AlertCircle size={16} />}
            title="No se pudo generar el código"
            color="red"
            variant="light"
          >
            <Text size="sm" mb="sm">
              {(generateCode.error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message ?? "Intenta de nuevo."}
            </Text>
            <Button
              size="xs"
              color="red"
              variant="outline"
              onClick={() =>
                generateCode.mutate(branchId, {
                  onSuccess: (code) => setGeneratedCode(code),
                })
              }
            >
              Reintentar
            </Button>
          </Alert>
        )}

        {/* Success state */}
        {generatedCode && (
          <Paper radius="xl" p="xl" withBorder style={{ textAlign: "center" }}>
            <Stack align="center" gap="lg">
              {/* Status badge */}
              {expired ? (
                <Badge color="red" size="lg" radius="xl" variant="filled">
                  CÓDIGO EXPIRADO
                </Badge>
              ) : (
                <Badge color="green" size="lg" radius="xl" variant="filled">
                  CÓDIGO ACTIVO
                </Badge>
              )}

              <Stack gap={4} align="center">
                <Text
                  size="xs"
                  fw={700}
                  tt="uppercase"
                  c="dimmed"
                  style={{ letterSpacing: "0.1em" }}
                >
                  Código único de uso
                </Text>

                {/* The code */}
                <Box
                  style={{
                    padding: "16px 24px",
                    background: expired ? "#f3f4f6" : "#1B1A1A",
                    borderRadius: 12,
                    position: "relative",
                  }}
                >
                  <Code
                    style={{
                      fontSize: 36,
                      fontWeight: 900,
                      letterSpacing: "0.15em",
                      background: "transparent",
                      color: expired ? "#9ca3af" : "#fff",
                      fontFamily: '"Clash Grotesk", sans-serif',
                    }}
                  >
                    {generatedCode.code}
                  </Code>
                </Box>

                {/* Copy button */}
                {!expired && (
                  <CopyButton value={generatedCode.code} timeout={2000}>
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
                )}
              </Stack>

              {/* Countdown */}
              {!expired ? (
                <Group gap="xs" align="center">
                  <Clock size={14} color={isUrgent ? "#dc2626" : "#9ca3af"} />
                  <Text
                    fw={700}
                    size="sm"
                    c={isUrgent ? "red" : "dimmed"}
                    style={{ fontFamily: '"Clash Grotesk", sans-serif' }}
                  >
                    Expira en {formatTime(secondsLeft)}
                  </Text>
                </Group>
              ) : (
                <Text size="sm" c="dimmed">
                  Este código expiró. Genera uno nuevo desde el restaurante.
                </Text>
              )}

              {/* Progress bar */}
              {!expired && (
                <Box
                  style={{
                    width: "100%",
                    height: 4,
                    borderRadius: 2,
                    background: "#e5e7eb",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    style={{
                      height: "100%",
                      width: `${progressPercent}%`,
                      background: isUrgent ? "#dc2626" : "#1B1A1A",
                      transition: "width 1s linear, background 0.3s",
                    }}
                  />
                </Box>
              )}

              <Divider />

              <Text size="xs" c="dimmed" style={{ lineHeight: 1.6, maxWidth: 340 }}>
                Muestra este código al personal del restaurante <strong>antes de pagar</strong>.
                Es de un solo uso.
              </Text>

              <Button
                variant="subtle"
                color="dark"
                size="sm"
                leftSection={<ArrowLeft size={14} />}
                onClick={() => navigate(-1)}
              >
                Volver al restaurante
              </Button>
            </Stack>
          </Paper>
        )}
      </Stack>
    </>
  );
}

function Divider() {
  return <Box style={{ width: "100%", height: 1, background: "#e5e7eb" }} />;
}
