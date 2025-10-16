"use client";

import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X, Save } from "lucide-react";
import { useCoupons } from "@/modules/coupons/domain/hooks/use-coupons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ICoupon } from "@/data/interfaces/coupon.interface";

interface CreateOrEditCouponProps {
  token: string;
  couponId?: string;
}

// Mock plans data
const mockPlans = [
  { planId: 1, name: "Wein card mensual", price: 29.99 },
  { planId: 2, name: "Wein card anual", price: 299.99 },
  { planId: 3, name: "Wein card premium", price: 49.99 },
];

// Mock redemption limits
const redemptionLimits = [10, 20, 30, 40, 50, 100];

// Mock renewal counts
const renewalCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function CreateOrEditCoupon({
  token,
  couponId,
}: CreateOrEditCouponProps) {
  const router = useRouter();
  const { createCoupon, getOneCoupon, updateCoupon, loading } = useCoupons();

  // Form fields
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [planId, setPlanId] = useState<string>("");
  const [maxRedemptions, setMaxRedemptions] = useState<string>("30");
  const [renewalCount, setRenewalCount] = useState<string>("2");
  const [isActive, setIsActive] = useState(true);

  // Load coupon data if editing
  useEffect(() => {
    if (couponId) {
      const loadCoupon = async () => {
        const response = await getOneCoupon(Number(couponId), token);
        if (response && response.coupon) {
          const coupon = response.coupon;
          setCode(coupon.code || "");
          setName(coupon.name || "");
          setPlanId(coupon.planId?.toString() || "");
          setMaxRedemptions(coupon.maxRedemptions?.toString() || "30");
          setRenewalCount(coupon.renewalCount?.toString() || "2");
          setIsActive(coupon.isActive ?? true);
        }
      };

      loadCoupon();
    }
  }, [couponId, token, getOneCoupon]);

  const handleSave = async () => {
    // Validation
    if (!code.trim()) {
      toast.error("El código es requerido");
      return;
    }
    if (!name.trim()) {
      toast.error("El nombre del cupón es requerido");
      return;
    }
    if (!planId) {
      toast.error("Debe seleccionar un plan");
      return;
    }
    if (!maxRedemptions) {
      toast.error("Debe seleccionar el máximo de redenciones");
      return;
    }
    if (!renewalCount) {
      toast.error("Debe seleccionar la cantidad de renovaciones");
      return;
    }

    const couponData: Partial<ICoupon> = {
      code: code.trim(),
      name: name.trim(),
      planId: Number(planId),
      maxRedemptions: Number(maxRedemptions),
      renewalCount: Number(renewalCount),
      isActive,
    };

    try {
      let response;
      if (couponId) {
        response = await updateCoupon(Number(couponId), couponData, token);
      } else {
        response = await createCoupon(couponData, token);
      }

      if (response) {
        toast.success(
          response.message || couponId
            ? "Cupón actualizado exitosamente"
            : "Cupón creado exitosamente"
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
          <div className="grid grid-cols-2 gap-6">
            {/* Código */}
            <div className="space-y-2">
              <Label htmlFor="code">
                Código <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="Ej: 121KSA"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Nombre del cupón */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre del cupón <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ej: Premio weih"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Plan aplicado */}
            <div className="space-y-2">
              <Label htmlFor="plan">
                Plan aplicado <span className="text-red-500">*</span>
              </Label>
              <Select
                value={planId}
                onValueChange={setPlanId}
                disabled={loading}
              >
                <SelectTrigger id="plan">
                  <SelectValue placeholder="Selecciona un plan" />
                </SelectTrigger>
                <SelectContent>
                  {mockPlans.map((plan) => (
                    <SelectItem
                      key={plan.planId}
                      value={plan.planId.toString()}
                    >
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Máximo # redenciones */}
            <div className="space-y-2">
              <Label htmlFor="maxRedemptions">
                Máximo # redenciones <span className="text-red-500">*</span>
              </Label>
              <Select
                value={maxRedemptions}
                onValueChange={setMaxRedemptions}
                disabled={loading}
              >
                <SelectTrigger id="maxRedemptions">
                  <SelectValue placeholder="Selecciona el límite" />
                </SelectTrigger>
                <SelectContent>
                  {redemptionLimits.map((limit) => (
                    <SelectItem key={limit} value={limit.toString()}>
                      {limit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cantidad de renovaciones */}
            <div className="space-y-2">
              <Label htmlFor="renewalCount">
                Cantidad de renovaciones <span className="text-red-500">*</span>
              </Label>
              <Select
                value={renewalCount}
                onValueChange={setRenewalCount}
                disabled={loading}
              >
                <SelectTrigger id="renewalCount">
                  <SelectValue placeholder="Selecciona cantidad" />
                </SelectTrigger>
                <SelectContent>
                  {renewalCounts.map((count) => (
                    <SelectItem key={count} value={count.toString()}>
                      {count}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
