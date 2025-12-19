import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionsComponent } from './transactions.component';
import { TransactionRoutingModule } from './transactions-routing.module';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';

@NgModule({
    declarations: [
        TransactionsComponent,
        AddTransactionComponent,
        TransactionDetailsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TransactionRoutingModule,
    ],
    exports : [
        TransactionsComponent
    ]
})
export class TransactionsModule { }
