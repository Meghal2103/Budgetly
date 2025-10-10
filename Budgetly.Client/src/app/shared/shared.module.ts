import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryHeaderComponent } from './components/primary-header/primary-header.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
    declarations: [
        PrimaryHeaderComponent,
        PageNotFoundComponent,
        DashboardComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        ToolbarModule
    ],
    exports: [
        PrimaryHeaderComponent,
        DashboardComponent
    ]
})
export class SharedModule { }
