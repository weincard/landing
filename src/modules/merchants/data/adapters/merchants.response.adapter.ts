import type {
  AllMerchantsResponse,
  MerchantResponse,
} from "../interfaces/merchants.response.interface";

export const createMerchantResponseAdapter = (data: any): MerchantResponse => {
  return {
    message: data.message || "Merchant creado exitosamente",
    merchant: {
      merchantId: data.merchant?.merchantId,
      name: data.merchant?.name,
      description: data.merchant?.description,
      logoUrl: data.merchant?.logoUrl,
      country: data.merchant?.country,
      state: data.merchant?.state,
      founder: data.merchant?.founder,
      createdAt: data.merchant?.createdAt
        ? new Date(data.merchant.createdAt)
        : undefined,
      updatedAt: data.merchant?.updatedAt
        ? new Date(data.merchant.updatedAt)
        : undefined,
      merchantUsers: data.merchant?.merchantUsers,
    },
  };
};

export const updateMerchantResponseAdapter = (data: any): MerchantResponse => {
  return {
    message: data.message || "Merchant actualizado exitosamente",
    merchant: {
      merchantId: data.merchant?.merchantId,
      name: data.merchant?.name,
      description: data.merchant?.description,
      logoUrl: data.merchant?.logoUrl,
      country: data.merchant?.country,
      state: data.merchant?.state,
      founder: data.merchant?.founder,
      createdAt: data.merchant?.createdAt
        ? new Date(data.merchant.createdAt)
        : undefined,
      updatedAt: data.merchant?.updatedAt
        ? new Date(data.merchant.updatedAt)
        : undefined,
    },
  };
};

export const allMerchantsResponseAdapter = (
  data: any
): AllMerchantsResponse => {
  return {
    merchants:
      data.merchants?.map((merchant: any) => ({
        merchantId: merchant.merchantId,
        name: merchant.name,
        description: merchant.description,
        logoUrl: merchant.logoUrl,
        country: merchant.country,
        state: merchant.state,
        founder: merchant.founder,
        createdAt: merchant.createdAt
          ? new Date(merchant.createdAt)
          : undefined,
        updatedAt: merchant.updatedAt
          ? new Date(merchant.updatedAt)
          : undefined,
        merchantUsers: merchant.merchantUsers,
      })) || [],
    count: data.count || 0,
  };
};

export const getMerchantResponseAdapter = (data: any): MerchantResponse => {
  return {
    message: "Merchant obtenido exitosamente",
    merchant: {
      merchantId: data.merchant?.merchantId,
      name: data.merchant?.name,
      description: data.merchant?.description,
      logoUrl: data.merchant?.logoUrl,
      country: data.merchant?.country,
      state: data.merchant?.state,
      founder: data.merchant?.founder,
      createdAt: data.merchant?.createdAt
        ? new Date(data.merchant.createdAt)
        : undefined,
      updatedAt: data.merchant?.updatedAt
        ? new Date(data.merchant.updatedAt)
        : undefined,
      merchantUsers: data.merchant?.merchantUsers,
    },
  };
};
