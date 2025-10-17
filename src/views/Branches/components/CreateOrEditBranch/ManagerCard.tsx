import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IUser } from "@/data/interfaces/user.interface";

interface ManagerCardProps {
  userId: string;
  managers: IUser[];
  loadingManagers: boolean;
  onManagerChange: (value: string) => void;
}

export function ManagerCard({
  userId,
  managers,
  loadingManagers,
  onManagerChange,
}: ManagerCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Manager *</h2>
      </CardHeader>
      <CardContent>
        <Select
          value={userId}
          onValueChange={onManagerChange}
          disabled={loadingManagers}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un manager" />
          </SelectTrigger>
          <SelectContent>
            {managers.map((manager) => (
              <SelectItem
                key={manager.id || manager.idUsuario}
                value={
                  manager.id?.toString() || manager.idUsuario?.toString() || ""
                }
              >
                {manager.email ||
                  manager.phone ||
                  `${manager.name} ${manager.lastName}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
