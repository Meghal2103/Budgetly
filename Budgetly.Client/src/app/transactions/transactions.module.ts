import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { TransactionRoutingModule } from './transactions-routing.module';

@NgModule({
    declarations: [
        TransactionsComponent
    ],
    imports: [
        CommonModule,
        TransactionRoutingModule
    ],
    exports : [
        TransactionsComponent
    ]
})
export class TransactionsModule { }
