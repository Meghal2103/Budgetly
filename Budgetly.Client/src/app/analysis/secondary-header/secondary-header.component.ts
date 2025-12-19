import { Component } from '@angular/core';

@Component({
  selector: 'app-secondary-header',
  templateUrl: './secondary-header.component.html',
  styleUrls: ['./secondary-header.component.scss']
})
export class SecondaryHeaderComponent {
  // Categories dropdown
  categories: string[] = [
    'All Categories',
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Bills & Utilities',
    'Entertainment',
    'Healthcare',
    'Education',
    'Travel'
  ];
  selectedCategory: string = 'All Categories';

  // Payment types dropdown
  paymentTypes: string[] = [
    'All Payment Types',
    'Credit Card',
    'Debit Card',
    'Cash',
    'UPI',
    'Bank Transfer'
  ];
  selectedPaymentType: string = 'All Payment Types';

  // Date range
  dateRange: Date[] = [];
}
