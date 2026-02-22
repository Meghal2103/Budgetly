import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../models/api-response.model';
import { AddTransactionRequest, TransactionDTO, TransactionsDTO, TransactionsRequestDTO } from '../models/transaction/transaction.model';
import { api } from '../enums/api.enum';

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
                const errorMessage = apiError?.message || 'An error occurred while adding the transaction';
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    getTransactions(transactionsRequestDTO: TransactionsRequestDTO): Observable<APIResponse<TransactionsDTO>> {
        const url = `${environment.baseUrl}/${api.getTransaction}`;
        console.log('Fetching transactions with payload:', transactionsRequestDTO); // Debug log

        return this.http.post<APIResponse<TransactionsDTO>>(url, transactionsRequestDTO).pipe(
            catchError((errorResponse: HttpErrorResponse) => {
                const apiError: APIResponse<TransactionsDTO> = errorResponse.error;
                const errorMessage = apiError?.message || 'An error occurred while fetching transactions';
                return throwError(() => new Error(errorMessage));
            })
        );
    }
}

