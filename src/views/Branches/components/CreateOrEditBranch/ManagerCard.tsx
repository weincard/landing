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
  isRequired?: boolean;
}

export function ManagerCard({
  userId,
  managers,
  loadingManagers,
  onManagerChange,
  isRequired = true,
}: ManagerCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">
          Manager {isRequired ? "*" : ""}
        </h2>
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
            {managers.map((manager) => {
              const managerValue =
                manager.id?.toString() || manager.idUsuario?.toString() || "";
              return (
                <SelectItem
                  key={manager.id || manager.idUsuario}
                  value={managerValue}
                >
                  {manager.email ||
                    manager.phone ||
                    `${manager.name} ${manager.lastName}`}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
