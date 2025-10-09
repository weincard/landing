"use client";

import { useState, useCallback } from "react";
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
import type { UserRole } from "@/data/interfaces/user.interface";
import { toast } from "sonner";

interface CreateOrEditUserProps {
  token?: string;
}

export function CreateOrEditUser({ token }: CreateOrEditUserProps) {
  const router = useRouter();
  const { createUser, loading, error } = useUsers();
  const [avatar, setAvatar] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("client");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    documentType: "CC" as "CC" | "NIT",
    // Shipping address fields (no se envían al backend pero se mantienen en la vista)
    address: "",
    apartment: "",
    country: "",
    city: "",
    shippingPhone: "",
  });

  const handleAvatarChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.email || !formData.phone) {
      toast.error("Email y teléfono son campos requeridos");
      return;
    }

    // Preparar datos para enviar al backend (solo los campos requeridos)
    const userParams = {
      name: formData.name,
      lastName: "", // La API espera lastName pero el formulario no lo tiene separado
      email: formData.email,
      phone: formData.phone,
      document: formData.document,
      documentType: formData.documentType,
      role: selectedRole,
      isVerified: true,
    };

    console.log("Sending user data:", userParams);

    const response = await createUser(userParams);

    if (response) {
      console.log("User created successfully:", response);
      toast.success(`Usuario creado exitosamente: ${response.message}`);
      router.push("/dashboard/usuarios"); // Redirigir a la lista de usuarios
    } else if (error) {
      console.error("Error creating user:", error);
      toast.error(`Error al crear usuario: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Agregar Usuario</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {loading ? "Guardando..." : "Guardar"}
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
                  Rol del Usuario
                </label>
                <Select
                  value={selectedRole}
                  onValueChange={(value: UserRole) => setSelectedRole(value)}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nombres */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-muted-foreground"
              >
                Nombres
              </label>
              <Input
                id="name"
                placeholder="Ingrese nombres"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
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
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-muted-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-muted-foreground"
              >
                Teléfono
              </label>
              <Input
                id="phone"
                placeholder="+57 300 123 4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="mt-8">
            <h3 className="text-base font-medium text-muted-foreground mb-4">
              Shipping address information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                />
              </div>

              {/* Apartamentos */}
              <div className="space-y-2">
                <label
                  htmlFor="apartment"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Apartamentos
                </label>
                <Input
                  id="apartment"
                  placeholder="Número de apartamento"
                  value={formData.apartment}
                  onChange={(e) =>
                    handleInputChange("apartment", e.target.value)
                  }
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
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colombia">Colombia</SelectItem>
                    <SelectItem value="venezuela">Venezuela</SelectItem>
                    <SelectItem value="ecuador">Ecuador</SelectItem>
                    <SelectItem value="peru">Perú</SelectItem>
                    <SelectItem value="mexico">México</SelectItem>
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
                  placeholder="Ingrese la ciudad"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </div>

              {/* Phone (Shipping) */}
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="shippingPhone"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Phone
                </label>
                <Input
                  id="shippingPhone"
                  placeholder="+57 300 123 4567"
                  value={formData.shippingPhone}
                  onChange={(e) =>
                    handleInputChange("shippingPhone", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
