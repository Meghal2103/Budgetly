export interface TransactionDTO {
    transactionId: number;
    title: string;
    userId: number;
    categoryId: number;
    transactionTypeID: number;
    dateTime: string;
    amount: number;
    notes: string;
}

export interface AddTransactionRequest {
    title: string;
    userId: number;
    categoryId: number;
    transactionTypeID: number;
    dateTime: string;
    amount: number;
    notes: string;
}
