import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrimaryHeaderComponent } from './components/primary-header/primary-header.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChartModule } from 'primeng/chart';

@NgModule({
    declarations: [
        PrimaryHeaderComponent,
        PageNotFoundComponent,
        DashboardComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ChartModule
    ],
    exports: [
        PrimaryHeaderComponent,
        DashboardComponent
    ]
})
export class SharedModule { }
