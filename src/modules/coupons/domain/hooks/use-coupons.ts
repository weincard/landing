import { useCallback, useState } from "react";
import container from "@/lib/di/container";
import { GetAllCouponsUseCase } from "../use-cases/get-all-coupons.use-case";
import { GetOneCouponUseCase } from "../use-cases/get-one-coupon.use-case";
import { CreateCouponUseCase } from "../use-cases/create-coupon.use-case";
import { UpdateCouponUseCase } from "../use-cases/update-coupon.use-case";
import { DeleteCouponUseCase } from "../use-cases/delete-coupon.use-case";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type {
  AllCouponsResponse,
  CouponResponse,
} from "../../data/interfaces/coupons.response.interface";
import type { ICoupon } from "@/data/interfaces/coupon.interface";

export const useCoupons = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllCoupons = useCallback(
    async (
      token?: string,
      paginationParams?: IPaginationParams,
      filters?: { name?: string; isActive?: boolean }
    ): Promise<AllCouponsResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getAllCouponsUseCase = container.get(GetAllCouponsUseCase);
        const response = await getAllCouponsUseCase.execute(
          token,
          paginationParams,
          filters
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar cupones";
        setError(errorMessage);
        console.error("Error getting coupons:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getOneCoupon = useCallback(
    async (
      couponId: number,
      token?: string
    ): Promise<CouponResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getOneCouponUseCase = container.get(GetOneCouponUseCase);
        const response = await getOneCouponUseCase.execute(couponId, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar cupón";
        setError(errorMessage);
        console.error("Error getting coupon:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createCoupon = useCallback(
    async (
      couponData: Partial<ICoupon>,
      token?: string
    ): Promise<CouponResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const createCouponUseCase = container.get(CreateCouponUseCase);
        const response = await createCouponUseCase.execute(couponData, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al crear cupón";
        setError(errorMessage);
        console.error("Error creating coupon:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateCoupon = useCallback(
    async (
      couponId: number,
      couponData: Partial<ICoupon>,
      token?: string
    ): Promise<CouponResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const updateCouponUseCase = container.get(UpdateCouponUseCase);
        const response = await updateCouponUseCase.execute(
          couponId,
          couponData,
          token
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al actualizar cupón";
        setError(errorMessage);
        console.error("Error updating coupon:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCoupon = useCallback(
    async (
      couponId: number,
      token?: string
    ): Promise<{ message: string } | null> => {
      setLoading(true);
      setError(null);

      try {
        const deleteCouponUseCase = container.get(DeleteCouponUseCase);
        const response = await deleteCouponUseCase.execute(couponId, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al eliminar cupón";
        setError(errorMessage);
        console.error("Error deleting coupon:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    getAllCoupons,
    getOneCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    loading,
    error,
  };
};
