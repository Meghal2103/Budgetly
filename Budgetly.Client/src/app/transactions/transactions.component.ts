import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../core/services/transaction.service';
import { InitialDataService } from '../core/services/initial-data.service';
import { TransactionDTO, Transaction, TransactionSearchDTO, TransactionsDTO } from '../core/models/transaction/transaction.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CategoryOption } from '../core/models/transaction/category.model';
import { TransactionType } from '../core/models/transaction/transaction-type.model';
import { PAGE_CONFIG } from '../core/config/page.config';
import { APIResponse } from '../core/models/api-response.model';
import { last } from 'rxjs';

@Component({
    selector: 'app-transactions',
    imports: [ReactiveFormsModule],
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
    private transactionService = inject(TransactionService);
    private initialDataService = inject(InitialDataService);
    private router = inject(Router);
    private formBuilder = inject(FormBuilder);
    pageSizeArray = PAGE_CONFIG.PAGE_SIZES;
    analysisTypeId: number | null = null;

    totalCount = 1// Placeholder, should be set from API response

    // Transaction data
    allTransactions: Transaction[] = [];
    filteredTransactions: Transaction[] = [];
    isLoading = signal(true);
    errorMessage: string = '';

    categories: CategoryOption[] = this.initialDataService.getCategories();
    transactionTypes: TransactionType[] = this.initialDataService.getTransactionTypes();
    searchForm: FormGroup = this.formBuilder.group({
        searchText: [''],
        categoryId: [0],
        transactionTypeId: [0],
        startDate: [''],
        endDate: ['']
    });
    paginationForm: FormGroup = this.formBuilder.group({
        pageSize: [PAGE_CONFIG.DEFAULT_PAGE_SIZE],
        pageNumber: [1]
    });

    transactionSearchDTO: TransactionSearchDTO = {
        searchText: '',
        categoryId: null,
        transactionTypeID: null,
        startDate: null,
        endDate: null,
        pageSize: null,
        pageNumber: null
    };

    ngOnInit(): void {
        this.searchForm.valueChanges.subscribe(() => this.onFiltersChange());
        this.paginationForm.valueChanges.subscribe(() => this.onFiltersChange());
        this.loadTransactions();
    }

    private loadTransactions(): void {
        this.errorMessage = '';

        this.transactionService.getTransactions().subscribe({
            next: (response: APIResponse<TransactionsDTO>) => {
                if (response.success && response.data) {
                    this.allTransactions = this.mapTransactions(response.data.transactions);
                    this.totalCount = response.data.totalCount;
                    this.paginationForm.get('pageNumber')?.setValue(response.data.currentPage, { emitEvent: false });
                    this.paginationForm.get('pageSize')?.setValue(response.data.pageSize, { emitEvent: false });
                } else {
                    this.errorMessage = response.message || 'Failed to load transactions';
                }
                this.isLoading.set(false);
            },
            error: (error) => {
                this.errorMessage = error.message || 'An error occurred while loading transactions';
                this.isLoading.set(false);
            }
        });
    }

    private mapTransactions(transactions: TransactionDTO[]): Transaction[] {
        return transactions.map(t => {
            const category = this.categories.find(c => c.categoryId === t.categoryId);
            const transactionType = this.transactionTypes.find(tt => tt.transactionTypeID === t.transactionTypeID);

            return {
                id: t.transactionId,
                title: (t as any).title || 'Untitled Transaction',
                amount: t.amount,
                category: category?.categoryName || 'Unknown',
                transactionType: transactionType?.transactionTypeName || 'Unknown',
                date: new Date(t.dateTime),
                notes: t.notes || undefined
            };
        });
    }

    onFiltersChange(): void {
        const formValue = this.searchForm.getRawValue();
        const paginationValue = this.paginationForm.getRawValue();
        this.transactionSearchDTO = {
            searchText: formValue.searchText.trim(),
            categoryId: formValue.categoryId,
            transactionTypeID: formValue.transactionTypeId,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            pageSize: paginationValue.pageSize,
            pageNumber: paginationValue.pageNumber
        };
    }

    clearFilters(): void {
        this.searchForm.setValue({
            searchText: '',
            categoryId: 0,
            transactionTypeId: 0,
            startDate: '',
            endDate: ''
        });
    }

    addTransaction(): void {
        this.router.navigate(['/transactions/add-transaction']);
    }

    viewTransactionDetails(id: number): void {
        this.router.navigate(['/transactions/details', id]);
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatDate(date: Date): string {
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(date);
    }

    formatDateTime(date: Date): string {
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    getLastPage(): number {
        const pageSize = this.paginationForm.get('pageSize')?.value ?? PAGE_CONFIG.DEFAULT_PAGE_SIZE;
        return Math.max(1, Math.ceil(this.totalCount / pageSize));
    }

    getPageNumbers(): number[] {
        const lastPage = this.getLastPage();
        return Array.from({ length: lastPage }, (_, index) => index + 1);
    }
}
