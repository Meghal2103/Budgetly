import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {Observable, catchError, throwError, map, retry, firstValueFrom} from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../models/api-response.model';
import { TransactionType } from '../models/transaction/transaction-type.model';
import { CategoryOption } from '../models/transaction/category.model';
import {api} from "../enums/api.enum";

@Injectable({
    providedIn: 'root'
})
export class InitialDataService {
    private http: HttpClient = inject(HttpClient);
    private transactionTypes: TransactionType[] = [];
    private categories: CategoryOption[] = [];
    private isTransactionTypesLoaded: boolean = false;
    private isCategoriesLoaded: boolean = false;

    initializeAppData(): Promise<void> {
        return Promise.all([
            firstValueFrom(this.loadCategories()),
            firstValueFrom(this.loadTransactionTypes())
        ]).then(() => {});
    }

    loadTransactionTypes(): Observable<TransactionType[]> {
        const url = `${environment.baseUrl}/${api.getTransactionType}`;

        return this.http.get<APIResponse<TransactionType[]>>(url).pipe(
            map((response: APIResponse<TransactionType[]>) => {
                if (!response.success || !response.data) {
                    throw new Error(response.message || 'Invalid transaction types response');
                }

                this.transactionTypes = response.data.map(apiType => ({
                    transactionTypeID: apiType.transactionTypeID,
                    transactionTypeName: apiType.transactionTypeName
                }));
                this.isTransactionTypesLoaded = true;
                return this.transactionTypes;
            }),
            retry({
                count: 3,
                delay: 1000
            }),
            catchError((errorResponse: HttpErrorResponse) => {
                const apiError: APIResponse<TransactionType[]> = errorResponse.error;
                const errorMessage = apiError?.message || 'An error occurred while fetching transaction types';
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    getTransactionTypes(): TransactionType[] {
        return this.transactionTypes;
    }

    get areTransactionTypesLoaded(): boolean {
        return this.isTransactionTypesLoaded;
    }

    loadCategories(): Observable<CategoryOption[]> {
        const url = `${environment.baseUrl}/${api.getCategories}`;

        return this.http.get<APIResponse<CategoryOption[]>>(url).pipe(
            map((response: APIResponse<CategoryOption[]>) => {
                if (!response.success || !response.data) {
                    throw new Error(response.message || 'Invalid categories response');
                }

                this.categories = response.data.map(apiCategory => ({
                    categoryId: apiCategory.categoryId,
                    categoryName: apiCategory.categoryName
                }));
                this.isCategoriesLoaded = true;
                return this.categories;
            }),
            retry({
                count: 3,
                delay: 1000
            }),
            catchError((errorResponse: HttpErrorResponse) => {
                const apiError: APIResponse<CategoryOption[]> = errorResponse.error;
                const errorMessage = apiError?.message || 'An error occurred while fetching categories';
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    getCategories(): CategoryOption[] {
        return this.categories;
    }

    get areCategoriesLoaded(): boolean {
        return this.isCategoriesLoaded;
    }
}

