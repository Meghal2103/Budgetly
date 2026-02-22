import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../core/services/transaction.service';
import { InitialDataService } from '../core/services/initial-data.service';
import { TransactionDTO, Transaction, TransactionsRequestDTO, TransactionsDTO } from '../core/models/transaction/transaction.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CategoryOption } from '../core/models/transaction/category.model';
import { TransactionType } from '../core/models/transaction/transaction-type.model';
import { PAGE_CONFIG } from '../core/config/page.config';
import { APIResponse } from '../core/models/api-response.model';

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

    transactionsRequestDTO: TransactionsRequestDTO = {
        searchText: '',
        categoryId: null,
        transactionTypeID: null,
        startDate: null,
        endDate: null,
        pageSize: PAGE_CONFIG.DEFAULT_PAGE_SIZE,
        pageNumber: 1
    };

    ngOnInit(): void {
        this.searchForm.valueChanges.subscribe(() => this.loadTransactions());
        this.paginationForm.valueChanges.subscribe(() => this.loadTransactions());
        this.loadTransactions();
    }

    private buildPayload(): void {
        const formValue = this.searchForm.getRawValue();
        const paginationValue = this.paginationForm.getRawValue();
        const startDate = this.parseDateInput(formValue.startDate);
        const endDate = this.parseDateInput(formValue.endDate);

        this.transactionsRequestDTO = {
            searchText: formValue.searchText.trim(),
            categoryId: formValue.categoryId === 0 ? null : formValue.categoryId,
            transactionTypeID: formValue.transactionTypeId === 0 ? null : formValue.transactionTypeId,
            startDate,
            endDate,
            pageSize: paginationValue.pageSize,
            pageNumber: paginationValue.pageNumber
        };
    }

    private parseDateInput(value: string): Date | null {
        if (!value) {
            return null;
        }
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    private loadTransactions(): void {
        this.errorMessage = '';
        this.isLoading.set(true);
        this.buildPayload();

        this.transactionService.getTransactions(this.transactionsRequestDTO).subscribe({
            next: (response: APIResponse<TransactionsDTO>) => {
                if (response.success && response.data) {
                    this.allTransactions = this.mapTransactions(response.data.transactions);
                    this.totalCount = response.data.totalCount;
                    this.paginationForm.get('pageNumber')?.setValue(response.data.currentPage, { emitEvent: false });
                    this.paginationForm.get('pageSize')?.setValue(response.data.pageSize, { emitEvent: false });
                    this.ensurePageSizeOption(response.data.pageSize);
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
                title: t.title,
                amount: t.amount,
                category: category?.categoryName || 'Unknown',
                transactionType: transactionType?.transactionTypeName || 'Unknown',
                date: new Date(t.dateTime),
                notes: t.notes || undefined
            };
        });
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

    private ensurePageSizeOption(pageSize: number): void {
        if (!this.pageSizeArray.includes(pageSize)) {
            this.pageSizeArray = [...this.pageSizeArray, pageSize].sort((a, b) => a - b);
        }
    }
}
