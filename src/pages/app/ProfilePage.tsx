import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const updateMutation = useUpdateUser();

  const form = useForm<ProfileForm>({
    initialValues: {
      name: user?.name ?? "",
      lastname: user?.lastname ?? "",
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
        name: user.name ?? "",
        lastname: user.lastname ?? "",
        email: user.email ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function handleSubmit(values: ProfileForm) {
    if (!user) return;
    try {
      await updateMutation.mutateAsync({
        id: user.id,
        data: {
          name: values.name.trim(),
          lastname: values.lastname?.trim(),
          email: values.email?.trim() || undefined,
        },
      });
      toast.success("Datos actualizados.");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "No se pudo actualizar.");
    }
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
                <TextInput
                  label="Correo electrónico"
                  placeholder="tu@correo.com"
                  type="email"
                  description="Necesario para gestionar pagos y membresías."
                  {...form.getInputProps("email")}
                />
                <TextInput
                  label="Teléfono"
                  value={user?.phone ?? ""}
                  readOnly
                  description="El número de teléfono es tu identificador de inicio de sesión y no puede cambiar."
                  styles={{ input: { cursor: "not-allowed", opacity: 0.7 } }}
                />
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
