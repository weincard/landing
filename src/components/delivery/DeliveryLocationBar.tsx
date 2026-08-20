import { useState } from "react";
import { Button, Text } from "@mantine/core";
import { ChevronDown, MapPin } from "lucide-react";
import { useDeliveryPin } from "@/lib/deliveryLocation";
import { DeliveryLocationModal } from "./DeliveryLocationModal";

// "Entregar en: Casa ▾" — entry point of the delivery-location picker, shown
// at the top of the Domicilios listing. Without a chosen pin the listing is
// unfiltered and the bar invites the user to pick one.
export function DeliveryLocationBar() {
  const pin = useDeliveryPin();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="light"
        color="dark"
        radius="xl"
        size="sm"
        leftSection={<MapPin size={14} />}
        rightSection={<ChevronDown size={14} />}
        onClick={() => setOpen(true)}
        styles={{ label: { maxWidth: 260 } }}
      >
        {pin ? (
          <Text size="sm" fw={600} truncate>
            Entregar en: {pin.label || pin.address}
          </Text>
        ) : (
          <Text size="sm" fw={600}>
            ¿Dónde te lo llevamos?
          </Text>
        )}
      </Button>
      <DeliveryLocationModal opened={open} onClose={() => setOpen(false)} />
    </>
  );
}
