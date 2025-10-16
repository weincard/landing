import type { ICoupon } from "@/data/interfaces/coupon.interface";
import { inject } from "inversify/lib/annotation/inject";
import { injectable } from "inversify/lib/annotation/injectable";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import {
  AllCouponsResponse,
  CouponResponse,
} from "../interfaces/coupons.response.interface";
import {
  allCouponsResponseAdapter,
  createCouponResponseAdapter,
  getCouponResponseAdapter,
  updateCouponResponseAdapter,
} from "../adapters/coupons.response.adapter";

// Mock data
const mockCoupons: ICoupon[] = [
  {
    couponId: 1,
    code: "121KSA",
    name: "Premio 1",
    description:
      "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto",
    planId: 1,
    maxRedemptions: 30,
    renewalCount: 2,
    branchIds: [1],
    isActive: true,
    redemptionsCount: 45,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    plan: {
      planId: 1,
      name: "Wein card mensual",
      price: 29.99,
    },
    branches: [
      {
        branchId: 1,
        name: "Sucursal Centro",
        city: "Medellín",
      },
    ],
  },
  {
    couponId: 2,
    code: "ABC123",
    name: "Premio 2",
    description:
      "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto",
    planId: 1,
    maxRedemptions: 30,
    renewalCount: 2,
    branchIds: [3],
    isActive: true,
    redemptionsCount: 656,
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
    plan: {
      planId: 1,
      name: "Wein card mensual",
      price: 29.99,
    },
    branches: [
      {
        branchId: 3,
        name: "Sucursal Norte",
        city: "Bogotá",
      },
    ],
  },
  {
    couponId: 3,
    code: "XYZ789",
    name: "Premio n",
    description:
      "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto",
    planId: 2,
    maxRedemptions: 50,
    renewalCount: 3,
    branchIds: [4],
    isActive: true,
    redemptionsCount: 6784,
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-01-17T10:00:00Z",
    plan: {
      planId: 2,
      name: "Wein card anual",
      price: 299.99,
    },
    branches: [
      {
        branchId: 4,
        name: "Sucursal Sur",
        city: "Cali",
      },
    ],
  },
  {
    couponId: 4,
    code: "DEF456",
    name: "Premio n",
    description:
      "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto",
    planId: 1,
    maxRedemptions: 30,
    renewalCount: 2,
    branchIds: [2],
    isActive: true,
    redemptionsCount: 2323,
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
    plan: {
      planId: 1,
      name: "Wein card mensual",
      price: 29.99,
    },
    branches: [
      {
        branchId: 2,
        name: "Sucursal Este",
        city: "Medellín",
      },
    ],
  },
  {
    couponId: 5,
    code: "GHI789",
    name: "Premio n",
    description:
      "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto",
    planId: 3,
    maxRedemptions: 20,
    renewalCount: 1,
    branchIds: [5],
    isActive: false,
    redemptionsCount: 34,
    createdAt: "2024-01-19T10:00:00Z",
    updatedAt: "2024-01-19T10:00:00Z",
    plan: {
      planId: 3,
      name: "Wein card premium",
      price: 49.99,
    },
    branches: [
      {
        branchId: 5,
        name: "Sucursal Oeste",
        city: "Cartagena",
      },
    ],
  },
  {
    couponId: 6,
    code: "JKL012",
    name: "Premio n",
    description:
      "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto",
    planId: 1,
    maxRedemptions: 30,
    renewalCount: 2,
    branchIds: [6],
    isActive: false,
    redemptionsCount: 45,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
    plan: {
      planId: 1,
      name: "Wein card mensual",
      price: 29.99,
    },
    branches: [
      {
        branchId: 6,
        name: "Sucursal Principal",
        city: "Barranquilla",
      },
    ],
  },
];

export abstract class CouponsRepository {
  abstract create(
    couponData: Partial<ICoupon>,
    token?: string
  ): Promise<CouponResponse>;
  abstract getAll(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string; isActive?: boolean }
  ): Promise<AllCouponsResponse>;
  abstract getOne(couponId: number, token?: string): Promise<CouponResponse>;
  abstract update(
    couponId: number,
    couponData: Partial<ICoupon>,
    token?: string
  ): Promise<CouponResponse>;
  abstract delete(
    couponId: number,
    token?: string
  ): Promise<{ message: string }>;
}

@injectable()
export class CouponsRepositoryImpl implements CouponsRepository {
  constructor() {}

  async getAll(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string; isActive?: boolean }
  ): Promise<AllCouponsResponse> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { limit = 10, skip = 0 } = paginationParams || {};

    let filteredCoupons = [...mockCoupons];

    // Aplicar filtros
    if (filters?.name) {
      filteredCoupons = filteredCoupons.filter((coupon) =>
        coupon.name?.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }

    if (filters?.isActive !== undefined) {
      filteredCoupons = filteredCoupons.filter(
        (coupon) => coupon.isActive === filters.isActive
      );
    }

    const total = filteredCoupons.length;
    const paginatedCoupons = filteredCoupons.slice(skip, skip + limit);

    return allCouponsResponseAdapter({
      message: "Cupones obtenidos exitosamente",
      count: total,
      coupons: paginatedCoupons,
    });
  }

  async getOne(couponId: number, token?: string): Promise<CouponResponse> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300));

    const coupon = mockCoupons.find((c) => c.couponId === couponId);

    if (!coupon) {
      throw new Error("Cupón no encontrado");
    }

    return getCouponResponseAdapter({
      message: "Cupón obtenido exitosamente",
      coupon,
    });
  }

  async create(
    couponData: Partial<ICoupon>,
    token?: string
  ): Promise<CouponResponse> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newCoupon: ICoupon = {
      couponId: mockCoupons.length + 1,
      code: couponData.code || "",
      name: couponData.name || "",
      description: couponData.description || "",
      planId: couponData.planId,
      maxRedemptions: couponData.maxRedemptions || 0,
      renewalCount: couponData.renewalCount || 0,
      branchIds: couponData.branchIds || [],
      isActive: couponData.isActive ?? true,
      redemptionsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      plan: {
        planId: couponData.planId || 1,
        name: "Wein card mensual",
        price: 29.99,
      },
      branches: [],
    };

    mockCoupons.push(newCoupon);

    return createCouponResponseAdapter({
      message: "Cupón creado exitosamente",
      coupon: newCoupon,
    });
  }

  async update(
    couponId: number,
    couponData: Partial<ICoupon>,
    token?: string
  ): Promise<CouponResponse> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800));

    const couponIndex = mockCoupons.findIndex((c) => c.couponId === couponId);

    if (couponIndex === -1) {
      throw new Error("Cupón no encontrado");
    }

    const updatedCoupon: ICoupon = {
      ...mockCoupons[couponIndex],
      ...couponData,
      updatedAt: new Date().toISOString(),
    };

    mockCoupons[couponIndex] = updatedCoupon;

    return updateCouponResponseAdapter({
      message: "Cupón actualizado exitosamente",
      coupon: updatedCoupon,
    });
  }

  async delete(couponId: number, token?: string): Promise<{ message: string }> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));

    const couponIndex = mockCoupons.findIndex((c) => c.couponId === couponId);

    if (couponIndex === -1) {
      throw new Error("Cupón no encontrado");
    }

    mockCoupons.splice(couponIndex, 1);

    return {
      message: "Cupón eliminado exitosamente",
    };
  }
}
