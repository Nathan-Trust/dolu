/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axios-instance";

export interface ApiWrapper<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

export interface OverviewData {
  today_sales: number;
  active_staff_count: number;
  active_realtors_count: number;
  available_properties: number;
  total_expenses?: number;
  total_sold_properties?: number;
  pending_commissions?: number;
  pending_expense_approvals?: number;
  sales_trend: number[];
}

export class OverviewService {
  /**
   * Get overview data
   * GET /overview
   */
  static async getOverview(): Promise<ApiWrapper<OverviewData>> {
    const response =
      await axiosInstance.get<ApiWrapper<OverviewData>>("/overview");
    return response.data;
  }
}
