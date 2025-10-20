"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Trash2, Save, Search, Loader2 } from "lucide-react";
import Image from "next/image";
import { useMerchants } from "@/modules/merchants/domain/hooks/use-merchants";
import { useUsers } from "@/modules/users/domain/hooks/use-users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { IMerchant } from "@/data/interfaces/merchant.interface";
import { IUser } from "@/data/interfaces/user.interface";

interface Office {
  id: string;
  name: string;
  address: string;
  city: string;
  redemptions: number;
  total: number;
}

interface CreateOrEditAllyProps {
  token: string;
  allyId?: string;
  user?: IUser;
}

export function CreateOrEditAlly({
  token,
  allyId,
  user,
}: CreateOrEditAllyProps) {
  const router = useRouter();
  const { createMerchant, loading, error: merchantError } = useMerchants();
  const { getAllUsers, loading: loadingUsers } = useUsers();

  const [files, setFiles] = useState<string[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [offices, setOffices] = useState<Office[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [ownerUsers, setOwnerUsers] = useState<IUser[]>([]);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isFounder, setIsFounder] = useState<boolean>(false);

  // Cargar usuarios con rol "owner" al montar el componente
  useEffect(() => {
    const fetchOwnerUsers = async () => {
      const response = await getAllUsers(
        token,
        { skip: 0, limit: 100 },
        "owner"
      );
      if (response && response.users) {
        setOwnerUsers(response.users);
      }
    };

    fetchOwnerUsers();
  }, [token, getAllUsers]); // Mock de sucursales disponibles (en producción vendría de la API)
  const availableBranches: Office[] = [
    {
      id: "1",
      name: "El cielo sede Medellín",
      address: "Cra. 35 #66-35",
      city: "Medellín Antioquia",
      redemptions: 24,
      total: 35,
    },
    {
      id: "2",
      name: "Kielo sushi Poblado",
      address: "Cra. 43 #1 Sur-25",
      city: "Medellín Antioquia",
      redemptions: 145,
      total: 200,
    },
    {
      id: "3",
      name: "Barbaro Laureles",
      address: "Cra. 70 #44-35",
      city: "Bogotá Colombia",
      redemptions: 34,
      total: 50,
    },
    {
      id: "4",
      name: "Restaurante sede n",
      address: "Calle 10 #5-60",
      city: "Cali Valle",
      redemptions: 23,
      total: 40,
    },
  ];

  const filteredBranches = availableBranches.filter(
    (branch) =>
      !offices.some((office) => office.id === branch.id) &&
      (branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddBranch = (branch: Office) => {
    setOffices([...offices, branch]);
    setSearchTerm("");
  };

  const handleRemoveBranch = (branchId: string) => {
    setOffices(offices.filter((office) => office.id !== branchId));
  };

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setLogoFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setFiles([base64]); // Solo mantenemos una imagen para preview
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleCancel = () => {
    router.push("/dashboard/allies");
  };

  const handleSave = async () => {
    // Validación básica
    if (!name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    if (!country.trim()) {
      toast.error("El país es requerido");
      return;
    }
    if (!state.trim()) {
      toast.error("El estado es requerido");
      return;
    }
    if (!selectedUserId) {
      toast.error("Debe seleccionar un propietario");
      return;
    }
    if (!logoFile) {
      toast.error("Debes subir un logo para el aliado");
      return;
    }

    try {
      const merchantData: Partial<IMerchant> = {
        name: name.trim(),
        description: description.trim() || undefined,
        country: country.trim(),
        state: state.trim(),
        founder: isFounder,
        merchantUsers: [
          {
            userId: Number(selectedUserId),
            merchantId: 0, // Se asignará en el backend
          },
        ],
      };

      const response = await createMerchant(merchantData, logoFile, token);

      if (response) {
        toast.success("Aliado creado exitosamente");
        router.push("/dashboard/allies");
      } else {
        // Si no hay respuesta, mostrar el error del hook
        const errorMessage = merchantError || "Error al crear el aliado";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error creating merchant:", error);
      const errorMessage =
        error?.message || merchantError || "Error al crear el aliado";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Aliado</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Guardar
          </Button>
        </div>
      </div>

      {/* Ally Information Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Logo Section */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                {files[0] ? (
                  <Image
                    src={files[0]}
                    alt="Ally avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-5xl font-semibold text-muted-foreground select-none">
                    {(name && name.charAt(0).toUpperCase()) || "A"}
                  </span>
                )}
              </div>
              <label htmlFor="avatar-upload">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() =>
                    document.getElementById("avatar-upload")?.click()
                  }
                  disabled={loading}
                >
                  Actualizar
                </Button>
              </label>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Form Fields */}
            <div className="flex-1 grid grid-cols-4 gap-x-6 gap-y-4">
              {/* Nombre */}
              <div className="space-y-2 col-span-2">
                <label htmlFor="name" className="text-sm text-muted-foreground">
                  Nombre
                </label>
                <Input
                  id="name"
                  placeholder="Nombre del aliado"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2 col-span-2">
                <label
                  htmlFor="description"
                  className="text-sm text-muted-foreground"
                >
                  Descripción
                </label>
                <Textarea
                  id="description"
                  placeholder="Descripción del aliado"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  className="resize-none"
                />
              </div>

              {/* Owner */}
              <div className="space-y-2 col-span-2">
                <label
                  htmlFor="owner"
                  className="text-sm text-muted-foreground"
                >
                  Owner
                </label>
                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                  disabled={loading || loadingUsers}
                >
                  <SelectTrigger id="owner">
                    <SelectValue
                      placeholder={
                        loadingUsers ? "Cargando..." : "Seleccionar propietario"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {ownerUsers.map((user) => (
                      <SelectItem
                        key={user.idUsuario}
                        value={String(user.idUsuario)}
                      >
                        {user.name || user.email || `Usuario ${user.idUsuario}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* País */}
              <div className="space-y-2">
                <label
                  htmlFor="country"
                  className="text-sm text-muted-foreground"
                >
                  País
                </label>
                <Input
                  id="country"
                  placeholder="Colombia"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Estado / Departamento */}
              <div className="space-y-2">
                <label
                  htmlFor="state"
                  className="text-sm text-muted-foreground"
                >
                  Estado / Departamento
                </label>
                <Input
                  id="state"
                  placeholder="Antioquia"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offices Card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Sucursales</h2>
            <Button onClick={() => setIsDrawerOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Sucursal
            </Button>
          </div>

          {/* Offices Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Redenciones</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offices.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No hay sucursales agregadas
                    </TableCell>
                  </TableRow>
                ) : (
                  offices.map((office) => (
                    <TableRow key={office.id}>
                      <TableCell className="font-medium">
                        {office.name}
                      </TableCell>
                      <TableCell>{office.address}</TableCell>
                      <TableCell>{office.city}</TableCell>
                      <TableCell>{office.redemptions}</TableCell>
                      <TableCell>{office.total}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBranch(office.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Drawer para buscar y agregar sucursales */}
      <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buscar Sucursales</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, dirección o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Results List */}
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {filteredBranches.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm
                    ? "No se encontraron sucursales"
                    : "Todas las sucursales ya fueron agregadas"}
                </div>
              ) : (
                filteredBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{branch.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {branch.address} - {branch.city}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Redenciones: {branch.redemptions} / Total:{" "}
                        {branch.total}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        handleAddBranch(branch);
                      }}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
