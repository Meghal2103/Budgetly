import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
// import { formGuard } from '../core/guards/form.guard';
import { loggedInRedirectGuard } from '../core/guards/logged-in-redirect.guard';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [loggedInRedirectGuard] },
    { path: 'sign-up', component: SignUpComponent, canActivate: [loggedInRedirectGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }