import {
  AllAlliesResponse,
  AllyResponse,
} from "../interfaces/ally.response.interface";

export const allyResponseAdapter = (response: any): AllyResponse => ({
  message: response.message,
  ally: {
    idAlly: response.ally.id,
    name: response.ally.name,
    image: response.ally.image,
    address: response.ally.address,
    description: response.ally.description,
    isActive: response.ally.isActive,
    office: response.ally.office,
    redemptions: response.ally.redemptions,
  },
});

export const allAlliesResponseAdapter = (response: any): AllAlliesResponse => ({
  count: response.count || response.total,
  total: response.total || response.count,
  allies: Array.isArray(response)
    ? response.map((ally: any) => ({
        id: ally.allyId || ally.id,
        name: ally.name,
        image: ally.image,
        address: ally.address,
        description: ally.description,
        isActive: ally.isActive,
        office: ally.office,
        redemptions: ally.redemptions,
      }))
    : (response.breeds || []).map((ally: any) => ({
        id: ally.allyId || ally.id,
        name: ally.name,
        image: ally.image,
        address: ally.address,
        description: ally.description,
        isActive: ally.isActive,
        office: ally.office,
        redemptions: ally.redemptions,
      })),
});
