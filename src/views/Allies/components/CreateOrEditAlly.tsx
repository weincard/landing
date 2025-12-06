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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Save, Loader2 } from "lucide-react";
import Image from "next/image";
import { useMerchants } from "@/modules/merchants/domain/hooks/use-merchants";
import { useBranches } from "@/modules/branches/domain/hooks/use-branches";
import { useUsers } from "@/modules/users/domain/hooks/use-users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { IMerchant, IBranch } from "@/data/interfaces/merchant.interface";
import { IUser } from "@/data/interfaces/user.interface";

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
  const {
    createMerchant,
    getMerchantById,
    updateMerchant,
    loading,
    error: merchantError,
  } = useMerchants();
  const { getAllBranches, loading: loadingBranches } = useBranches();
  const { getAllUsers, loading: loadingUsers } = useUsers();

  const [files, setFiles] = useState<string[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [shouldRemoveLogo, setShouldRemoveLogo] = useState(false);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [ownerUsers, setOwnerUsers] = useState<IUser[]>([]);
  const [loadingMerchant, setLoadingMerchant] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isFounder, setIsFounder] = useState<boolean>(false);

  // Load branches for the merchant
  const loadMerchantBranches = useCallback(
    async (merchantId: number) => {
      try {
        const response = await getAllBranches(merchantId, token, {
          skip: 0,
          limit: 100,
        });
        if (response && response.branches) {
          setBranches(response.branches);
        }
      } catch (error) {
        console.error("Error loading merchant branches:", error);
      }
    },
    [getAllBranches, token]
  );

  // Load existing merchant data when editing
  useEffect(() => {
    const loadMerchantData = async () => {
      if (allyId) {
        setLoadingMerchant(true);
        try {
          const response = await getMerchantById(Number(allyId), token);
          if (response && response.merchant) {
            const merchant = response.merchant;
            console.log("Loading merchant data:", merchant); // Keep for debugging preload issue

            // Extract merchantId from nested merchant object
            const extractedMerchantId = merchant.merchantId?.toString() || "";
            setName(merchant.name || "");
            setDescription(merchant.description || "");
            setCountry(merchant.country || "");
            setState(merchant.state || "");
            setIsFounder(merchant.founder || false);

            // Set owner user if exists
            if (merchant.merchantUsers && merchant.merchantUsers.length > 0) {
              setSelectedUserId(String(merchant.merchantUsers[0].userId));
            }

            // Set logo if exists
            if (merchant.logoUrl) {
              setFiles([merchant.logoUrl]);
            }

            // Load branches for this merchant
            await loadMerchantBranches(Number(allyId));
          }
        } catch (error) {
          console.error("Error loading merchant:", error);
          toast.error("Error al cargar los datos del aliado");
        } finally {
          setLoadingMerchant(false);
        }
      }
    };

    loadMerchantData();
  }, [allyId, token, getMerchantById, loadMerchantBranches]);

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
  }, [token, getAllUsers]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setLogoFile(file);
        setShouldRemoveLogo(false); // Reset the remove flag when selecting new file

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

  const handleRemoveLogo = useCallback(() => {
    setFiles([]);
    setLogoFile(null);
    setShouldRemoveLogo(true);
    // Reset the file input
    const fileInput = document.getElementById(
      "avatar-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }, []);

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

    // For create operations, logo file is required
    if (!allyId && !logoFile) {
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
      };

      // Only add merchantUsers for create operation
      if (!allyId) {
        merchantData.merchantUsers = [
          {
            userId: Number(selectedUserId),
            merchantId: 0, // Se asignará en el backend
          },
        ];
      }

      let response;
      if (allyId) {
        // Update existing merchant
        const logoToSend = shouldRemoveLogo ? null : logoFile || undefined;
        response = await updateMerchant(
          Number(allyId),
          merchantData,
          logoToSend,
          token
        );
      } else {
        // Create new merchant
        response = await createMerchant(merchantData, logoFile!, token);
      }

      if (response) {
        toast.success(
          allyId
            ? "Aliado actualizado exitosamente"
            : "Aliado creado exitosamente"
        );
        router.push("/dashboard/allies");
      } else {
        // Si no hay respuesta, mostrar el error del hook
        const errorMessage =
          merchantError ||
          `Error al ${allyId ? "actualizar" : "crear"} el aliado`;
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error(
        `Error ${allyId ? "updating" : "creating"} merchant:`,
        error
      );
      const errorMessage =
        error?.message ||
        merchantError ||
        `Error al ${allyId ? "actualizar" : "crear"} el aliado`;
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {allyId ? "Editar Aliado" : "Crear Aliado"}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading || loadingMerchant}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || loadingMerchant}>
            {loading || loadingMerchant ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {allyId ? "Actualizar" : "Guardar"}
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
                {files[0] && (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg"
                    onClick={handleRemoveLogo}
                    disabled={loading || loadingMerchant}
                  >
                    <X className="h-4 w-4" />
                  </Button>
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
                  disabled={loading || loadingMerchant}
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
                  Nombre <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  placeholder="Nombre del aliado"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading || loadingMerchant}
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
                  disabled={loading || loadingMerchant}
                  className="resize-none"
                />
              </div>

              {/* Owner */}
              <div className="space-y-2 col-span-2">
                <label
                  htmlFor="owner"
                  className="text-sm text-muted-foreground"
                >
                  Propietario <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                  disabled={loading || loadingUsers || loadingMerchant}
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
                  País <span className="text-red-500">*</span>
                </label>
                <Input
                  id="country"
                  placeholder="Colombia"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={loading || loadingMerchant}
                />
              </div>

              {/* Estado / Departamento */}
              <div className="space-y-2">
                <label
                  htmlFor="state"
                  className="text-sm text-muted-foreground"
                >
                  Estado / Departamento <span className="text-red-500">*</span>
                </label>
                <Input
                  id="state"
                  placeholder="Antioquia"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={loading || loadingMerchant}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branches Card - Only show in edit mode */}
      {allyId && (
        <Card>
          <CardHeader>
            <CardTitle>Sucursales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Ciudad</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingBranches ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-gray-500"
                      >
                        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                        Cargando sucursales...
                      </TableCell>
                    </TableRow>
                  ) : branches.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-gray-500"
                      >
                        No hay sucursales registradas para este aliado
                      </TableCell>
                    </TableRow>
                  ) : (
                    branches.map((branch) => (
                      <TableRow key={branch.branchId}>
                        <TableCell className="font-medium">
                          {branch.name}
                        </TableCell>
                        <TableCell>{branch.address}</TableCell>
                        <TableCell>{branch.city}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              branch.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {branch.isActive ? "Activa" : "Inactiva"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
