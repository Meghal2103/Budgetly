import { Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {loggedInGuard} from "./core/guards/logged-in.guard";
import {DashboardComponent} from "./shared/components/dashboard/dashboard.component";
import {PageNotFoundComponent} from "./shared/components/page-not-found/page-not-found.component";

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [loggedInGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'transactions', loadChildren: () => import('./transactions/transactions.routes').then(m => m.routes)},
            { path: 'analysis', loadChildren: () => import('./analysis/analysis.routes').then(a => a.routes )}
        ]
    },
    { path: 'auth', loadChildren: () => import('./auth/auth-routing.routes').then(m => m.routes) },
    { path: '**', component: PageNotFoundComponent}
];