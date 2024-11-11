export interface TicketType {
    created_at: string;
    id: number;
    transaction_type: string;
    type_description: string;
    updated_at: string;
}

export interface Complaints {
    admin_resolution_description: string | null;
    complaint_status: string;
    complaint_type: TicketType | null;
    complaint_type_id: number;
    created_at: string;
    id: number;
    resolved_at: string | null;
    resolved_by: number | null;
    transaction_id: string | null;
    updated_at: string;
    user_complaint_description: string;
    user_id: number;
    wallet_transaction: WalletTransaction | null;
}

export interface WalletTransaction {
    closing_balance: string;
    created_at: string;
    credit_amount: string;
    debit_amount: string;
    description: string;
    id: number;
    opening_balance: string;
    transaction: Transaction;
    transaction_id: string;
    transaction_type: string;
    updated_at: string;
    user_id: number;
}

export interface Transaction {
    admin_bank_id: number | null;
    amount: string;
    created_at: string;
    description: string;
    fund_request_id: string;
    id: number;
    is_sub_account_request: boolean;
    is_wallet_refill: boolean;
    reject_remark: string | null;
    request_type: string;
    requester_user_id: number;
    sender_user_id: number;
    status: string;
    transaction_ref_no: string | null;
    updated_at: string;
}

export interface Chat {
    complaint_id: number;
    created_at: string;
    id: number;
    amount: string;
    message: string;
    message_from_user_id: number;
    message_to_user_id: number;
    message_type: string;
    updated_at: string;
}
