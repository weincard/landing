"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X, ChevronDown, Search, Camera, User as UserIcon } from "lucide-react";
import { useGifts } from "@/modules/gifts/domain/hooks/use-gifts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { IGift } from "@/data/interfaces/gift.interface";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { validateImageFile } from "@/lib/utils";

interface CreateOrEditGiftProps {
  token: string;
  giftId?: string;
}

// Helper functions
const validateForm = (data: {
  name: string;
  description: string;
  branchIds: number[];
  membershipPlanIds: number[];
  quantity: string;
  expirationDate?: Date;
  code?: string;
}) => {
  const {
    name,
    description,
    branchIds,
    membershipPlanIds,
    quantity,
    expirationDate,
    code,
  } = data;

  if (!name.trim()) return "El nombre del regalo es requerido";
  if (!description.trim()) return "La descripción es requerida";
  if (branchIds.length === 0) return "Debe seleccionar al menos una sucursal";
  if (membershipPlanIds.length === 0) return "Debe seleccionar al menos una membresía";
  if (!quantity) return "Debe ingresar la cantidad de regalos";

  const quantityNum = Number(quantity);
  if (isNaN(quantityNum) || quantityNum <= 0) {
    return "La cantidad debe ser un número positivo";
  }

  if (code && !code.trim()) return "El código no puede estar vacío";

  if (!expirationDate) return "La fecha de expiración es requerida";

  return null;
};

const buildGiftData = (formData: {
  name: string;
  description: string;
  branchIds: number[];
  membershipPlanIds: number[];
  quantity: string;
  code?: string;
  expirationDate: Date;
  isActive: boolean;
  randomDistribution: boolean;
  conditions: string;
  assignedUserIds: number[];
}) => {
  const {
    name,
    description,
    branchIds,
    membershipPlanIds,
    quantity,
    code,
    expirationDate,
    isActive,
    randomDistribution,
    conditions,
    assignedUserIds,
  } = formData;

  const baseGiftData: Partial<IGift> = {
    name: name.trim(),
    description: description.trim(),
    branchIds,
    membershipPlanIds,
    quantity: Number(quantity),
    expirationDate: expirationDate.toISOString(),
    isActive,
  };

  if (code && code.trim()) {
    baseGiftData.code = code.trim();
  }

  return baseGiftData;
};

// Form field component
const FormField = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("space-y-2", className)}>
    <label className="text-sm text-gray-600">
      {label}
    </label>
    {children}
  </div>
);

