export interface VoucherDetails {
    created_at: string;
    id: number;
    promotion_model: string;
    promotion_name: string;
    promotion_transaction_type: string;
    updated_at: string;
    voucher_id: number;
    voucher: Voucher;
}

export interface Voucher {
    code: string;
    created_at: string;
    id: number;
    expires_at: string;
    model_id: number;
    model_type: string;
    updated_at: string;
    data: Data;
}

export interface Data {
    cashback_amount: string;
    cashback_type: string;
    expiry_date: string;
    is_active: boolean;
    min_txn_amount: string;
    promotion_name: string;
    reward_upto_max_amount: string;
    user_id: string;
    voucher_description: string;
    voucher_for: string;
    voucher_type: string;
}

export interface UserVoucherDetails {
    user_transaction: UserCashbackTransaction;
    wallet_transaction_id: string;
}

export interface UserCashbackTransaction {
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
    user_id: number;
    credited_user: CreditedUser;
    debited_user: DebitedUser;
}

export interface CreditedUser {
    username: string;
    user_type: string;
    pacpay_user_id: string;
    mobile_no: string;
    email: string;
}
export interface DebitedUser {
    username: string;
    user_type: string;
    pacpay_user_id: string;
    mobile_no: string;
    email: string;
}
