import { Component } from '@angular/core';

import { FormsModule } from "@angular/forms";
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-secondary-header',
  imports: [FormsModule, SelectModule, DatePickerModule],
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
