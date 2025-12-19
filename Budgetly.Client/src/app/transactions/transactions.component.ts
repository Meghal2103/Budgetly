import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    category: string;
    paymentMode: string;
    date: Date;
    notes?: string;
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  analysisTypeId: number | null = null;
  
  // Transaction data
  allTransactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  
  // Filter options
  categories: string[] = ['All Categories', 'Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Healthcare', 'Education', 'Travel'];
  paymentModes: string[] = ['All Payment Types', 'Credit Card', 'Debit Card', 'Cash', 'UPI', 'Bank Transfer'];
  
  // Filter values
  selectedCategory: string = 'All Categories';
  selectedPaymentMode: string = 'All Payment Types';
  selectedDate: Date | null = null;
  searchText: string = '';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { analysisTypeId?: number } | undefined;
    this.analysisTypeId = state?.analysisTypeId ?? null;
  }

  ngOnInit(): void {
    this.generateDummyTransactions();
    this.applyFilters();
  }

  private generateDummyTransactions(): void {
    const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Healthcare', 'Education', 'Travel'];
    const paymentModes = ['Credit Card', 'Debit Card', 'Cash', 'UPI', 'Bank Transfer'];
    const descriptions = [
      'Restaurant Bill', 'Grocery Shopping', 'Coffee Shop', 'Fast Food', 'Food Delivery',
      'Uber Ride', 'Gas Station', 'Public Transport', 'Parking Fee', 'Car Maintenance',
      'Clothing Store', 'Electronics', 'Online Purchase', 'Department Store', 'Book Store',
      'Electricity Bill', 'Water Bill', 'Internet Bill', 'Phone Bill', 'Gas Bill',
      'Movie Ticket', 'Concert', 'Streaming Service', 'Gaming', 'Theater',
      'Pharmacy', 'Doctor Visit', 'Lab Test', 'Medicine', 'Health Insurance',
      'Course Fee', 'Books', 'Tuition', 'Online Course', 'School Supplies',
      'Hotel Booking', 'Flight Ticket', 'Train Ticket', 'Travel Insurance', 'Tour Package'
    ];

    // Generate 50 dummy transactions
    for (let i = 0; i < 50; i++) {
      const daysAgo = Math.floor(Math.random() * 90); // Last 90 days
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      this.allTransactions.push({
        id: i + 1,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        amount: Math.floor(Math.random() * 10000) + 100,
        category: categories[Math.floor(Math.random() * categories.length)],
        paymentMode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
        date: date,
        notes: Math.random() > 0.7 ? 'Additional notes here' : undefined
      });
    }

    // Sort by date (most recent first)
    this.allTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  applyFilters(): void {
    this.filteredTransactions = this.allTransactions.filter(transaction => {
      // Category filter
      if (this.selectedCategory !== 'All Categories' && transaction.category !== this.selectedCategory) {
        return false;
      }

      // Payment mode filter
      if (this.selectedPaymentMode !== 'All Payment Types' && transaction.paymentMode !== this.selectedPaymentMode) {
        return false;
      }

      // Date filter
      if (this.selectedDate) {
        const transactionDate = new Date(transaction.date);
        const filterDate = new Date(this.selectedDate);
        if (transactionDate.toDateString() !== filterDate.toDateString()) {
          return false;
        }
      }

      // Search text filter
      if (this.searchText) {
        const searchLower = this.searchText.toLowerCase();
        return transaction.description.toLowerCase().includes(searchLower) ||
               transaction.category.toLowerCase().includes(searchLower) ||
               transaction.paymentMode.toLowerCase().includes(searchLower);
      }

      return true;
    });
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
