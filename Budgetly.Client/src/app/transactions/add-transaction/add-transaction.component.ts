import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../core/services/transaction.service';
import { AuthService } from '../../core/services/auth.service';
import { InitialDataService } from '../../core/services/initial-data.service';
import { CategoryOption } from '../../core/models/transaction/category.model'
import { TransactionType } from '../../core/models/transaction/transaction-type.model'

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {
  transactionForm!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  categories: CategoryOption[] = [];
  transactionTypes: TransactionType[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private transactionService: TransactionService,
    private authService: AuthService,
    private initialDataService: InitialDataService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadTransactionTypes();
    this.loadCategories();
  }

  private loadTransactionTypes(): void {
    // Check if already loaded, if so use cached data
    if (this.initialDataService.areTransactionTypesLoaded()) {
      this.transactionTypes = this.initialDataService.getTransactionTypes();
    } else {
      // If not loaded yet, load them now
      this.initialDataService.loadTransactionTypes().subscribe({
        next: (types) => {
          this.transactionTypes = types;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load transaction types. Please refresh the page.';
          console.error('Error loading transaction types:', error);
        }
      });
    }
  }

  private loadCategories(): void {
    // Check if already loaded, if so use cached data
    if (this.initialDataService.areCategoriesLoaded()) {
      this.categories = this.initialDataService.getCategories();
    } else {
      // If not loaded yet, load them now
      this.initialDataService.loadCategories().subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load categories. Please refresh the page.';
          console.error('Error loading categories:', error);
        }
      });
    }
  }

  private initializeForm(): void {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const formattedTime = today.toTimeString().split(' ')[0].substring(0, 5);

    this.transactionForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      transactionTypeID: ['', Validators.required],
      date: [formattedDate, Validators.required],
      time: [formattedTime, Validators.required],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.transactionForm.value;
      const userId = this.authService.userId;

      if (!userId || userId === 0) {
        this.errorMessage = 'User ID not found. Please login again.';
        this.isLoading = false;
        return;
      }

      // Combine date and time into DateTime string
      const dateTime = `${formValue.date}T${formValue.time}:00`;

      const transactionData = {
        title: formValue.title.trim(),
        userId: userId,
        categoryId: parseInt(formValue.categoryId, 10),
        transactionTypeID: parseInt(formValue.transactionTypeID, 10),
        dateTime: dateTime,
        amount: parseFloat(formValue.amount),
        notes: formValue.notes || ''
      };

      this.transactionService.addTransaction(transactionData).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/transactions']);
          } else {
            this.errorMessage = response.message || 'Failed to add transaction';
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'An error occurred while adding the transaction';
          this.isLoading = false;
        }
      });
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
      title: 'Title',
      amount: 'Amount',
      categoryId: 'Category',
      transactionTypeID: 'Transaction Type',
      date: 'Date',
      time: 'Time',
      notes: 'Notes'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.transactionForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
