import type { IBranch } from "@/data/interfaces/merchant.interface";

export interface BranchResponse {
  message: string;
  branch: IBranch;
}

export interface AllBranchesResponse {
  branches: IBranch[];
  count: number;
}
