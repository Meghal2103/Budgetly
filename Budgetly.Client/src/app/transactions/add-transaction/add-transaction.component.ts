import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../core/services/transaction.service';
import { InitialDataService } from '../../core/services/initial-data.service';
import { CategoryOption } from '../../core/models/transaction/category.model'
import { TransactionType } from '../../core/models/transaction/transaction-type.model'
import { routes } from '../../core/enums/route.enum';
import { SIDEBAR_ITEMS } from '../../core/config/sidebar.config';
import { SidebarService } from '../../core/services/sidebar.service';
import { AddTransactionRequest } from '../../core/models/transaction/transaction.model';

@Component({
    selector: 'app-add-transaction',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './add-transaction.component.html',
    styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router)
    private transactionService = inject(TransactionService);
    private route = inject(ActivatedRoute);
    private initialDataService = inject(InitialDataService);
    public sidebarService = inject(SidebarService);

    private today = new Date();
    private formattedDate = this.today.toISOString().split('T')[0];
    private formattedTime = this.today.toTimeString().split(' ')[0].substring(0, 5);
    transactionForm: FormGroup = this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(200)]],
        amount: ['', [Validators.required]],
        categoryId: [0, Validators.required],
        transactionTypeID: [0, Validators.required],
        date: [this.formattedDate, Validators.required],
        time: [this.formattedTime, Validators.required],
        notes: ['']
    });

    errorMessage: string = '';

    categories: CategoryOption[] = [];
    transactionTypes: TransactionType[] = [];
    selectedTransactionType: 'cashOut' | 'cashIn' = 'cashIn';
    isbulk: boolean = true;

    ngOnInit(): void {
        this.sidebarService.activateElement(SIDEBAR_ITEMS[1]);
        this.transactionTypes = this.initialDataService.getTransactionTypes();
        this.categories = this.initialDataService.getCategories();
        this.route.queryParams.subscribe(params => {
            this.isbulk = params['bulk'] === 'true';
        });
        this.setupAmountTypeSync();
    }

    onSubmit(): void {
        if (this.transactionForm.valid) {
            this.sidebarService.appLoader = true;
            this.errorMessage = '';

            const formValue = this.transactionForm.value;
            const dateTime = `${formValue.date}T${formValue.time}:00`;

            const transactionData: AddTransactionRequest = {
                title: formValue.title.trim(),
                categoryId: parseInt(formValue.categoryId, 10),
                transactionTypeID: parseInt(formValue.transactionTypeID, 10),
                dateTime: dateTime,
                amount: parseFloat(formValue.amount),
                notes: formValue.notes || ''
            };

            this.transactionService.addTransaction(transactionData).subscribe({
                next: (response) => {
                    this.sidebarService.appLoader = false;
                    if (response.success && this.isbulk) {
                        this.transactionForm.reset({
                            title: '',
                            amount: '',
                            categoryId: 0,
                            transactionTypeID: 0,
                            date: this.formattedDate,
                            time: this.formattedTime,
                            notes: ''
                        });
                        this.selectedTransactionType = 'cashIn';
                    } else if (response.success) {
                        this.router.navigate([routes.viewTransactions]);
                    } else {
                        this.errorMessage = response.message
                    }
                },
                error: (error) => {
                    this.errorMessage = error.message
                    this.sidebarService.appLoader = false;
                }
            });
        } 
    }

    onCancel(): void {
        this.router.navigate([routes.viewTransactions]);
    }

    getFieldError(fieldName: string): string {
        const field = this.transactionForm.get(fieldName);
        if (field?.hasError('required') && field.touched) {
            return `${this.getFieldLabel(fieldName)} is required`;
        }
        if (field?.hasError('min') && field.touched) {
            return 'Amount must be greater than 0';
        }
        if (field?.hasError('invalidAmount') && field.touched) {
            return 'Please enter a valid amount';
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

    private setupAmountTypeSync(): void {
        this.transactionForm.get('amount')?.valueChanges.subscribe(value => {
            if (value === null || value === undefined || value === '') {
                return;
            }

            const stringValue = String(value).trim();
            const hasMinus = stringValue.startsWith('-');
            const numericValue = parseFloat(stringValue);
            const isNegative = !isNaN(numericValue) && numericValue < 0;

            this.selectedTransactionType = (hasMinus || isNegative) ? 'cashOut' : 'cashIn';
        });
    }

    onTransactionTypeSelect(type: 'cashOut' | 'cashIn'): void {
        this.selectedTransactionType = type;
        const amountControl = this.transactionForm.get('amount');
        if (!amountControl) {
            return;
        }

        const currentValue = amountControl.value;
        if (currentValue === null || currentValue === undefined || currentValue === '') {
            return;
        }

        const numericValue = parseFloat(String(currentValue));
        if (isNaN(numericValue)) {
            return;
        }

        if (type === 'cashOut') {
            amountControl.setValue(-Math.abs(numericValue), { emitEvent: false });
        } else {
            amountControl.setValue(Math.abs(numericValue), { emitEvent: false });
        }
    }

    getAmountColorClass(): string {
        return this.selectedTransactionType === 'cashOut' ? 'text-danger' : 'text-success';
    }
}
