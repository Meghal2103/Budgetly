import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../core/services/transaction.service';
import { InitialDataService } from '../core/services/initial-data.service';
import { TransactionDTO, Transaction, TransactionsRequestDTO, TransactionsDTO } from '../core/models/transaction/transaction.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CategoryOption } from '../core/models/transaction/category.model';
import { TransactionType } from '../core/models/transaction/transaction-type.model';
import { PAGE_CONFIG } from '../core/config/page.config';
import { APIResponse } from '../core/models/api-response.model';
import { Subject, combineLatest, debounceTime, distinctUntilChanged, startWith, switchMap, take, takeUntil } from 'rxjs';
import { SlicePipe } from '@angular/common';

@Component({
    selector: 'app-transactions',
    imports: [ReactiveFormsModule, SlicePipe],
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {
    private transactionService = inject(TransactionService);
    private initialDataService = inject(InitialDataService);
    private router = inject(Router);
    private formBuilder = inject(FormBuilder);
    private destroy$ = new Subject<void>();
    private totalCount: number = 0;
    pageSizeArray = PAGE_CONFIG.PAGE_SIZES;
    netBalance = signal(0);
    pageBalance = signal(0);

    // Transaction data
    allTransactions: Transaction[] = [];
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
        categoryId: 0,
        transactionTypeID: 0,
        startDate: null,
        endDate: null,
        pageSize: PAGE_CONFIG.DEFAULT_PAGE_SIZE,
        pageNumber: 1
    };

    private buildPayload(): void {
        const formValue = this.searchForm.getRawValue();
        const paginationValue = this.paginationForm.getRawValue();
        const startDate = this.parseDateInput(formValue.startDate);
        const endDate = this.parseDateInput(formValue.endDate);

        this.transactionsRequestDTO = {
            searchText: formValue.searchText.trim() ?? '',
            categoryId: formValue.categoryId,
            transactionTypeID: formValue.transactionTypeId,
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

    ngOnInit(): void {
        this.searchForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.paginationForm.patchValue({ pageNumber: 1 }, { emitEvent: false });
            });

        this.paginationForm.get('pageSize')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.paginationForm.patchValue({ pageNumber: 1 }, { emitEvent: false });
            });

        combineLatest([
            this.searchForm.valueChanges.pipe(startWith(this.searchForm.getRawValue())),
            this.paginationForm.valueChanges.pipe(startWith(this.paginationForm.getRawValue()))
        ]).pipe(
            debounceTime(300),
            switchMap(() => {
                this.buildPayload();
                this.isLoading.set(true);
                return this.transactionService.getTransactions(this.transactionsRequestDTO);
            }),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (response: APIResponse<TransactionsDTO>) => {
                if (response.success && response.data) {
                    this.allTransactions = this.mapTransactions(response.data.transactions);
                    this.totalCount = response.data.totalCount;
                    this.netBalance.set(response.data.netBalance);
                    this.pageBalance.set(response.data.pageBalance);
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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

    goToPage(page: number): void {
        if (page < 1 || page > this.getLastPage()) {
            return;
        }
        this.paginationForm.patchValue({ pageNumber: page });
    }

    goToFirstPage(): void {
        this.goToPage(1);
    }

    goToPreviousPage(): void {
        const current = this.paginationForm.get('pageNumber')?.value ?? 1;
        this.goToPage(current - 1);
    }

    goToNextPage(): void {
        const current = this.paginationForm.get('pageNumber')?.value ?? 1;
        this.goToPage(current + 1);
    }

    goToLastPage(): void {
        this.goToPage(this.getLastPage());
    }

    downloadFilteredTransactions(): void {
        this.buildPayload();
        this.transactionService.downloadTransactions(this.transactionsRequestDTO).subscribe({
            next: (blob) => this.triggerDownload(blob, 'transactions-filtered.xlsx'),
            error: (error) => {
                this.errorMessage = error.message || 'Failed to download filtered transactions';
            }
        });
    }

    downloadAllTransactions(): void {
        this.transactionService.downloadAllTransactions().subscribe({
            next: (blob) => this.triggerDownload(blob, 'transactions-all.xlsx'),
            error: (error) => {
                this.errorMessage = error.message || 'Failed to download all transactions';
            }
        });
    }

    private triggerDownload(blob: Blob, fileName: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
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
