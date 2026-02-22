import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { routes } from '../../core/enums/route.enum';

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
  selector: 'app-transaction-details',
  standalone: true,
  imports: [],
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {
  transaction: Transaction | null = null;
  transactionId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get transaction ID from route params
    this.route.params.subscribe(params => {
      this.transactionId = +params['id'];
      this.loadTransaction();
    });
  }

  private loadTransaction(): void {
    // TODO: Replace with actual API call
    // For now, generate dummy transaction data
    if (this.transactionId) {
      const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Healthcare', 'Education', 'Travel'];
      const paymentModes = ['Credit Card', 'Debit Card', 'Cash', 'UPI', 'Bank Transfer'];
      const descriptions = [
        'Restaurant Bill', 'Grocery Shopping', 'Coffee Shop', 'Fast Food', 'Food Delivery',
        'Uber Ride', 'Gas Station', 'Public Transport', 'Parking Fee', 'Car Maintenance',
        'Clothing Store', 'Electronics', 'Online Purchase', 'Department Store', 'Book Store'
      ];

      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      this.transaction = {
        id: this.transactionId,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        amount: Math.floor(Math.random() * 10000) + 100,
        category: categories[Math.floor(Math.random() * categories.length)],
        paymentMode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
        date: date,
        notes: Math.random() > 0.5 ? 'This is a sample note for the transaction. It can contain additional details about the purchase.' : undefined
      };
    }
  }

  onBack(): void {
    this.router.navigate([routes.viewTransactions]);
  }

  onEdit(): void {
    // TODO: Navigate to edit transaction page
    this.router.navigate(['/transactions/edit', this.transactionId]);
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      // TODO: Call API to delete transaction
      console.log('Deleting transaction:', this.transactionId);
      alert('Transaction deleted successfully!');
      this.router.navigate([routes.viewTransactions]);
    }
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

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Food & Dining': 'bi-egg-fried',
      'Transportation': 'bi-car-front',
      'Shopping': 'bi-bag',
      'Bills & Utilities': 'bi-lightning-charge',
      'Entertainment': 'bi-film',
      'Healthcare': 'bi-heart-pulse',
      'Education': 'bi-book',
      'Travel': 'bi-airplane'
    };
    return icons[category] || 'bi-receipt';
  }

  getPaymentModeIcon(paymentMode: string): string {
    const icons: { [key: string]: string } = {
      'Credit Card': 'bi-credit-card',
      'Debit Card': 'bi-credit-card-2-front',
      'Cash': 'bi-cash-coin',
      'UPI': 'bi-phone',
      'Bank Transfer': 'bi-bank'
    };
    return icons[paymentMode] || 'bi-wallet';
  }
}
