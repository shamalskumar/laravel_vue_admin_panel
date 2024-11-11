import type { User } from './userModel';

export interface BillPayment {
    amount: string;
    bill_payment_id: string;
    biller_id: number;
    created_at: string;
    id: number;
    updated_at: string;
    user_id: number;
    biller: Biller;
    biller_fields: Biller_Fields;
    primary_field: Primary_Field;
    user: User;
}

export interface Biller {
    biller_name: string;
    id: number;
}

export interface Biller_Fields {
    amount: Amount;
}

export interface Amount {
    name: string;
    value: string;
}

export interface Primary_Field {
    name: string;
    value: string;
}
