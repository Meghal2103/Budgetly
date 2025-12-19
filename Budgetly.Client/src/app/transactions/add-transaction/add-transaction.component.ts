import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {
  transactionForm!: FormGroup;

  categories: string[] = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Bills & Utilities',
    'Entertainment',
    'Healthcare',
    'Education',
    'Travel'
  ];

  paymentModes: string[] = [
    'Credit Card',
    'Debit Card',
    'Cash',
    'UPI',
    'Bank Transfer'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    this.transactionForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(200)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      paymentMode: ['', Validators.required],
      date: [formattedDate, Validators.required],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      console.log('Transaction Data:', formValue);
      
      // TODO: Call API to save transaction
      // For now, just navigate back to transactions list
      alert('Transaction added successfully!');
      this.router.navigate(['/transactions']);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.transactionForm.controls).forEach(key => {
        this.transactionForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/transactions']);
  }

  getFieldError(fieldName: string): string {
    const field = this.transactionForm.get(fieldName);
    if (field?.hasError('required') && field.touched) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('min') && field.touched) {
      return 'Amount must be greater than 0';
    }
    if (field?.hasError('maxlength') && field.touched) {
      return 'Description is too long';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      description: 'Description',
      amount: 'Amount',
      category: 'Category',
      paymentMode: 'Payment Mode',
      date: 'Date',
      notes: 'Notes'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.transactionForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
