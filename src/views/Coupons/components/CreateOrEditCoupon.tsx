"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X, Save, CalendarIcon } from "lucide-react";
import { useCoupons } from "@/modules/coupons/domain/hooks/use-coupons";
import { useMembershipPlans } from "@/modules/membership-plans/domain/hooks/use-membership-plans";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ICoupon } from "@/data/interfaces/coupon.interface";
import type { IMembershipPlan } from "@/data/interfaces/membership-plan.interface";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateOrEditCouponProps {
  token: string;
  couponId?: string;
}

// Constants
const DISCOUNT_TYPES = [{ value: "percentage", label: "Porcentaje" }] as const;

// Helper functions
const validateForm = (data: {
  code: string;
  name: string;
  description: string;
  planId: string;
  maxRedemptions: string;
  renewalCount: string;
  couponImport: string;
  expirationDate?: Date;
  renewalType: string;
}) => {
  const {
    code,
    name,
    description,
    planId,
    maxRedemptions,
    renewalCount,
    couponImport,
    expirationDate,
    renewalType,
  } = data;

  if (!code.trim()) return "El código es requerido";
  if (!name.trim()) return "El nombre del cupón es requerido";
  if (!description.trim()) return "La descripción es requerida";
  if (!planId) return "Debe seleccionar un plan";
  if (!maxRedemptions) return "Debe ingresar el máximo de redenciones";
  if (!renewalCount) return "Debe ingresar la cantidad de renovaciones";

  const maxRedemptionsNum = Number(maxRedemptions);
  if (isNaN(maxRedemptionsNum) || maxRedemptionsNum <= 0) {
    return "El máximo de redenciones debe ser un número positivo";
  }

  const renewalCountNum = Number(renewalCount);
  if (isNaN(renewalCountNum) || renewalCountNum <= 0 || renewalCountNum > 12) {
    return "La cantidad de renovaciones debe ser un número entre 1 y 12";
  }
  if (!couponImport.trim()) return "El importe del cupón es requerido";

  const discountValue = Number(couponImport);
  if (renewalType === "percentage") {
    if (isNaN(discountValue) || discountValue < 1 || discountValue > 100) {
      return "El porcentaje debe ser un número entre 1 y 100";
    }
  } else {
    if (isNaN(discountValue) || discountValue <= 0) {
      return "El monto debe ser un número positivo";
    }
  }

  if (!expirationDate) return "La fecha de expiración es requerida";

  return null;
};

const buildCouponData = (formData: {
  code: string;
  name: string;
  description: string;
  planId: string;
  maxRedemptions: string;
  renewalCount: string;
  couponImport: string;
  expirationDate: Date;
  isActive: boolean;
  renewalType: string;
}) => {
  const {
    code,
    name,
    description,
    planId,
    maxRedemptions,
    renewalCount,
    couponImport,
    expirationDate,
    isActive,
    renewalType,
  } = formData;

  const discountValue = Number(couponImport);
  const baseCouponData = {
    code: code.trim(),
    name: name.trim(),
    description: description.trim(),
    membershipPlanId: Number(planId),
    maxRedemptions: Number(maxRedemptions),
    renewalCount: Number(renewalCount),
    expirationDate: expirationDate.toISOString(),
    isActive,
  };

  // Siempre enviamos discountPercentage
  // Si es monto fijo, enviamos 100% y agregamos discountAmount
  if (renewalType === "percentage") {
    return {
      ...baseCouponData,
      discountPercentage: discountValue,
    };
  }

  return {
    ...baseCouponData,
    discountPercentage: 100,
    discountAmount: discountValue,
  };
};

const getDurationLabel = (duration: string) => {
  const durationMap: Record<string, string> = {
    monthly: "Mensual",
    quarterly: "Trimestral",
    yearly: "Anual",
  };
  return durationMap[duration.toLowerCase()] || duration;
};

// Form field component
const FormField = ({
  label,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("space-y-2", className)}>
    <label htmlFor={htmlFor} className="text-sm text-muted-foreground">
      {label}
    </label>
    {children}
  </div>
);

