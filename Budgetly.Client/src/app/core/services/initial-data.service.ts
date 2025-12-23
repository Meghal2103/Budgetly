import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIResponse } from '../models/api-response.model';
import { TransactionType } from '../models/transaction/transaction-type.model';
import { CategoryOption } from '../models/transaction/category.model';

interface TransactionTypeAPI {
    transactionTypeID: number;
    transactionTypeName: string;
}

interface CategoryAPI {
    categoryId: number;
    categoryName: string;
}

@Injectable({
    providedIn: 'root'
})
export class InitialDataService {
    private http: HttpClient = inject(HttpClient);
    private transactionTypes: TransactionType[] = [];
    private categories: CategoryOption[] = [];
    private isTransactionTypesLoading: boolean = false;
    private isTransactionTypesLoaded: boolean = false;
    private isCategoriesLoading: boolean = false;
    private isCategoriesLoaded: boolean = false;

    /**
     * Load transaction types from API and cache them
     * Should be called once when app initializes
     */
    loadTransactionTypes(): Observable<TransactionType[]> {
        if (this.isTransactionTypesLoaded) {
            // Return cached data as observable
            return new Observable(observer => {
                observer.next(this.transactionTypes);
                observer.complete();
            });
        }

        if (this.isTransactionTypesLoading) {
            // If already loading, wait and return the cached result
            return new Observable(observer => {
                const checkInterval = setInterval(() => {
                    if (this.isTransactionTypesLoaded) {
                        clearInterval(checkInterval);
                        observer.next(this.transactionTypes);
                        observer.complete();
                    }
                }, 100);
            });
        }

        this.isTransactionTypesLoading = true;
        const url = `${environment.baseUrl}/api/Transaction/get-transaction-type`;

        return this.http.get<APIResponse<TransactionTypeAPI[]>>(url).pipe(
            map((response: APIResponse<TransactionTypeAPI[]>) => {
                if (response.success && response.data) {
                    // Map API response to client model
                    this.transactionTypes = response.data.map(apiType => ({
                        id: apiType.transactionTypeID,
                        name: apiType.transactionTypeName
                    }));
                    this.isTransactionTypesLoaded = true;
                    this.isTransactionTypesLoading = false;
                    return this.transactionTypes;
                }
                this.isTransactionTypesLoading = false;
                return [];
            }),
            catchError((errorResponse: HttpErrorResponse) => {
                this.isTransactionTypesLoading = false;
                const apiError: APIResponse<TransactionTypeAPI[]> = errorResponse.error;
                const errorMessage = apiError?.message || 'An error occurred while fetching transaction types';
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    /**
     * Get cached transaction types
     * Returns empty array if not loaded yet
     */
    getTransactionTypes(): TransactionType[] {
        return this.transactionTypes;
    }

    /**
     * Check if transaction types are loaded
     */
    areTransactionTypesLoaded(): boolean {
        return this.isTransactionTypesLoaded;
    }

    /**
     * Load categories from API and cache them
     * Should be called once when app initializes
     */
    loadCategories(): Observable<CategoryOption[]> {
        if (this.isCategoriesLoaded) {
            // Return cached data as observable
            return new Observable(observer => {
                observer.next(this.categories);
                observer.complete();
            });
        }

        if (this.isCategoriesLoading) {
            // If already loading, wait and return the cached result
            return new Observable(observer => {
                const checkInterval = setInterval(() => {
                    if (this.isCategoriesLoaded) {
                        clearInterval(checkInterval);
                        observer.next(this.categories);
                        observer.complete();
                    }
                }, 100);
            });
        }

        this.isCategoriesLoading = true;
        const url = `${environment.baseUrl}/api/Transaction/get-categories`;

        return this.http.get<APIResponse<CategoryAPI[]>>(url).pipe(
            map((response: APIResponse<CategoryAPI[]>) => {
                if (response.success && response.data) {
                    // Map API response to client model
                    this.categories = response.data.map(apiCategory => ({
                        id: apiCategory.categoryId,
                        name: apiCategory.categoryName
                    }));
                    this.isCategoriesLoaded = true;
                    this.isCategoriesLoading = false;
                    return this.categories;
                }
                this.isCategoriesLoading = false;
                return [];
            }),
            catchError((errorResponse: HttpErrorResponse) => {
                this.isCategoriesLoading = false;
                const apiError: APIResponse<CategoryAPI[]> = errorResponse.error;
                const errorMessage = apiError?.message || 'An error occurred while fetching categories';
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    /**
     * Get cached categories
     * Returns empty array if not loaded yet
     */
    getCategories(): CategoryOption[] {
        return this.categories;
    }

    /**
     * Check if categories are loaded
     */
    areCategoriesLoaded(): boolean {
        return this.isCategoriesLoaded;
    }
}

