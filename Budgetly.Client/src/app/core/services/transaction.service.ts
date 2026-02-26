import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../models/api-response.model';
import { AddTransactionRequest, Transaction, TransactionDTO, TransactionsDTO, TransactionsRequestDTO } from '../models/transaction/transaction.model';
import { api } from '../enums/api.enum';
import { CategoryOption } from '../models/transaction/category.model';
import { TransactionType } from '../models/transaction/transaction-type.model';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private http: HttpClient = inject(HttpClient);

    addTransaction(transaction: AddTransactionRequest): Observable<APIResponse<TransactionDTO>> {
        const url = `${environment.baseUrl}/${api.addTransaction}`;

        return this.http.post<APIResponse<TransactionDTO>>(url, transaction).pipe(
            catchError((errorResponse: HttpErrorResponse) => {
                const apiError: APIResponse<TransactionDTO> = errorResponse.error;
                return throwError(() => new Error(apiError.message));
            })
        );
    }

    getTransactions(transactionsRequestDTO: TransactionsRequestDTO): Observable<APIResponse<TransactionsDTO>> {
        const url = `${environment.baseUrl}/${api.getTransaction}`;

        return this.http.post<APIResponse<TransactionsDTO>>(url, transactionsRequestDTO).pipe(
            catchError((errorResponse: HttpErrorResponse) => {
                const apiError: APIResponse<TransactionsDTO> = errorResponse.error;
                return throwError(() => new Error(apiError.message));
            })
        );
    }

    downloadAllTransactions(): Observable<Blob> {
        const url = `${environment.baseUrl}/${api.downloadAllTransactions}`;
        return this.http.get(url, { responseType: 'blob' });
    }

    downloadTransactions(transactionsRequestDTO: TransactionsRequestDTO): Observable<Blob> {
        const url = `${environment.baseUrl}/${api.downloadTransactions}`;
        return this.http.post(url, transactionsRequestDTO, { responseType: 'blob' });
    }

    getTransactionsDetails(transactionsId: number): Observable<APIResponse<TransactionDTO>> {
        const url = `${environment.baseUrl}/${api.getTransactionDetails}/${transactionsId}`;

        return this.http.get<APIResponse<TransactionDTO>>(url).pipe(
            catchError((errorResponse: HttpErrorResponse) => {
                const apiError: APIResponse<TransactionDTO> = errorResponse.error;
                return throwError(() => new Error(apiError.message));
            })
        );
    }

    public mapTransactions(transactions: TransactionDTO[], categories: CategoryOption[], transactionTypes: TransactionType[]): Transaction[] {
        return transactions.map(t => this.mapTransaction(t, categories, transactionTypes));
    }

    public mapTransaction(transactions: TransactionDTO, categories: CategoryOption[], transactionTypes: TransactionType[]): Transaction{
        const category = categories.find(c => c.categoryId === transactions.categoryId);
        const transactionType = transactionTypes.find(tt => tt.transactionTypeId === transactions.transactionTypeId);

        return {
            id: transactions.transactionId,
            title: transactions.title,
            amount: transactions.amount,
            category: category?.categoryName || 'Unknown',
            transactionType: transactionType?.transactionTypeName || 'Unknown',
            date: new Date(transactions.dateTime),
            notes: transactions.notes || undefined
        };
    }
}

