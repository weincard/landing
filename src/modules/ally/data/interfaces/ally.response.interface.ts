import { IAlly } from "@/data/interfaces";

export interface AllAlliesResponse {
  count?: number;
  total?: number; // Some APIs might return total instead of count
  allies: IAlly[];
}

export interface AllyResponse {
  id?: string | number;
  message: string;
  ally?: IAlly;
}