export function CreateOrEditCoupon({
  token,
  couponId,
}: CreateOrEditCouponProps) {
  const router = useRouter();
  const { createCoupon, getOneCoupon, updateCoupon, loading } = useCoupons();
  const { getAllMembershipPlans, loading: loadingMembershipPlans } =
    useMembershipPlans();

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    planId: "",
    maxRedemptions: "",
    renewalCount: "",
    renewalType: "percentage",
    couponImport: "",
    isActive: true,
  });
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [membershipPlans, setMembershipPlans] = useState<IMembershipPlan[]>([]);

  // Generic handler for form fields
  const updateFormField = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Load membership plans
  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        const plans = await getAllMembershipPlans(token);
        setMembershipPlans(plans);
      } catch (error) {
        console.error("Error fetching membership plans:", error);
      }
    };
    fetchMembershipPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Load coupon data if editing
  useEffect(() => {
    if (!couponId) return;

    const loadCoupon = async () => {
      const response = await getOneCoupon(Number(couponId), token);
      if (!response?.coupon) return;

      const coupon = response.coupon;

      // Determinar el tipo de descuento y su valor
      let renewalType = "percentage";
      let couponImport = "";

      if (coupon.discountAmount) {
        renewalType = "fixed";
        couponImport = coupon.discountAmount.toString();
      } else if (coupon.discountPercentage) {
        renewalType = "percentage";
        couponImport = coupon.discountPercentage.toString();
      } else if (coupon.discountValue) {
        // Fallback para compatibilidad
        renewalType = coupon.discountType || "percentage";
        couponImport = coupon.discountValue.toString();
      }

      setFormData({
        code: coupon.code || "",
        name: coupon.name || "",
        description: coupon.description || "",
        planId:
          (
            coupon.membershipPlan?.membershipPlanId ||
            coupon.membershipPlanId ||
            coupon.planId
          )?.toString() || "",
        maxRedemptions: coupon.maxRedemptions?.toString() || "30",
        renewalCount: coupon.renewalCount?.toString() || "2",
        renewalType,
        couponImport,
        isActive: coupon.isActive ?? true,
      });

      if (coupon.expirationDate) {
        setExpirationDate(new Date(coupon.expirationDate));
      }
    };

    loadCoupon();
  }, [couponId, token, getOneCoupon]);

  const handleSave = async () => {
    const validationError = validateForm({
      ...formData,
      expirationDate,
    });

    if (validationError) {
      toast.error(validationError);
      return;
    }

    const couponData = buildCouponData({
      ...formData,
      expirationDate: expirationDate!,
    });

    try {
      const response = couponId
        ? await updateCoupon(Number(couponId), couponData, token)
        : await createCoupon(couponData, token);

      if (response) {
        toast.success(
          response.message ||
            (couponId
              ? "Cupón actualizado exitosamente"
              : "Cupón creado exitosamente")
        );
        router.push("/dashboard/coupons");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error al guardar el cupón");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/coupons");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {couponId ? "Editar cupón" : "Agregar cupón"}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Información del cupón</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-4 gap-6">
            {/* Código */}
            <FormField label="Código" htmlFor="code" className="col-span-2">
              <Input
                id="code"
                placeholder="Ej: 121KSA"
                value={formData.code}
                onChange={(e) => updateFormField("code", e.target.value)}
                disabled={loading}
              />
            </FormField>

            {/* Descripción */}
            <FormField
              label="Descripción"
              htmlFor="description"
              className="col-span-2 row-span-2"
            >
              <Textarea
                id="description"
                placeholder="Descripción del cupón"
                rows={5}
                value={formData.description}
                onChange={(e) => updateFormField("description", e.target.value)}
                disabled={loading}
                className="resize-none"
              />
            </FormField>

            {/* Nombre del cupón */}
            <FormField
              label="Nombre del cupón"
              htmlFor="name"
              className="col-span-2"
            >
              <Input
                id="name"
                placeholder="Ej: Premio weih"
                value={formData.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                disabled={loading}
              />
            </FormField>

            {/* Membresía aplicada */}
            <FormField
              label="Membresía aplicada"
              htmlFor="plan"
              className="col-span-2"
            >
              <Select
                value={formData.planId}
                onValueChange={(value) => updateFormField("planId", value)}
                disabled={loading || loadingMembershipPlans}
              >
                <SelectTrigger id="plan">
                  <SelectValue
                    placeholder={
                      loadingMembershipPlans
                        ? "Cargando planes..."
                        : "Selecciona un plan"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {membershipPlans.map((plan) => (
                    <SelectItem
                      key={plan.membershipPlanId}
                      value={plan.membershipPlanId.toString()}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{plan.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ${plan.price} - {getDurationLabel(plan.duration)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* Máximo # redenciones */}
            <FormField label="Máximo # redenciones" htmlFor="maxRedemptions">
              <Input
                id="maxRedemptions"
                placeholder="Ej: 30"
                value={formData.maxRedemptions}
                onChange={(e) =>
                  updateFormField("maxRedemptions", e.target.value)
                }
                disabled={loading}
                type="number"
                min="1"
                step="1"
              />
            </FormField>

            <div />

            {/* Tipo de importe */}
            <FormField
              label="Tipo de importe"
              htmlFor="renewalType"
              className="col-span-2"
            >
              <Select
                value={formData.renewalType}
                onValueChange={(value) => updateFormField("renewalType", value)}
                disabled={loading}
              >
                <SelectTrigger id="renewalType">
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  {DISCOUNT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* Importe del cupón */}
            <FormField label="Importe del cupón" htmlFor="coupon_import">
              <Input
                id="coupon_import"
                placeholder={
                  formData.renewalType === "percentage"
                    ? "Ej: 15 (%)"
                    : "Ej: 100 ($)"
                }
                value={formData.couponImport}
                onChange={(e) =>
                  updateFormField("couponImport", e.target.value)
                }
                disabled={loading}
                type="number"
                min={formData.renewalType === "percentage" ? "1" : "0"}
                max={formData.renewalType === "percentage" ? "100" : undefined}
                step={formData.renewalType === "percentage" ? "1" : "0.01"}
              />
              {formData.renewalType === "percentage" && (
                <p className="text-xs text-muted-foreground">
                  El porcentaje debe estar entre 1 y 100
                </p>
              )}
            </FormField>

            <div />

            {/* Cantidad de renovaciones */}
            <FormField
              label="Cantidad de renovaciones"
              htmlFor="renewalCount"
              className="col-span-2"
            >
              <Input
                id="renewalCount"
                placeholder="Ej: 2"
                value={formData.renewalCount}
                onChange={(e) =>
                  updateFormField("renewalCount", e.target.value)
                }
                disabled={loading}
                type="number"
              />
            </FormField>

            {/* Fecha de expiración */}
            <FormField label="Fecha de expiración" htmlFor="expirationDate">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expirationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expirationDate ? (
                      format(expirationDate, "PPP")
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
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
        </CardContent>
      </Card>
    </div>
  );
}
