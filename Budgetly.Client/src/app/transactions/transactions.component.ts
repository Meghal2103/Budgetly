import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../core/services/transaction.service';
import { InitialDataService } from '../core/services/initial-data.service';
import { TransactionDTO } from '../core/models/transaction/transaction.model';
import { FormsModule } from "@angular/forms";
import { CategoryOption } from '../core/models/transaction/category.model';
import { TransactionType } from '../core/models/transaction/transaction-type.model';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  category: string;
  transactionType: string;
  date: Date;
  notes?: string;
}

@Component({
  selector: 'app-transactions',
  imports: [FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private initialDataService = inject(InitialDataService);
  private router = inject(Router);
  analysisTypeId: number | null = null;

  // Transaction data
  allTransactions: Transaction[] = [];
  isLoading = signal(true);
  errorMessage: string = '';

  categories: CategoryOption[] = this.initialDataService.getCategories();
  transactionTypes: TransactionType[] = this.initialDataService.getTransactionTypes();

  selectedDate: Date | null = null;
  searchText: string = '';

  ngOnInit(): void {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    this.errorMessage = '';

    this.transactionService.getTransactions().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.allTransactions = this.mapTransactions(response.data);
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

  onCategoryChange(): void {
    // this.applyFilters();
  }

  onPaymentModeChange(): void {
    // this.applyFilters();
  }

  onDateChange(): void {
    // this.applyFilters();
  }

  onSearchChange(): void {
    // this.applyFilters();
  }

  clearFilters(): void {
    // this.selectedCategory = 'All Categories';
    // this.selectedPaymentMode = 'All Payment Types';
    // this.selectedDate = null;
    // this.searchText = '';
    // this.applyFilters();
  }

  addTransaction(): void {
    // Navigate to add transaction page or open modal
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
}
