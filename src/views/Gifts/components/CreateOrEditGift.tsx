"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  X,
  ChevronDown,
  Search,
  Camera,
  User as UserIcon,
  ChevronLeft,
  Plus,
  Calendar as CalendarIcon
} from "lucide-react";
import { useGifts } from "@/modules/gifts/domain/hooks/use-gifts";
import { useBranches } from "@/modules/branches/domain/hooks/use-branches";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { IGift } from "@/data/interfaces/gift.interface";
import type { IBranch } from "@/data/interfaces/merchant.interface";
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
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  conditions: string;
}) => {
  const {
    name,
    description,
    branchIds,
    quantity,
    expirationDate,
    conditions,
  } = data;

  if (!name.trim()) return "El nombre del regalo es requerido";
  if (!description.trim()) return "La descripción es requerida";
  if (branchIds.length === 0) return "Debe seleccionar al menos una sucursal";
  if (!quantity) return "Debe ingresar la cantidad de regalos";

  const quantityNum = Number(quantity);
  if (isNaN(quantityNum) || quantityNum <= 0) {
    return "La cantidad debe ser un número positivo";
  }

  if (!conditions.trim()) return "Las condiciones son requeridas";
  if (!expirationDate) return "La fecha de expiración es requerida";

  return null;
};

const buildGiftData = (formData: {
  name: string;
  description: string;
  branchIds: number[];
  membershipPlanIds: number[];
  quantity: string;
  expirationDate: Date;
  isActive: boolean;
  conditions: string;
  applyWithoutMembership: boolean;
  manualCodes: string[];
  manualUserIds: number[];
}) => {
  const {
    name,
    description,
    branchIds,
    membershipPlanIds,
    quantity,
    expirationDate,
    isActive,
    conditions,
    applyWithoutMembership,
    manualCodes,
    manualUserIds,
  } = formData;

  const giftData: Partial<IGift> = {
    name: name.trim(),
    description: description.trim(),
    conditions: conditions.trim(),
    branchIds,
    membershipPlanIds,
    applyWithoutMembership,
    totalQuantity: Number(quantity),
    expirationDate: expirationDate.toISOString(),
    isActive,
    manualCodes: manualCodes,
    manualUserIds: manualUserIds,
  };

  return giftData;
};

// Form field component
const FormField = ({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("space-y-2", className)}>
    <Label className="text-sm font-medium text-gray-700">{label}</Label>
    {children}
  </div>
);

