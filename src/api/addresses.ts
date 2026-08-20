import { honoClient } from "./honoClient";

// Saved delivery addresses (auth required, own-user scoped).
export interface UserAddress {
  userAddressId: number;
  label: string | null;
  address: string;
  details: string | null;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export interface UserAddressPayload {
  address: string;
  latitude: number;
  longitude: number;
  label?: string | null;
  details?: string | null;
  isDefault?: boolean;
}

export const getMyAddresses = () =>
  honoClient.get<{ addresses: UserAddress[] }>("/users/addresses");

export const createAddress = (data: UserAddressPayload) =>
  honoClient.post<{ address: UserAddress }>("/users/addresses/create", data);

export const updateAddress = (
  userAddressId: number,
  data: Partial<UserAddressPayload>,
) =>
  honoClient.patch<{ address: UserAddress }>(
    `/users/addresses/update/${userAddressId}`,
    data,
  );

export const deleteAddress = (userAddressId: number) =>
  honoClient.delete(`/users/addresses/delete/${userAddressId}`);
