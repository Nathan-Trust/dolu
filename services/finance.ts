import axiosInstance from "./axios-instance";

export interface ApiWrapper<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

/* ------------------------------------------------------------------ */
/*  Salary Payment Types                                               */
/* ------------------------------------------------------------------ */

export interface SalaryPayment {
  id: string;
  staff_member_id: string;
  staff_name: string;
  month: string;
  base_salary: number;
  bonuses: number;
  deductions: number;
  net_salary: number;
  status: string;
  payment_date?: string;
  notes?: string;
  created_at: string;
}

export interface AddSalaryPaymentPayload {
  staff_member_id: string;
  month: string;
  base_salary: number;
  bonuses?: number;
  deductions?: number;
  notes?: string;
}

export type AddSalaryPaymentResponse = ApiWrapper<SalaryPayment>;

/* ------------------------------------------------------------------ */
/*  Commission Types                                                   */
/* ------------------------------------------------------------------ */

export interface CommissionRate {
  id: number;
  role: string;
  rate: number;
}

export interface UpdateCommissionRatesPayload {
  rates: Array<{
    role: string;
    rate: number;
  }>;
}

export type CommissionRatesResponse = ApiWrapper<CommissionRate[]>;
export type UpdateCommissionRatesResponse = ApiWrapper<CommissionRate[]>;

/* ------------------------------------------------------------------ */
/*  Procurement Types                                                  */
/* ------------------------------------------------------------------ */

export interface Procurement {
  id: string;
  vendor: string;
  item: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  order_date: string;
  expected_delivery: string;
  status: string;
  notes?: string;
  created_at: string;
}

export interface AddProcurementPayload {
  vendor: string;
  item: string;
  quantity: number;
  unit_price: number;
  order_date: string;
  expected_delivery: string;
  notes?: string;
}

export type AddProcurementResponse = ApiWrapper<Procurement>;

/* ------------------------------------------------------------------ */
/*  Finance Service                                                    */
/* ------------------------------------------------------------------ */

export class FinanceService {
  /* ── Salary Payments ── */
  public static async addSalaryPayment(
    payload: AddSalaryPaymentPayload,
  ): Promise<AddSalaryPaymentResponse> {
    try {
      const response = await axiosInstance.post<AddSalaryPaymentResponse>(
        "/finance/salary-payments",
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error adding salary payment:", error);
      throw error;
    }
  }

  /* ── Commission Rates ── */
  public static async getCommissionRates(): Promise<CommissionRatesResponse> {
    try {
      const response = await axiosInstance.get<CommissionRatesResponse>(
        "/finance/commission-rates",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching commission rates:", error);
      throw error;
    }
  }

  public static async updateCommissionRates(
    payload: UpdateCommissionRatesPayload,
  ): Promise<UpdateCommissionRatesResponse> {
    try {
      const response = await axiosInstance.put<UpdateCommissionRatesResponse>(
        "/finance/commission-rates",
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating commission rates:", error);
      throw error;
    }
  }

  /* ── Procurements ── */
  public static async addProcurement(
    payload: AddProcurementPayload,
  ): Promise<AddProcurementResponse> {
    try {
      const response = await axiosInstance.post<AddProcurementResponse>(
        "/finance/procurements",
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error adding procurement:", error);
      throw error;
    }
  }
}
