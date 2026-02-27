import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';

export const routes: Routes = [
    { path: '', component: TransactionsComponent },
    { path: 'add-transaction', component: AddTransactionComponent },
    { path: 'edit/:id', component: AddTransactionComponent },
    { path: 'details/:id', component: TransactionDetailsComponent }
];
