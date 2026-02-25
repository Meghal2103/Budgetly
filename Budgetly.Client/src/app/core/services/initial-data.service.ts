import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {Observable, catchError, throwError, map, retry, firstValueFrom} from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../models/api-response.model';
import { TransactionType } from '../models/transaction/transaction-type.model';
import { CategoryOption } from '../models/transaction/category.model';
import {api} from "../enums/api.enum";
import { SidebarService } from './sidebar.service';

@Injectable({
    providedIn: 'root'
})
export class InitialDataService {
    private http: HttpClient = inject(HttpClient);
    private sidebarService = inject(SidebarService);
    
    private _categories = signal<CategoryOption[]>([]);
    private _transactionTypes = signal<TransactionType[]>([]);
    readonly categories = this._categories.asReadonly();
    readonly transactionTypes = this._transactionTypes.asReadonly();
    
    private isTransactionTypesLoaded = signal(false);
    private isCategoriesLoaded = signal(false);
    readonly areTransactionTypesLoaded = this.isTransactionTypesLoaded.asReadonly();
    readonly areCategoriesLoaded = this.isCategoriesLoaded.asReadonly();


    initializeAppData(): void {
        this.sidebarService.appLoader = true;
        this.loadCategories().subscribe({
            error: (err) => console.error('Categories failed:', err)
        });
        this.loadTransactionTypes().subscribe({
            error: (err) => console.error('Transaction types failed:', err)
        });
    }

    loadTransactionTypes(): Observable<TransactionType[]> {
        const url = `${environment.baseUrl}/${api.getTransactionType}`;

        return this.http.get<APIResponse<TransactionType[]>>(url).pipe(
            map((response: APIResponse<TransactionType[]>) => {
                if (!response.success || !response.data) {
                    throw new Error(response.message || 'Invalid transaction types response');
                }

                this._transactionTypes.set(response.data.map(apiType => ({
                    transactionTypeID: apiType.transactionTypeID,
                    transactionTypeName: apiType.transactionTypeName
                })));
                this.isTransactionTypesLoaded.set(true);
                this.sidebarService.appLoader = !this.isTransactionTypesLoaded() && !this.areCategoriesLoaded();
                return this.transactionTypes();
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

    loadCategories(): Observable<CategoryOption[]> {
        const url = `${environment.baseUrl}/${api.getCategories}`;

        return this.http.get<APIResponse<CategoryOption[]>>(url).pipe(
            map((response: APIResponse<CategoryOption[]>) => {
                if (!response.success || !response.data) {
                    throw new Error(response.message || 'Invalid categories response');
                }

                this._categories.set(response.data.map(apiCategory => ({
                    categoryId: apiCategory.categoryId,
                    categoryName: apiCategory.categoryName
                })));
                this.isCategoriesLoaded.set(true);
                this.sidebarService.appLoader = !this.isTransactionTypesLoaded() && !this.areCategoriesLoaded();
                return this.categories();
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
}

