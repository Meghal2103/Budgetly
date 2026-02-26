import { Component, inject, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { routes } from '../../core/enums/route.enum';
import { InitialDataService } from '../../core/services/initial-data.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs';
import { TransactionService } from '../../core/services/transaction.service';
import { APIResponse } from '../../core/models/api-response.model';
import { Transaction, TransactionDTO } from '../../core/models/transaction/transaction.model';
import { MessageService } from 'primeng/api';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
    selector: 'app-transaction-details',
    standalone: true,
    imports: [],
    templateUrl: './transaction-details.component.html',
    styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private initialDataService = inject(InitialDataService);
    private transactionService = inject(TransactionService);
    private messageService = inject(MessageService);
    private sidebarService = inject(SidebarService);
    private destroy$ = new Subject<void>();
    readonly categories = this.initialDataService.categories;
    readonly transactionTypes = this.initialDataService.transactionTypes;
    public isDeleteModalOpen = false;

    transaction: Transaction = {
        id: 0,
        title: '',
        amount: 0,
        category: '',
        transactionType: '',
        date: new Date()
    };

    ngOnInit(): void {
        this.route.paramMap
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                const id = Number(params.get('id'));
                if (!id) {
                    return;
                }
                this.loadTransaction(id);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadTransaction(transactionId: number): void {
        this.sidebarService.appLoader = true;
        this.transactionService.getTransactionsDetails(transactionId)
            .subscribe({
                next: (response: APIResponse<TransactionDTO>) => {
                    if (response.success && response.data) {
                        this.transaction = this.transactionService.mapTransaction(response.data, this.categories(), this.transactionTypes());
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: response.message || 'Failed to load transactions'
                        });
                    }
                    this.sidebarService.appLoader = false;
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message || 'An error occurred while loading transaction'
                    });  
                    this.sidebarService.appLoader = false;              
                }
            });
    }

    onBack(): void {
        this.router.navigate([routes.viewTransactions]);
    }

    onEdit(): void {
        // TODO: Navigate to edit transaction page
        this.router.navigate(['/transactions/edit', this.transaction.id]);
    }

    onDelete(): void {
        this.isDeleteModalOpen = true;
    }

    closeDeleteModal(): void {
        this.isDeleteModalOpen = false;
    }

    confirmDelete(): void {
        this.isDeleteModalOpen = false;
        this.sidebarService.appLoader = true;
        this.transactionService.deleteTransaction(this.transaction.id)
            .subscribe({
                next: (response: APIResponse<void>) => {
                    if (response.success) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: response.message || 'Transaction deleted successfully.'
                        });
                        this.router.navigate([routes.viewTransactions]);
                    }
                    this.sidebarService.appLoader = false;
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message || 'An error occurred while deleting transaction'
                    });  
                    this.sidebarService.appLoader = false;  
                    this.router.navigate([routes.viewTransactions]);            
                }
            });
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
            month: 'long',
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
}
