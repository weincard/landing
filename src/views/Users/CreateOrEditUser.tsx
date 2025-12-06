"use client";

import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Save, Camera, User as UserIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUsers } from "@/modules/users/domain/hooks/use-users";
import type {
  UserRole,
  ICreateUserRequest,
  IUpdateUserRequest,
} from "@/data/interfaces/user.interface";
import { toast } from "sonner";

interface CreateOrEditUserProps {
  token?: string;
  userId?: string;
}

export function CreateOrEditUser({ token, userId }: CreateOrEditUserProps) {
  const router = useRouter();
  const { createUser, getUserById, updateUser, loading, error } = useUsers();
  const [avatar, setAvatar] = useState<string>("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("client");
  const [loadingUser, setLoadingUser] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    documentType: "CC" as "CC" | "NIT",
    country: "",
    department: "",
    city: "",
    address: "",
  });

  // Load existing user data when editing
  useEffect(() => {
    const loadUserData = async () => {
      if (userId && token) {
        setLoadingUser(true);
        try {
          const response = await getUserById(Number(userId), token);
          if (response && response.user) {
            const user = response.user;

            const newFormData = {
              name: user.name || "",
              email: user.email || "",
              phone: user.phone || "",
              document: user.document || "",
              documentType: user.documentType || "CC",
              country: user.country || "",
              department: user.department || "",
              city: user.city || "",
              address: user.address || "",
            };
            setFormData(newFormData);

            // Establecer el rol del usuario
            if (user.role) {
              setSelectedRole(user.role as UserRole);
            }

            // Establecer el avatar del usuario
            if (user.profileUrl) {
              setAvatar(user.profileUrl);
            }
          }
        } catch (error) {
          console.error("Error loading user:", error);
          toast.error("Error al cargar los datos del usuario");
        } finally {
          setLoadingUser(false);
        }
      }
    };

    loadUserData();
  }, [userId, token, getUserById]);

  const handleAvatarChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setProfileFile(file);
        setShouldRemoveAvatar(false); // Reset the remove flag when selecting new file

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setAvatar(base64);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleRemoveAvatar = useCallback(() => {
    setAvatar("");
    setProfileFile(null);
    setShouldRemoveAvatar(true);
    // Reset the file input
    const fileInput = document.getElementById(
      "avatar-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // Validación de campos obligatorios
    if (!formData.name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    if (!formData.email && !formData.phone) {
      toast.error("Email o teléfono son requeridos (al menos uno)");
      return;
    }

    if (!selectedRole) {
      toast.error("Rol es requerido");
      return;
    }

    try {
      let response;
      if (userId) {
        // Update existing user
        const updateParams: IUpdateUserRequest = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          roleName: selectedRole,
          document: formData.document,
          documentType: formData.documentType,
          country: formData.country,
          department: formData.department,
          city: formData.city,
          isVerified: true,
          file: shouldRemoveAvatar ? null : profileFile || undefined,
          address: formData.address,
        };

        // Add userId for the update
        const userParamsWithId = {
          ...updateParams,
          userId: Number(userId),
          idUsuario: Number(userId),
        };

        console.log("Updating user with data:", userParamsWithId);
        response = await updateUser(userParamsWithId, token);
      } else {
        // Create new user
        const createParams: ICreateUserRequest = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          roleName: selectedRole,
          document: formData.document,
          documentType: formData.documentType,
          country: formData.country,
          department: formData.department,
          city: formData.city,
          isVerified: true,
          file: profileFile || undefined,
          address: formData.address,
        };

        console.log("Creating user with name:", formData.name);
        console.log("Create params:", createParams);
        response = await createUser(createParams, token);
      }

      if (response) {
        toast.success(
          `Usuario ${userId ? "actualizado" : "creado"} exitosamente: ${
            response.message
          }`
        );
        router.push("/dashboard/users");
      } else if (error) {
        console.error(`Error ${userId ? "updating" : "creating"} user:`, error);
        toast.error(
          `Error al ${userId ? "actualizar" : "crear"} usuario: ${error}`
        );
      }
    } catch (err: any) {
      console.error(`Error ${userId ? "updating" : "creating"} user:`, err);
      toast.error(
        `Error al ${userId ? "actualizar" : "crear"} usuario: ${
          err.message || "Error desconocido"
        }`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {userId ? "Editar Usuario" : "Agregar Usuario"}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={loading || loadingUser}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || loadingUser}>
            {loading || loadingUser ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {loading || loadingUser
              ? "Guardando..."
              : userId
              ? "Actualizar"
              : "Guardar"}
          </Button>
        </div>
      </div>

      {/* Avatar y Rol Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-6 items-center">
            <div className="relative group">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-border">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt="Usuario avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <UserIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity"
                >
                  <Camera className="h-8 w-8 text-white" />
                </label>
                {avatar && (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg"
                    onClick={handleRemoveAvatar}
                    disabled={loading || loadingUser}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Rol del Usuario *
                </label>
                <Select
                  value={selectedRole}
                  onValueChange={(value: UserRole) => setSelectedRole(value)}
                  disabled={loading || loadingUser}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Cliente</SelectItem>
                    <SelectItem value="owner">Propietario</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="staff">Personal</SelectItem>
                    <SelectItem value="superadmin">
                      Super Administrador
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información del Usuario Card */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">Información del usuario</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Información más importante sobre el usuario
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Nombres */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-muted-foreground"
              >
                Nombres <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                placeholder="Ingrese nombres"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={loading || loadingUser}
              />
            </div>

            {/* Tipo de Documento */}
            <div className="space-y-2">
              <label
                htmlFor="documentType"
                className="text-sm font-medium text-muted-foreground"
              >
                Tipo
              </label>
              <Select
                value={formData.documentType}
                onValueChange={(value: "CC" | "NIT") =>
                  handleInputChange("documentType", value)
                }
                disabled={loading || loadingUser}
              >
                <SelectTrigger>
                  <SelectValue placeholder="CC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CC">CC</SelectItem>
                  <SelectItem value="NIT">NIT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Documento */}
            <div className="space-y-2">
              <label
                htmlFor="document"
                className="text-sm font-medium text-muted-foreground"
              >
                Documento
              </label>
              <Input
                id="document"
                placeholder="Número de documento"
                value={formData.document}
                onChange={(e) => handleInputChange("document", e.target.value)}
                disabled={loading || loadingUser}
              />
            </div>

            {/* Email */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-muted-foreground"
              >
                Email {!formData.phone && "*"}
              </label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={loading || loadingUser}
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-muted-foreground"
              >
                Teléfono {!formData.email && "*"}
              </label>
              <Input
                id="phone"
                placeholder="+57 300 123 4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={loading || loadingUser}
              />
            </div>

            {/* País */}
            <div className="space-y-2">
              <label
                htmlFor="country"
                className="text-sm font-medium text-muted-foreground"
              >
                País
              </label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleInputChange("country", value)}
                disabled={loading || loadingUser}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar país" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Colombia">Colombia</SelectItem>
                  <SelectItem value="Venezuela">Venezuela</SelectItem>
                  <SelectItem value="Ecuador">Ecuador</SelectItem>
                  <SelectItem value="Perú">Perú</SelectItem>
                  <SelectItem value="México">México</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ciudad */}
            <div className="space-y-2">
              <label
                htmlFor="city"
                className="text-sm font-medium text-muted-foreground"
              >
                Ciudad
              </label>
              <Input
                id="city"
                placeholder="Ciudad"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                disabled={loading || loadingUser}
              />
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-muted-foreground"
              >
                Dirección
              </label>
              <Input
                id="address"
                placeholder="Ingrese la dirección"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={loading || loadingUser}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
