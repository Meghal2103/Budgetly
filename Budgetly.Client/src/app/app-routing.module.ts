import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { loggedInGuard } from './core/guards/logged-in.guard';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [loggedInGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'transactions', loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsModule)}
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