export default function CreateOrEditGift({
  token,
  giftId,
}: CreateOrEditGiftProps) {
  const router = useRouter();
  const { createGift, updateGift, getOneGift } = useGifts();
  const { getAllBranches, loading: branchesLoading } = useBranches();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    conditions: "",
    branchIds: [] as number[],
    membershipPlanIds: [] as number[],
    quantity: "",
    code: "",
    applyWithoutMembership: false,
    manualCodes: [] as string[],
    manualUserIds: [] as number[],
    isActive: true,
  });
  const [expirationDate, setExpirationDate] = useState<Date>();

  // Search states
  const [branchSearchTerm, setBranchSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");

  // Branch states
  const [availableBranches, setAvailableBranches] = useState<IBranch[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<IBranch[]>([]);

  const [membershipPlans] = useState([
    { membershipPlanId: 1, name: "Weincard Mensual", price: "100", duration: "monthly" },
    { membershipPlanId: 2, name: "Weincard Trimestral", price: "250", duration: "quarterly" },
    { membershipPlanId: 3, name: "Weincard Anual", price: "900", duration: "yearly" },
  ]);

  const [users] = useState([
    { userId: 331, name: "facebooktwitter1@hotmail.com" },
    { userId: 711, name: "andreagui18@gmail.com" },
    { userId: 1, name: "Carlos Lopez" },
  ]);

  // Dropdown states
  const [branchesDropdownOpen, setBranchesDropdownOpen] = useState(false);
  const [membershipDropdownOpen, setMembershipDropdownOpen] = useState(false);

  // Branch search with debounce
  useEffect(() => {
    const searchBranches = async () => {
      if (branchSearchTerm.trim().length >= 2) {
        const response = await getAllBranches(undefined, token, { limit: 20, skip: 0 }, { name: branchSearchTerm });
        if (response && response.branches) {
          setAvailableBranches(response.branches);
        }
      } else {
        setAvailableBranches([]);
      }
    };

    const timeoutId = setTimeout(searchBranches, 500);
    return () => clearTimeout(timeoutId);
  }, [branchSearchTerm, getAllBranches, token]);

  // Load existing gift data if editing
  useEffect(() => {
    if (giftId) {
      loadGiftData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [giftId]);

  const loadGiftData = async () => {
    try {
      setLoading(true);
      const response = await getOneGift(Number(giftId), token);
      if (response && response.gift) {
        const gift = response.gift;
        setFormData({
          name: gift.name || "",
          description: gift.description || "",
          conditions: gift.conditions || "",
          branchIds: gift.branchIds || (gift.branches?.map(b => b.branchId) || []),
          membershipPlanIds: gift.membershipPlanIds || (gift.membershipPlans?.map(m => m.membershipPlanId) || []),
          quantity: (gift.totalQuantity || gift.totalQuantity || "").toString(),
          code: gift.giftCodes?.[0]?.code || "",
          applyWithoutMembership: gift.applyWithoutMembership || false,
          manualCodes: gift.manualCodes || (gift.giftCodes?.map(gc => gc.code) || []),
          manualUserIds: gift.manualUserIds || (gift.giftCodes?.map(gc => gc.user?.userId).filter(Boolean) as number[] || []),
          isActive: gift.isActive ?? true,
        });

        if (gift.branches) {
          setSelectedBranches(gift.branches as IBranch[]);
        }

        if (gift.expirationDate) {
          setExpirationDate(new Date(gift.expirationDate));
        }
      }
    } catch (error) {
      console.error("Error loading gift:", error);
      toast.error("Error al cargar el regalo");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
  };

  const handleBranchToggle = (branch: IBranch) => {
    const branchId = branch.branchId;
    if (branchId === undefined) return;

    setFormData((prev) => {
      const isSelected = prev.branchIds.includes(branchId);
      const newBranchIds = isSelected
        ? prev.branchIds.filter((id) => id !== branchId)
        : [...prev.branchIds, branchId];
      
      return { ...prev, branchIds: newBranchIds };
    });

    setSelectedBranches((prev) => {
      const isSelected = prev.some(b => b.branchId === branchId);
      return isSelected
        ? prev.filter(b => b.branchId !== branchId)
        : [...prev, branch];
    });
  };

  const handleRemoveBranch = (branchId: number | undefined) => {
    if (branchId === undefined) return;
    setFormData((prev) => ({
      ...prev,
      branchIds: prev.branchIds.filter((id) => id !== branchId),
    }));
    setSelectedBranches((prev) => prev.filter(b => b.branchId !== branchId));
  };

  const handleMembershipToggle = (membershipId: number) => {
    setFormData((prev) => {
      const newMembershipIds = prev.membershipPlanIds.includes(membershipId)
        ? prev.membershipPlanIds.filter((id) => id !== membershipId)
        : [...prev.membershipPlanIds, membershipId];
      return { ...prev, membershipPlanIds: newMembershipIds };
    });
  };

  const handleRemoveMembership = (membershipId: number) => {
    setFormData((prev) => ({
      ...prev,
      membershipPlanIds: prev.membershipPlanIds.filter((id) => id !== membershipId),
    }));
  };

  const handleUserToggle = (userId: number) => {
    setFormData((prev) => {
      const newUserIds = prev.manualUserIds.includes(userId)
        ? prev.manualUserIds.filter((id) => id !== userId)
        : [...prev.manualUserIds, userId];
      return { ...prev, manualUserIds: newUserIds };
    });
  };

  const handleRemoveUser = (userId: number) => {
    setFormData((prev) => ({
      ...prev,
      manualUserIds: prev.manualUserIds.filter((id) => id !== userId),
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

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

    setLoading(true);
    try {
      const giftData = buildGiftData({
        ...formData,
        expirationDate,
      });

      const response = giftId
        ? await updateGift(Number(giftId), giftData, token)
        : await createGift(giftData as IGift, token);

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
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/gifts");
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/gifts"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Volver
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Regalos</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit()} disabled={loading}>
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Basic Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">Información General</h3>

            <div className="flex gap-4 items-start">
              <div className="relative group w-20 h-20">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-100 bg-purple-50 flex items-center justify-center">
                  {avatar ? (
                    <Image src={avatar} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <UserIcon className="h-10 w-10 text-purple-600" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>

              <div className="flex-1 space-y-4">
                <FormField label="Nombre del regalo*">
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ej: Plato de cortesía"
                  />
                </FormField>
              </div>
            </div>

            <FormField label="Descripción">
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descripción del regalo para el usuario"
                className="min-h-[80px]"
              />
            </FormField>

            <FormField label="Condiciones">
              <Textarea
                value={formData.conditions}
                onChange={(e) => handleInputChange("conditions", e.target.value)}
                placeholder="Términos y condiciones específicos"
                className="min-h-[80px]"
              />
            </FormField>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">Ubicaciones y Membresías</h3>

              <FormField label="Sucursales donde aplica">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedBranches.map((branch) => (
                    <Badge key={branch.branchId} variant="secondary" className="gap-1 px-2 py-1">
                      {branch.name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveBranch(branch.branchId)} />
                    </Badge>
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute left-2 top-2.5 h-4 w-4">
                    {branchesLoading ? (
                      <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <Input
                    placeholder="Buscar sucursal (mín. 2 letras)..."
                    className="pl-8"
                    value={branchSearchTerm}
                    onChange={(e) => {
                      setBranchSearchTerm(e.target.value);
                      setBranchesDropdownOpen(true);
                    }}
                    onFocus={() => setBranchesDropdownOpen(true)}
                  />
                  {branchesDropdownOpen && branchSearchTerm && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {availableBranches.length === 0 && !branchesLoading && branchSearchTerm.length >= 2 ? (
                        <div className="px-3 py-2 text-sm text-gray-500 italic">No se encontraron sucursales</div>
                      ) : (
                        availableBranches.map((branch) => (
                          <div
                            key={branch.branchId}
                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm flex justify-between items-center"
                            onClick={() => {
                              if (branch.branchId !== undefined) {
                                handleBranchToggle(branch);
                                setBranchSearchTerm("");
                                setBranchesDropdownOpen(false);
                              }
                            }}
                          >
                            {branch.name}
                            {branch.branchId !== undefined && formData.branchIds.includes(branch.branchId) && <span>✓</span>}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </FormField>

            <FormField label="Membresías requeridas">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.membershipPlanIds.map((id) => {
                    const plan = membershipPlans.find((p) => p.membershipPlanId === id);
                    return (
                      <Badge key={id} variant="secondary" className="gap-1 px-2 py-1">
                        {plan?.name}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveMembership(id)} />
                      </Badge>
                    );
                  })}
                </div>
                <Popover open={membershipDropdownOpen} onOpenChange={setMembershipDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between font-normal">
                      Seleccionar membresías
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <div className="p-2 space-y-1">
                      {membershipPlans.map((plan) => (
                        <div
                          key={plan.membershipPlanId}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => handleMembershipToggle(plan.membershipPlanId)}
                        >
                          <Checkbox checked={formData.membershipPlanIds.includes(plan.membershipPlanId)} />
                          <span className="text-sm">{plan.name}</span>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </FormField>
          </div>
        </div>

        {/* Right Column: Settings & Distribution */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">Configuración de Redención</h3>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Cantidad Total">
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  placeholder="Ej: 100"
                />
              </FormField>

              <FormField label="Fecha Expiración">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expirationDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expirationDate ? format(expirationDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={expirationDate}
                      onSelect={setExpirationDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormField>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-0.5">
                <Label>Activo</Label>
                <div className="text-sm text-gray-500">Habilitar redención del regalo</div>
              </div>
              <Switch checked={formData.isActive} onCheckedChange={(val) => handleInputChange("isActive", val)} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-0.5">
                <Label>Aplicar sin membresía</Label>
                <div className="text-sm text-gray-500">Usuarios sin plan pueden redimir</div>
              </div>
              <Switch checked={formData.applyWithoutMembership} onCheckedChange={(val) => handleInputChange("applyWithoutMembership", val)} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Asignación Manual</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Asignar
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar usuario..."
                        className="pl-8"
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                    {users.filter(u => u.name.toLowerCase().includes(userSearchTerm.toLowerCase())).map(user => (
                      <div
                        key={user.userId}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => handleUserToggle(user.userId)}
                      >
                        <Checkbox checked={formData.manualUserIds.includes(user.userId)} />
                        <span className="text-sm">{user.name}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.manualUserIds.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No hay usuarios asignados manualmente.</p>
              ) : (
                formData.manualUserIds.map((id) => {
                  const user = users.find((u) => u.userId === id);
                  return (
                    <Badge key={id} variant="secondary" className="gap-1 px-2 py-1">
                      {user?.name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveUser(id)} />
                    </Badge>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
