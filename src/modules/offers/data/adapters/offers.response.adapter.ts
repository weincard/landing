import type {
  AllOffersResponse,
  OfferResponse,
} from "../interfaces/offers.response.interface";

export const allOffersResponseAdapter = (response: any): AllOffersResponse => {
  return {
    offers: response.offers || [],
    count: response.count || 0,
  };
};

export const createOfferResponseAdapter = (response: any): OfferResponse => {
  return {
    message: response.message,
    offer: response.offer,
  };
};

export const getOfferResponseAdapter = (response: any): OfferResponse => {
  return {
    offer: response.offer || response,
  };
};

export const updateOfferResponseAdapter = (response: any): OfferResponse => {
  return {
    message: response.message,
    offer: response.offer,
  };
};
