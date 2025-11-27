export interface IRedemption {
  redemptionId: number;
  value: number;
  savings: number;
  location?: string;
  redeemedAt: string;
  createdAt: string;
  branch?: {
    branchId: number;
    name: string;
    merchant?: {
      merchantId: number;
      name: string;
    };
  };
  user?: {
    userId: number;
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface RedemptionResponse {
  message: string;
  redemption: IRedemption;
}

export interface AllRedemptionsResponse {
  count: number;
  redemptions: IRedemption[];
}

export interface CreateRedemptionRequest {
  branchId: number;
  value: number;
  savings: number;
  location?: string;
}
