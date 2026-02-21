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

export interface Transaction {
    id: number;
    title: string;
    amount: number;
    category: string;
    transactionType: string;
    date: Date;
    notes?: string;
}

export interface TransactionSearchDTO {
    searchText: string;
    categoryId: number | null;
    transactionTypeID: number | null;
    startDate: Date | null;
    endDate: Date | null;
    pageSize: number | null;
    pageNumber: number | null;
}

export interface TransactionsDTO {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    transactions: TransactionDTO[];
}