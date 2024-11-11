// src/models/userModel.ts
export interface PaymentCharges {
    max_charge: number;
    min_charge: number;
    charge_type: string;
    fixed_charge: string;
    percentage_charge: number;
}

export interface PaymentChargePackage {
    id: number;
    is_default: number;
    package_name: string;
    package_type: string;
    payment_charges: PaymentCharges;
    created_at: string;
    updated_at: string;
    pivot: Pivot;
}

export interface Pivot {
    user_id: number;
    payment_charge_package_id: number;
}

export interface Wallet {
    balance: string;
    blocked_balance: string;
    wallet_limit: string;
}

export interface City {
    id: number;
    city_name: string;
    country_id: number;
}

export interface Country {
    id: number;
    country_name: string;
}

export interface Income {
    id: number;
    source: string;
}

export interface MerchantCategory {
    id: number;
    category_name: string;
}

export interface BusinessType {
    id: number;
    business_type: string;
}

export interface User {
    id: number;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    full_name: string;
    email: string;
    username: string;
    mobile_country_code: string;
    mobile_no: string;
    date_of_birth: string;
    gender: string;
    address: string;
    city: City;
    city_id: number;
    is_kyc_verified: boolean;
    kyc_document_id: string | null;
    kyc_document_type: string;
    kyc_document_url: string;
    company_reg_img_url: string;
    company_tin_img_url: string;
    kyc_document_expiry_date: string | null;
    kyc_verified_at: string;
    kyc_verified_by: number;
    wallet: Wallet;
    user_type_id: number;
    user_type: string;
    account_blocked: number;
    has_sub_accounts: number;
    is_sub_account: boolean;
    is_verified: number;
    is_registration_completed: number;
    payment_link: string;
    qr_code_info: string;
    profile_pic_img_url: string;
    selfie_img_url: string;
    signature_url: string | null;
    pacpay_user_id: string;
    payment_charge_package: PaymentChargePackage[];
    created_at: string;
    updated_at: string;
    personal_tin_no: string;
    source_of_income_id: number;
    transfer_limit_scheme_id: number;
    user_permission_id: number;
    master_account_user_id: number;
    commission_scheme_id: number;
    business: Business;
    agent: Agent;
    master_account: MasterAccount;
    additional_info: AdditionalInfo;
    biller: Biller;
}

export interface Biller {
    id: number;
    created_at: string;
    updated_at: string;
    user_id: number;
    biller_name: string;
    biller_img_url: string;
    biller_category_id: number;
    is_active: number;
}

export interface BillerCategory {
    id: number;
    created_at: string;
    updated_at: string;
    category_name: string;
}

export interface AdditionalInfo {
    created_by_user_id: number;
    signup_by: string;
    force_password_change: boolean;
}

export interface TransferLimitScheme {
    id: number;
    eligible_limit_per_month: string;
    eligible_limit_per_day: string;
    name: string;
    created_at: string;
}

export interface Business {
    id: number;
    business_name: string;
    company_tin_no: string;
    user_id: number;
    business_type_id: number;
    merchant_category_id: number;
    created_at: string;
    updated_at: string;
}

export interface SubAccount {
    email: string;
    first_name: string;
    full_name: string;
    id: number;
    kyc_document_expiry_date: string;
    kyc_document_id: number;
    kyc_document_type: string;
    kyc_document_url: string;
    last_name: string;
    master_account: MasterAccount;
    middle_name: string;
    mobile_country_code: string;
    mobile_no: string;
    pacpay_user_id: string;
    profile_pic_img_url: string;
    signature_url: string;
    user_type_id: number;
    username: string;
}

export interface MasterAccount {
    id: number;
    profile_pic_img_url: string;
    user_type_id: number;
    full_name: string;
    user_type: string;
    is_sub_account: boolean;
    business: Business;
}

export interface Agent {
    id: number;
    user_id: number;
    agent_commission_scheme_id: number;
    created_at: string;
    updated_at: string;
    agent_wallets: AgentWallet[];
}

export interface AgentWallet {
    id: number;
    created_at: string;
    updated_at: string;
    wallet_type: string;
    agent_id: number;
    balance: string;
    blocked_balance: string;
    wallet_limit: string;
}
