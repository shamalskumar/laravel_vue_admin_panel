export interface Fund_Request {
    admin_bank_detail: Admin_Bank | null;
    admin_bank_id: number;
    amount: string;
    created_at: string;
    updated_at: string;
    description: string;
    fund_request_id: string;
    id: number;
    is_sub_account_request: number;
    is_wallet_refill: number;
    reject_remark: string | null;
    request_type: string;
    requester_user: Requester;
    sender_user: Sender;
    requester_user_id: number;
    sender_user_id: number;
    status: string;
    transaction_ref_no: null | string;
}

export interface Requester {
    first_name: string;
    last_name: string;
    full_name: string;
    id: number;
    is_sub_account: boolean;
    pacpay_user_id: string;
    profile_pic_img_url: string;
    user_type: string;
    user_type_id: number;
    username: string;
}

export interface Sender {
    first_name: string;
    last_name: string;
    full_name: string;
    id: number;
    is_sub_account: boolean;
    pacpay_user_id: string;
    profile_pic_img_url: string;
    user_type: string;
    user_type_id: number;
    username: string;
}

export interface Admin_Bank {
    id: string;
    bank_name: string;
    account_no: string;
    swift: string;
    bsb: string;
}
