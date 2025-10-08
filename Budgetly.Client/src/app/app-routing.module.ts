import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { loggedInGuard } from './core/guards/logged-in.guard';

const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [loggedInGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
