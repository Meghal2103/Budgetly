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
        const url = `${environment.baseUrl}${api.downloadAllTransactions}`;
        return this.http.get(url, { responseType: 'blob' });
    }

    downloadTransactions(transactionsRequestDTO: TransactionsRequestDTO): Observable<Blob> {
        const url = `${environment.baseUrl}${api.downloadTransactions}`;
        return this.http.post(url, transactionsRequestDTO, { responseType: 'blob' });
    }
}

