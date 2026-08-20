import { useEffect, useState } from "react";
import {
  ActionIcon,
  Alert,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Check, Home, MapPin, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useUserLocation } from "@/hooks/useUserLocation";
import {
  createAddress,
  deleteAddress,
  getMyAddresses,
  type UserAddress,
} from "@/api/addresses";
import {
  setDeliveryPin,
  useDeliveryPin,
  type DeliveryPin,
} from "@/lib/deliveryLocation";

// "¿Dónde te lo llevamos?" — draggable map pin + address text; logged-in
// users can save/reuse addresses (Casa, Oficina…). Confirming sets the global
// delivery pin (lib/deliveryLocation), which filters the Domicilios listing.

// Same env-var name as admin-web so the key can be shared/rotated together.
const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

interface Props {
  opened: boolean;
  onClose: () => void;
}

export function DeliveryLocationModal({ opened, onClose }: Props) {
  const { isLoggedIn } = useAuth();
  const qc = useQueryClient();
  const gps = useUserLocation();
  const currentPin = useDeliveryPin();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: MAPS_KEY,
    id: "wc-maps",
  });

  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [label, setLabel] = useState("");
  const [saveIt, setSaveIt] = useState(false);

  // Seed from the current pin (editing) or the GPS point (first time).
  useEffect(() => {
    if (!opened) return;
    if (currentPin) {
      setPos({ lat: currentPin.lat, lng: currentPin.lng });
      setAddress(currentPin.address);
      setLabel(currentPin.label ?? "");
    } else {
      setPos({ lat: gps.lat, lng: gps.lng });
      setAddress("");
      setLabel("");
    }
    setSaveIt(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const { data: savedAddresses } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: () => getMyAddresses().then((r) => r.data.addresses),
    enabled: opened && isLoggedIn,
  });

  const saveAddress = useMutation({
    mutationFn: createAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-addresses"] }),
  });
  const removeAddress = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-addresses"] }),
  });

  const pickSaved = (a: UserAddress) => {
    const pin: DeliveryPin = {
      lat: Number(a.latitude),
      lng: Number(a.longitude),
      address: a.address,
      label: a.label,
    };
    setDeliveryPin(pin);
    onClose();
  };

  const confirm = async () => {
    if (!pos || !address.trim()) return;
    const pin: DeliveryPin = {
      lat: pos.lat,
      lng: pos.lng,
      address: address.trim(),
      label: label.trim() || null,
    };
    setDeliveryPin(pin);
    if (isLoggedIn && saveIt) {
      // Best-effort: saving must never block choosing the location.
      saveAddress.mutate({
        address: pin.address,
        latitude: pin.lat,
        longitude: pin.lng,
        label: pin.label,
      });
    }
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="¿Dónde te lo llevamos?"
      size="lg"
      radius="lg"
      centered
    >
      <Stack gap="sm">
        {isLoggedIn && (savedAddresses?.length ?? 0) > 0 && (
          <Stack gap={6}>
            <Text size="sm" fw={600}>
              Tus direcciones
            </Text>
            {savedAddresses!.map((a) => (
              <Paper key={a.userAddressId} withBorder radius="md" p="xs">
                <Group justify="space-between" wrap="nowrap">
                  <Group
                    gap="xs"
                    wrap="nowrap"
                    style={{ cursor: "pointer", flex: 1 }}
                    onClick={() => pickSaved(a)}
                  >
                    <Home size={16} />
                    <div>
                      <Text size="sm" fw={600}>
                        {a.label || "Dirección guardada"}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {a.address}
                      </Text>
                    </div>
                  </Group>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => removeAddress.mutate(a.userAddressId)}
                    title="Eliminar dirección"
                  >
                    <Trash2 size={14} />
                  </ActionIcon>
                </Group>
              </Paper>
            ))}
            <Text size="xs" c="dimmed">
              o elige otra ubicación en el mapa:
            </Text>
          </Stack>
        )}

        {MAPS_KEY ? (
          isLoaded && pos ? (
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: 260,
                borderRadius: 12,
                overflow: "hidden",
              }}
              center={pos}
              zoom={15}
              onClick={(e) => {
                if (!e.latLng) return;
                setPos({ lat: e.latLng.lat(), lng: e.latLng.lng() });
              }}
              options={{
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
              }}
            >
              <Marker
                position={pos}
                draggable
                onDragEnd={(e) => {
                  if (!e.latLng) return;
                  setPos({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                }}
              />
            </GoogleMap>
          ) : (
            <Center h={260}>
              <Loader color="dark" />
            </Center>
          )
        ) : (
          <Alert color="yellow" variant="light">
            Mapa no disponible — escribe tu dirección; usaremos tu ubicación
            actual como punto de entrega.
          </Alert>
        )}

        <TextInput
          label="Dirección"
          placeholder="Cra 35 # 8A-15, apto 502"
          required
          leftSection={<MapPin size={14} />}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Group grow align="flex-end">
          <TextInput
            label="Etiqueta (opcional)"
            placeholder="Casa, Oficina…"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          {isLoggedIn && (
            <Button
              variant={saveIt ? "filled" : "outline"}
              color="dark"
              radius="xl"
              leftSection={saveIt ? <Check size={14} /> : <Home size={14} />}
              onClick={() => setSaveIt((v) => !v)}
            >
              {saveIt ? "Se guardará" : "Guardar dirección"}
            </Button>
          )}
        </Group>

        <Button
          color="dark"
          radius="xl"
          size="md"
          disabled={!pos || !address.trim()}
          onClick={confirm}
        >
          Entregar aquí
        </Button>
        {currentPin && (
          <Button
            variant="subtle"
            color="gray"
            size="xs"
            onClick={() => {
              setDeliveryPin(null);
              onClose();
            }}
          >
            Quitar ubicación (ver todos los domicilios)
          </Button>
        )}
      </Stack>
    </Modal>
  );
}
