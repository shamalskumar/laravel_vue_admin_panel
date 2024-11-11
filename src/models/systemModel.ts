import type { User } from './userModel';
import type { Wallet } from './walletModel';

// src/models/userModel.ts
export interface AppGrid {
    app_grid_for: AppGridFor;
    created_at: string;
    grid_for: string;
    grid_no: number;
    id: number;
    label: string;
    logo_url: string;
    redirect_to: string;
    type: string;
    unique_id: number;
    updated_at: string;
}

export interface AppGridFor {
    category_name: string;
    created_at: string;
    id: number;
    updated_at: string;
}

export interface UserActivity {
    action_user_full_name: string;
    action_user_id: number;
    created_at: string;
    data: Data;
    event: string;
    id: number;
    remark: string;
    updated_at: string;
    user: User;
}

export interface Data {
    ip: string;
}

export interface PaymentCharges {
    max_charge: number;
    min_charge: number;
    charge_type: string;
    fixed_charge: number;
    percentage_charge: number;
}

export interface PaymentChargePackage {
    created_at: string;
    id: number;
    is_default: number;
    package_name: string;
    package_type: string;
    updated_at: string;
    charges: Charges;
}

export interface Charges {
    payment_charges: PaymentCharges;
}

export interface SystemSettings {
    agent_deposit_commission: string;
    biller_transaction: number;
    daily_withdrawal_limit: string;
    deposit: number;
    fund_request: number;
    min_withdrawal_limit: string;
    monthly_customer_deposit_limit: string;
    monthly_merchant_deposit_limit: string;
    withdrawal: number;
    withdrawal_charges: WithDrawalCharge;
    withdrawal_commission_tiers: WithdrawalCommissionTiers;
}

export interface WithDrawalCharge {
    agent_withdrawal_charges: AgentWithdrawalCharges;
    bank_withdrawal_charges: BankWithdrawalCharges;
}

export interface AgentWithdrawalCharges {
    max_charge: string;
    min_charge: string;
    percentage_charge: string;
}

export interface BankWithdrawalCharges {
    max_charge: string;
    min_charge: string;
    percentage_charge: string;
}

export interface WithdrawalCommissionTiers {
    withdrawal_ranges: WithdrawalRanges[];
}

export interface WithdrawalRanges {
    commission: string;
    max_range: string;
    min_range: string;
}

export interface Notifications {
    body: string;
    created_at: string;
    entity: string;
    entity_event: string;
    entity_unique_id: string;
    id: number;
    title: string;
    updated_at: string;
    user: User;
    user_id: number;
    wallet_transaction: Wallet;
}

export interface FAQ {
    questions: Question[];
}

export interface Question {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    faqs: FaqDetail[];
}

export interface FaqDetail {
    id: number;
    question: string;
    slug: string;
    answer: string;
    total_read: number;
    helpful_yes: number;
    helpful_no: number;
    category_id: number;
    list_order: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Categories {
    category: [];
}

export interface Banks {
    bank_name: string;
    bsb: string;
    created_at: string;
    deleted_at: string;
    id: number;
    swift: string;
    updated_at: string;
}

export interface BusinessMetrics {
    annual_earning_amount: string;
    deposits_today_amount: number;
    monthly_earning_amount: string;
    pending_fund_request_count: number;
    pending_kyc_verification_count: number;
    users_count: UserCount;
    withdrawals_today_amount: WithdrawalsTodayAmount;
}

export interface UserCount {
    agent_count: number;
    customer_count: number;
    merchant_count: number;
}

export interface WithdrawalsTodayAmount {
    agent_withdrawal: number;
    bank_withdrawal: number;
}
