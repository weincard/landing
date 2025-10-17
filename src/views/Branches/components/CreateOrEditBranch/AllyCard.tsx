import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AllyCardProps {
  merchantId: string;
  merchants: any[];
  merchantsLoading: boolean;
  onMerchantChange: (value: string) => void;
}

export function AllyCard({
  merchantId,
  merchants,
  merchantsLoading,
  onMerchantChange,
}: AllyCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Aliado *</h2>
      </CardHeader>
      <CardContent>
        <Select
          value={merchantId}
          onValueChange={onMerchantChange}
          disabled={merchantsLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un aliado" />
          </SelectTrigger>
          <SelectContent>
            {merchants.map((merchant) => (
              <SelectItem
                key={merchant.merchantId}
                value={merchant.merchantId?.toString() || ""}
              >
                {merchant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
