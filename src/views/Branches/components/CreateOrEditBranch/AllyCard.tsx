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
  isRequired?: boolean;
}

export function AllyCard({
  merchantId,
  merchants,
  merchantsLoading,
  onMerchantChange,
  isRequired = true,
}: AllyCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">
          Aliado {isRequired ? "*" : ""}
        </h2>
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
            {merchants.map((merchant) => {
              const merchantValue = merchant.merchantId?.toString() || "";
              return (
                <SelectItem key={merchant.merchantId} value={merchantValue}>
                  {merchant.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
