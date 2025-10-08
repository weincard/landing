import type {
  AllAlliesResponse,
  AllyResponse,
} from "../interfaces/ally.response.interface";

export const allyResponseAdapter = (response: any): AllyResponse => {
  return {
    id: response.ally?.idAlly,
    message: response.message || "",
    ally: response.ally
      ? {
          idAlly: response.ally.idAlly,
          name: response.ally.name,
          description: response.ally.description || "",
          address: response.ally.address || "",
          image: response.ally.image || "",
          isActive: response.ally.isActive || false,
          office: response.ally.office || "",
          redemptions: response.ally.redemptions || 0,
        }
      : undefined,
  };
};

export const allAlliesResponseAdapter = (response: {
  count: number;
  allies: any[];
}): AllAlliesResponse => {
  return {
    count: response.count,
    allies: response.allies.map((ally) => ({
      idAlly: ally.idAlly,
      name: ally.name,
      description: ally.description,
      location: ally.location,
      email: ally.email,
      phone: ally.phone,
      image: ally.image,
      isActive: ally.isActive,
    })),
  };
};
