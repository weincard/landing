import type {
  AllGiftsResponse,
  GiftResponse,
} from "../interfaces/gifts.response.interface";

export const allGiftsResponseAdapter = (data: any): AllGiftsResponse => {
  return {
    message: data.message || "Regalos obtenidos exitosamente",
    count: data.count || 0,
    gifts: data.gifts || (Array.isArray(data) ? data : []),
  };
};

export const getGiftResponseAdapter = (data: any): GiftResponse => {
  return {
    message: data.message || "Regalo obtenido exitosamente",
    gift: data.gift || data,
  };
};

export const createGiftResponseAdapter = (data: any): GiftResponse => {
  return {
    message: data.message || "Regalo creado exitosamente",
    gift: data.gift || data,
  };
};

export const updateGiftResponseAdapter = (data: any): GiftResponse => {
  return {
    message: data.message || "Regalo actualizado exitosamente",
    gift: data.gift || data,
  };
};