export function CreateOrEditGift({ token, giftId }: CreateOrEditGiftProps) {
  const router = useRouter();
  const { createGift, getOneGift, updateGift, loading } = useGifts();

  // Image state
  const [avatar, setAvatar] = useState<string>("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    conditions: "",
    branchIds: [] as number[],
    membershipPlanIds: [] as number[],
    quantity: "",
    code: "",
    randomDistribution: true,
    assignedUserIds: [] as number[],
    isActive: true,
  });
  const [expirationDate, setExpirationDate] = useState<Date>();
  
  // Search states
  const [branchSearchTerm, setBranchSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");

  // Mock data - Replace with actual API calls
  const [branches] = useState([
    { branchId: 1, name: "BBQ Poblado", city: "Medellín" },
    { branchId: 2, name: "BBQ Bello", city: "Bello" },
    { branchId: 3, name: "BBQ Laureles", city: "Medellín" },
    { branchId: 4, name: "BBQ Manrique", city: "Medellín" },
    { branchId: 5, name: "BBQ Los Colores", city: "Medellín" },
  ]);

  const [membershipPlans] = useState([
    { membershipPlanId: 1, name: "Weincard Mensual", price: "100", duration: "monthly" },
    { membershipPlanId: 2, name: "Weincard Trimestral", price: "250", duration: "quarterly" },
    { membershipPlanId: 3, name: "Weincard Anual", price: "900", duration: "yearly" },
  ]);

  const [users] = useState([
    { userId: 1, name: "Carlos Lopez" },
    { userId: 2, name: "Ana Ortega" },
    { userId: 3, name: "Pedro Florez" },
    { userId: 4, name: "Antonio Cruz" },
    { userId: 5, name: "Emerson Benavides" },
  ]);

  // Dropdown states
  const [branchesDropdownOpen, setBranchesDropdownOpen] = useState(false);
  const [membershipDropdownOpen, setMembershipDropdownOpen] = useState(false);

  // Load existing gift data if editing
  useEffect(() => {
    if (giftId) {
      loadGiftData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [giftId]);

  const loadGiftData = async () => {
    try {
      const response = await getOneGift(Number(giftId), token);
      if (response && response.gift) {
        const gift = response.gift;
        setFormData({
          name: gift.name || "",
          description: gift.description || "",
          conditions: "",
          branchIds: gift.branchIds || [],
          membershipPlanIds: gift.membershipPlanIds || [],
          quantity: gift.quantity?.toString() || "",
          code: gift.code || "",
          randomDistribution: true,
          assignedUserIds: [],
          isActive: gift.isActive ?? true,
        });

        if (gift.expirationDate) {
          setExpirationDate(new Date(gift.expirationDate));
        }
      }
    } catch (error) {
      console.error("Error loading gift:", error);
      toast.error("Error al cargar el regalo");
    }
  };

  const handleAvatarChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];

        // Validate image
        const validation = await validateImageFile(file);
        if (!validation.isValid) {
          toast.error(validation.error || "Error al validar la imagen");
          e.target.value = "";
          return;
        }

        setProfileFile(file);
        setShouldRemoveAvatar(false);

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
    const fileInput = document.getElementById("avatar-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }, []);

  const handleInputChange = useCallback(
    (field: string, value: string | boolean | number[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleBranchToggle = (branchId: number) => {
    setFormData((prev) => {
      const newBranchIds = prev.branchIds.includes(branchId)
        ? prev.branchIds.filter((id) => id !== branchId)
        : [...prev.branchIds, branchId];
      return { ...prev, branchIds: newBranchIds };
    });
  };

  const handleRemoveBranch = (branchId: number) => {
    setFormData((prev) => ({
      ...prev,
      branchIds: prev.branchIds.filter((id) => id !== branchId),
    }));
  };

  const handleMembershipToggle = (membershipPlanId: number) => {
    setFormData((prev) => {
      const newMembershipPlanIds = prev.membershipPlanIds.includes(membershipPlanId)
        ? prev.membershipPlanIds.filter((id) => id !== membershipPlanId)
        : [...prev.membershipPlanIds, membershipPlanId];
      return { ...prev, membershipPlanIds: newMembershipPlanIds };
    });
  };

  const handleRemoveMembership = (membershipPlanId: number) => {
    setFormData((prev) => ({
      ...prev,
      membershipPlanIds: prev.membershipPlanIds.filter((id) => id !== membershipPlanId),
    }));
  };

  const handleUserToggle = (userId: number) => {
    setFormData((prev) => {
      const newUserIds = prev.assignedUserIds.includes(userId)
        ? prev.assignedUserIds.filter((id) => id !== userId)
        : [...prev.assignedUserIds, userId];
      return { ...prev, assignedUserIds: newUserIds };
    });
  };

  const handleRemoveUser = (userId: number) => {
    setFormData((prev) => ({
      ...prev,
      assignedUserIds: prev.assignedUserIds.filter((id) => id !== userId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationError = validateForm({
      ...formData,
      expirationDate,
    });

    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (!expirationDate) {
      toast.error("La fecha de expiración es requerida");
      return;
    }

    try {
      const giftData = buildGiftData({
        ...formData,
        expirationDate,
      });

      let response;
      if (giftId) {
        response = await updateGift(Number(giftId), giftData, token);
      } else {
        response = await createGift(giftData, token);
      }

      if (response) {
        toast.success(
          response.message ||
            (giftId
              ? "Regalo actualizado exitosamente"
              : "Regalo creado exitosamente")
        );
        router.push("/dashboard/gifts");
      }
    } catch (error: any) {
      console.error("Error submitting gift:", error);
      toast.error(
        error?.message || `Error al ${giftId ? "actualizar" : "crear"} el regalo`
      );
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/gifts");
  };

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(branchSearchTerm.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/gifts"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Regalos</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Avatar + Name */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="relative group">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt="Regalo avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-purple-200">
                        <UserIcon className="h-8 w-8 text-purple-700" />
                      </div>
                    )}
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity"
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={loading}
                    />
                    {avatar && (
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg"
                        onClick={handleRemoveAvatar}
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <FormField label="Nombre del regalo">
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Alitas BBQ x10"
                    disabled={loading}
                    className="text-base"
                  />
                </FormField>
              </div>
            </div>

            {/* Description */}
            <FormField label="Descripción">
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descuento del 50%"
                disabled={loading}
                rows={3}
                className="text-base resize-none"
              />
            </FormField>

            {/* Conditions */}
            <FormField label="Condiciones Principales">
              <Input
                value={formData.conditions}
                onChange={(e) => handleInputChange("conditions", e.target.value)}
                placeholder="No incluye Bebidas"
                disabled={loading}
                className="text-base"
              />
            </FormField>

            {/* Where it applies (Branches) */}
            <FormField label="Donde Aplica">
              <div className="space-y-2">
                {/* Selected branches as badges */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.branchIds.map((branchId) => {
                    const branch = branches.find((b) => b.branchId === branchId);
                    if (!branch) return null;
                    return (
                      <Badge
                        key={branchId}
                        variant="secondary"
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm"
                      >
                        {branch.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveBranch(branchId)}
                          className="ml-2 hover:text-red-200"
                        >
                          ×
                        </button>
                      </Badge>
                    );
                  })}
                </div>

                {/* Search input with dropdown */}
                <div className="relative">
                  <Input
                    value={branchSearchTerm}
                    onChange={(e) => {
                      setBranchSearchTerm(e.target.value);
                      if (e.target.value) {
                        setBranchesDropdownOpen(true);
                      }
                    }}
                    onFocus={() => {
                      if (branchSearchTerm || filteredBranches.length > 0) {
                        setBranchesDropdownOpen(true);
                      }
                    }}
                    placeholder="BBQ Los Colores"
                    disabled={loading}
                    className="pr-8"
                  />
                  <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  
                  {/* Dropdown results */}
                  {branchesDropdownOpen && (branchSearchTerm || filteredBranches.length > 0) && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                      {filteredBranches.map((branch) => (
                        <div
                          key={branch.branchId}
                          className="flex items-center justify-between py-2 px-3 hover:bg-gray-100 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent input blur
                            handleBranchToggle(branch.branchId);
                            setBranchSearchTerm("");
                            setBranchesDropdownOpen(false);
                          }}
                        >
                          <span className="text-sm">
                            {branch.name}
                            {branch.city && ` - ${branch.city}`}
                          </span>
                          {formData.branchIds.includes(branch.branchId) && (
                            <span className="text-green-600 font-bold">✓</span>
                          )}
                        </div>
                      ))}
                      {filteredBranches.length === 0 && (
                        <div className="py-2 px-3 text-sm text-gray-500">
                          No se encontraron sucursales
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </FormField>

            {/* Membership applied */}
            <FormField label="Membresía aplicada">
              <Popover open={membershipDropdownOpen} onOpenChange={setMembershipDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    type="button"
                    className="w-full justify-between text-base font-normal min-h-[40px] h-auto"
                    disabled={loading}
                  >
                    <div className="flex flex-wrap gap-2 flex-1">
                      {formData.membershipPlanIds.length === 0 ? (
                        <span className="text-gray-500">Seleccionar membresía</span>
                      ) : (
                        formData.membershipPlanIds.map((planId) => {
                          const plan = membershipPlans.find((p) => p.membershipPlanId === planId);
                          if (!plan) return null;
                          return (
                            <Badge
                              key={planId}
                              variant="secondary"
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMembership(planId);
                              }}
                            >
                              {plan.name}
                              <span className="ml-2">×</span>
                            </Badge>
                          );
                        })
                      )}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-2" align="start">
                  <div className="max-h-[200px] overflow-y-auto">
                    {membershipPlans.map((plan) => (
                      <div
                        key={plan.membershipPlanId}
                        className="flex items-center justify-between py-2 px-3 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => handleMembershipToggle(plan.membershipPlanId)}
                      >
                        <span className="text-sm">
                          {plan.name}
                        </span>
                        {formData.membershipPlanIds.includes(plan.membershipPlanId) && (
                          <span className="text-green-600 font-bold">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </FormField>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quantity */}
            <FormField label="Cantidad de Regalos">
              <Input
                type="text"
                value={formData.quantity}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  handleInputChange("quantity", value);
                }}
                placeholder="100"
                disabled={loading}
                className="text-base"
              />
            </FormField>

            {/* Random Distribution */}
            <FormField label="Distribución Aleatoria">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="randomDistribution"
                    checked={formData.randomDistribution === true}
                    onChange={() => handleInputChange("randomDistribution", true)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm">SI</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="randomDistribution"
                    checked={formData.randomDistribution === false}
                    onChange={() => handleInputChange("randomDistribution", false)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm">NO</span>
                </label>
              </div>
            </FormField>

            {/* Assign to Users */}
            <FormField label="Asignar a Usuarios">
              <div className="space-y-2">
                {/* Selected users as badges */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.assignedUserIds.map((userId) => {
                    const user = users.find((u) => u.userId === userId);
                    if (!user) return null;
                    return (
                      <Badge
                        key={userId}
                        variant="secondary"
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm"
                      >
                        {user.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveUser(userId)}
                          className="ml-2 hover:text-red-200"
                        >
                          ×
                        </button>
                      </Badge>
                    );
                  })}
                </div>

                {/* User search input */}
                <div className="relative">
                  <Input
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    placeholder="Emerson Benavides"
                    disabled={loading}
                    className="pr-8"
                  />
                  <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* User search results */}
                {userSearchTerm && (
                  <div className="border rounded-md p-2 max-h-[150px] overflow-y-auto bg-white shadow-sm">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.userId}
                        className="flex items-center justify-between py-2 px-3 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => {
                          handleUserToggle(user.userId);
                          setUserSearchTerm("");
                        }}
                      >
                        <span className="text-sm">{user.name}</span>
                        {formData.assignedUserIds.includes(user.userId) && (
                          <span className="text-green-600 font-bold">✓</span>
                        )}
                      </div>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="text-sm text-gray-500 py-2 px-3">
                        No se encontraron usuarios
                      </div>
                    )}
                  </div>
                )}
              </div>
            </FormField>

            {/* Code */}
            <FormField label="Código">
              <Input
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                placeholder="121KSA"
                disabled={loading}
                className="text-base"
              />
            </FormField>

            {/* Expiration Date */}
            <FormField label="Fecha de expiración">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(
                      "w-full justify-between text-left font-normal text-base",
                      !expirationDate && "text-muted-foreground"
                    )}
                    disabled={loading}
                  >
                    {expirationDate ? (
                      format(expirationDate, "dd-MM-yyyy", { locale: es })
                    ) : (
                      <span>12-02-2026</span>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expirationDate}
                    onSelect={setExpirationDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </FormField>

            {/* Active Toggle */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium">Activo</span>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  disabled={loading}
                />
                <span className="text-sm text-gray-600">
                  {formData.isActive ? "sí" : "no"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
