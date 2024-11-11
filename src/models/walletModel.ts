// src/models/walletModel.ts
export interface Wallet {
    id: number;
    opening_balance: string | null;
    closing_balance: string | null;
    user_id: number;
    credit_amount: string;
    debit_amount: string;
    description: string;
    transaction_id: string;
    transaction_type: string;
    transaction: Transaction;
    created_at: string;
    updated_at: string;
}

export interface AdminWallet {
    closing_balance: string | null;
    created_at: string;
    credit_amount: string;
    debit_amount: string;
    description: string;
    id: number;
    opening_balance: string | null;
    transaction_id: string;
    transaction_type: string;
    updated_at: string;
    user_id: number;
}

export interface Transaction {
    admin_bank_id: number | null; // Adjusted to allow null
    amount: string;
    created_at: string;
    description: string;
    fund_request_id: string;
    id: number;
    is_sub_account_request: number;
    is_wallet_refill: number;
    reject_remark: string | null;
    request_type: string;
    requester_user_id: number;
    sender_user_id: number;
    status: string;
    transaction_ref_no: number | null; // Adjusted to allow null
    updated_at: string;
}

export interface AgentWallet {
    agent_wallet_id: number;
    closing_balance: string;
    created_at: string;
    credit_amount: string;
    debit_amount: string;
    description: string;
    id: number;
    opening_balance: string;
    transaction_id: string;
    transaction_type: string;
    updated_at: string;
}

export interface WithdrawalReport {
    created_at: string;
    updated_at: string;
    id: number;
    withdrawal_id: string;
    amount: string;
    status: string;
    user_id: number;
    agent_id: null;
    expires_at: null | string;
    is_bank_withdrawal: number;
    remark: null | string;
    bank_details: null | BankDetails;
    agent_user: null | AgentUser;
    user: User;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    pacpay_user_id: string;
    user_type_id: number;
    full_name: string;
    user_type: string;
    is_sub_account: boolean;
    biller: Biller | null;
    business: Business | null;
}

export interface Business {
    id: number;
    business_name: string;
    company_tin_no: string;
    user_id: number;
    created_at: number;
    updated_at: string;
    business_type_id: number;
    merchant_category_id: number;
}

export interface Biller {
    id: number;
    created_at: string;
    updated_at: string;
    user_id: number;
    biller_name: number;
    biller_img_url: string;
    biller_fields: BillerFields;
    biller_category_id: number;
    is_active: number;
}

export interface BillerFields {
    fields: BillerField[]; // Use the BillerField interface for type safety
}

export interface BillerField {
    name: string; // Field name
    regex: string | null; // Regex can be a string or null
    check_regex: boolean; // Indicates whether to check the regex
}
export interface AgentUser {
    id: number;
    first_name: string;
    last_name: string;
    pacpay_user_id: string;
    user_type_id: number;
    laravel_through_key: number;
    full_name: string;
    user_type: string;
    is_sub_account: boolean;
}

export interface BankDetails {
    bsb: string;
    swift: string;
    bank_name: string;
    bank_account_no: string;
    bank_account_name: string;
    bank_reference_no: null | string;
}

export interface DepositReport {
    id: number;
    created_at: string;
    updated_at: string;
    agent_id: number;
    user_id: number;
    amount: string;
    deposit_id: string;
    commission_processed: number;
    agent_user: AgentUser;
    user: User;
}
