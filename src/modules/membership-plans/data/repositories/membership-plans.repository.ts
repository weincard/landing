import { injectable } from "inversify";
import { apiUrls } from "@/config/protocols/http/api_urls";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

@injectable()
export class MembershipPlansRepository {
  /**
   * Get all membership plans
   */
  async getAll(token: string): Promise<any> {
    const response = await fetch(
      `${API_URL}${apiUrls.membershipPlans.getAll}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Error al obtener los planes de membresía"
      );
    }

    return response.json();
  }

  /**
   * Get one membership plan by ID
   */
  async getOne(membershipPlanId: number, token: string): Promise<any> {
    const response = await fetch(
      `${API_URL}${apiUrls.membershipPlans.getOne}/${membershipPlanId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener el plan de membresía");
    }

    return response.json();
  }
}
