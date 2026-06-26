import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Stack,
  Title,
  Tabs,
  TextInput,
  Button,
  Group,
  Text,
  Paper,
  Divider,
  Anchor,
  Badge,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useUpdateUser } from "@/hooks/useUsers";
import { PageMeta } from "@/components/layout/PageMeta";

type ProfileForm = {
  name: string;
  lastname?: string;
  email?: string;
};

function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <Badge color="green" variant="light" size="sm">
      Verificado
    </Badge>
  ) : (
    <Badge color="orange" variant="light" size="sm">
      Sin verificar
    </Badge>
  );
}

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const updateMutation = useUpdateUser();

  const emailVerified = !!user?.isEmailVerified;
  const phoneVerified = !!user?.isPhoneVerified;

  const form = useForm<ProfileForm>({
    initialValues: {
      name: user?.firstName ?? "",
      lastname: user?.lastName ?? "",
      email: user?.email ?? "",
    },
    validate: {
      name: (v) => (!v?.trim() ? "Nombre requerido" : null),
      email: (v) => {
        if (!v || v === "") return null;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Correo inválido";
      },
    },
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        name: user.firstName ?? "",
        lastname: user.lastName ?? "",
        email: user.email ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  function openVerify(kind: "email" | "phone") {
    setParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("verify", kind);
      return p;
    });
  }

  async function handleSubmit(values: ProfileForm) {
    if (!user) return;
    try {
      await updateMutation.mutateAsync({
        id: user.id,
        data: {
          name: values.name.trim(),
          lastname: values.lastname?.trim(),
          // Email is editable only while unverified; once verified it's a locked
          // account identifier. Only send it when it actually changed.
          ...(!emailVerified && values.email?.trim() && values.email.trim() !== (user.email ?? "")
            ? { email: values.email.trim() }
            : {}),
        },
      });
      toast.success("Datos actualizados.");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "No se pudo actualizar.");
    }
  }

  // Verify email: persist any edit first (so the modal verifies the saved
  // address), then open the unified verification modal.
  async function handleVerifyEmail() {
    if (!user) return;
    const email = form.values.email?.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Ingresa un correo válido antes de verificar.");
      return;
    }
    if (email !== (user.email ?? "")) {
      try {
        await updateMutation.mutateAsync({ id: user.id, data: { email } });
        await refreshUser();
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        toast.error(msg ?? "No se pudo guardar el correo.");
        return;
      }
    }
    openVerify("email");
  }

  function handleDeleteAccount() {
    modals.openConfirmModal({
      title: "¿Eliminar cuenta?",
      children: (
        <Text size="sm">
          Esta acción es irreversible. Perderás acceso a tu membresía y todos tus datos serán
          eliminados.
        </Text>
      ),
      labels: { confirm: "Eliminar cuenta", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      onConfirm: () => navigate("/delete-account"),
    });
  }

  return (
    <>
      <PageMeta title="Perfil" description="Tu perfil Weincard." path="/app/profile" />
      <Stack gap="xl" maw={560} mx="auto" py="lg">
        <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
          Perfil
        </Title>

        <Tabs defaultValue="datos" radius="xl">
          <Tabs.List mb="lg">
            <Tabs.Tab value="datos">Mis datos</Tabs.Tab>
            <Tabs.Tab value="configuracion">Configuración</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="datos">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Nombre"
                  placeholder="Tu nombre"
                  {...form.getInputProps("name")}
                />
                <TextInput
                  label="Apellido"
                  placeholder="Tu apellido"
                  {...form.getInputProps("lastname")}
                />

                {/* Email — editable until verified, then locked */}
                <div>
                  <Group justify="space-between" align="center" mb={4}>
                    <Text size="sm" fw={500}>
                      Correo electrónico
                    </Text>
                    <VerifiedBadge verified={emailVerified} />
                  </Group>
                  {emailVerified ? (
                    <TextInput
                      type="email"
                      value={user?.email ?? ""}
                      readOnly
                      description="Tu correo está verificado y no puede cambiarse."
                      styles={{ input: { cursor: "not-allowed", opacity: 0.7 } }}
                    />
                  ) : (
                    <Stack gap="xs">
                      <TextInput
                        type="email"
                        placeholder="tu@correo.com"
                        {...form.getInputProps("email")}
                      />
                      <Group justify="space-between" align="center">
                        <Text size="xs" c="dimmed">
                          Verifica tu correo para poder activar tu membresía.
                        </Text>
                        <Button
                          variant="light"
                          color="dark"
                          size="xs"
                          onClick={handleVerifyEmail}
                          loading={updateMutation.isPending}
                        >
                          Verificar correo
                        </Button>
                      </Group>
                    </Stack>
                  )}
                </div>

                {/* Phone — set + verified together via OTP; locked once verified */}
                <div>
                  <Group justify="space-between" align="center" mb={4}>
                    <Text size="sm" fw={500}>
                      Teléfono
                    </Text>
                    <VerifiedBadge verified={phoneVerified} />
                  </Group>
                  {phoneVerified ? (
                    <TextInput
                      value={user?.phone ?? ""}
                      readOnly
                      description="Tu teléfono está verificado y no puede cambiarse."
                      styles={{ input: { cursor: "not-allowed", opacity: 0.7 } }}
                    />
                  ) : (
                    <Stack gap="xs">
                      <TextInput
                        value={user?.phone ?? ""}
                        readOnly
                        placeholder="Sin teléfono"
                        styles={{ input: { cursor: "not-allowed", opacity: 0.7 } }}
                      />
                      <Group justify="space-between" align="center">
                        <Text size="xs" c="dimmed">
                          {user?.phone
                            ? "Verifica tu número para confirmarlo."
                            : "Agrega y verifica un número de teléfono."}
                        </Text>
                        <Button
                          variant="light"
                          color="dark"
                          size="xs"
                          onClick={() => openVerify("phone")}
                        >
                          {user?.phone ? "Verificar teléfono" : "Agregar teléfono"}
                        </Button>
                      </Group>
                    </Stack>
                  )}
                </div>

                <Group justify="flex-end" mt="sm">
                  <Button type="submit" color="dark" loading={updateMutation.isPending}>
                    Guardar cambios
                  </Button>
                </Group>
              </Stack>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="configuracion">
            <Stack gap="lg">
              <Paper radius="xl" p="lg" withBorder style={{ borderColor: "#fecaca", background: "#fef2f2" }}>
                <Stack gap="sm">
                  <Text fw={700} size="sm" c="red">
                    Zona de peligro
                  </Text>
                  <Text size="xs" c="dimmed">
                    Al eliminar tu cuenta perderás tu historial de canjes y acceso a la membresía.
                  </Text>
                  <Button
                    variant="outline"
                    color="red"
                    size="xs"
                    onClick={handleDeleteAccount}
                    style={{ alignSelf: "flex-start" }}
                  >
                    Eliminar cuenta
                  </Button>
                </Stack>
              </Paper>

              <Divider />

              <Stack gap="xs">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase" style={{ letterSpacing: "0.07em" }}>
                  Legal
                </Text>
                <Group gap="lg">
                  <Anchor
                    component={Link}
                    to="/politica-de-privacidad"
                    size="xs"
                    c="dimmed"
                  >
                    Política de privacidad
                  </Anchor>
                  <Anchor
                    component={Link}
                    to="/terminos-y-condiciones"
                    size="xs"
                    c="dimmed"
                  >
                    Términos y condiciones
                  </Anchor>
                </Group>
              </Stack>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </>
  );
}
