export interface BankingStatus {
  ship_id: string;
  year: number;
  cb_before: number; // The "raw" CB before any actions
  applied_or_banked: number; // Sum of actions taken this year
  cb_after: number; // The adjusted CB
  total_available_bank: number; // The ship's total bank account
}

export interface BankEntry {
  id: string;
  ship_id: string;
  year: number;
  amount_gco2eq: number;
  createdAt: string;
}

export interface ComplianceRecord {
  id: string;
  ship_id: string;
  year: number;
  cb_gco2eq: number;
}