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

export interface IGeneratedRedemptionCode {
  code: string;
  branchName: string;
  userName: string;
  identification: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedRedemptionsResponse {
  count: number;
  redemptionCodes: IGeneratedRedemptionCode[];
}

export interface IUsedRedemptionCode {
  branchName: string;
  userName: string;
  identification: string | null;
  totalPaid: number;
  totalDiscount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UsedRedemptionsResponse {
  count: number;
  redemptionCodes: IUsedRedemptionCode[];
}
