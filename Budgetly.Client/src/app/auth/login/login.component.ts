import { Component, inject, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Login } from '../../core/models/auth/login.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, FormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    credential: Login = {
        email: '',
        password: ''
    }
    isLoading: boolean = false;
    errorMessage: string = '';
    private authService: AuthService = inject(AuthService);
    @ViewChild('loginForm') loginForm!: NgForm;

    public onSubmit(form: NgForm): void {
        if (form.invalid) {
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.login(this.credential).subscribe({
            next: (message: string) => {
                this.isLoading = false;
                form.resetForm();
            },
            error: (error: Error) => {
                this.isLoading = false;
                this.errorMessage = error.message || 'An error occurred during login';
            }
        });
    }

    public canDeactivate(): boolean {
        if (this.loginForm && this.loginForm.touched && this.loginForm.dirty) {
            return confirm('Your details will be lost if you leave. Do you really want to leave?');
        }
        return true;
    }
}
