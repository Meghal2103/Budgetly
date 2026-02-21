import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../core/services/transaction.service';
import { InitialDataService } from '../core/services/initial-data.service';
import { TransactionDTO } from '../core/models/transaction/transaction.model';
import { FormsModule } from "@angular/forms";

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
  analysisTypeId: number | null = null;

  // Transaction data
  allTransactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  // Filter options (UI only - not implemented)
  categories: string[] = ['All Categories'];
  paymentModes: string[] = ['All Payment Types'];

  // Filter values (UI only - not implemented)
  selectedCategory: string = 'All Categories';
  selectedPaymentMode: string = 'All Payment Types';
  selectedDate: Date | null = null;
  searchText: string = '';

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private initialDataService: InitialDataService
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { analysisTypeId?: number } | undefined;
    this.analysisTypeId = state?.analysisTypeId ?? null;
  }

  ngOnInit(): void {
    this.loadTransactions();
    this.loadFilterOptions();
  }

  private loadTransactions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.transactionService.getTransactions().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.allTransactions = this.mapTransactions(response.data);
          this.filteredTransactions = [...this.allTransactions];
          // Sort by date (most recent first)
          this.filteredTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());
        } else {
          this.errorMessage = response.message || 'Failed to load transactions';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'An error occurred while loading transactions';
        this.isLoading = false;
      }
    });
  }

  private mapTransactions(transactions: TransactionDTO[]): Transaction[] {
    const categories = this.initialDataService.getCategories();
    const transactionTypes = this.initialDataService.getTransactionTypes();

    return transactions.map(t => {
      const category = categories.find(c => c.categoryId === t.categoryId);
      const transactionType = transactionTypes.find(tt => tt.transactionTypeID === t.transactionTypeID);

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

  private loadFilterOptions(): void {
    // Load categories and transaction types for filter dropdowns (UI only)
    const categories = this.initialDataService.getCategories();
    const transactionTypes = this.initialDataService.getTransactionTypes();

    if (categories.length > 0) {
      this.categories = ['All Categories', ...categories.map(c => c.categoryName)];
    }

    if (transactionTypes.length > 0) {
      this.paymentModes = ['All Payment Types', ...transactionTypes.map(t => t.transactionTypeName)];
    }
  }

  applyFilters(): void {
    // Filter logic is kept but not implemented - just show all transactions
    // UI components are kept for future implementation
    this.filteredTransactions = [...this.allTransactions];
    this.filteredTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onPaymentModeChange(): void {
    this.applyFilters();
  }

  onDateChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedCategory = 'All Categories';
    this.selectedPaymentMode = 'All Payment Types';
    this.selectedDate = null;
    this.searchText = '';
    this.applyFilters();
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
