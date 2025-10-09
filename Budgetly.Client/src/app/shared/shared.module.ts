import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryHeaderComponent } from './components/primary-header/primary-header.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
    declarations: [
        PrimaryHeaderComponent,
        PageNotFoundComponent,
        DashboardComponent
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        PrimaryHeaderComponent,
        DashboardComponent
    ]
})
export class SharedModule { }
