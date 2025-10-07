import { Component, inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Login } from 'src/app/core/models/auth/login.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    credential: Login = {
        email: '',
        password: ''
    }
    private authService: AuthService = inject(AuthService);
    @ViewChild('loginForm') loginForm!: NgForm;

    public onSubmit(form: NgForm): void {
        this.authService.login(this.credential);
        form.resetForm();
    }

    public canDeactivate(): boolean {
        if (this.loginForm.touched && this.loginForm.dirty) {
            return confirm('Your details will be lost if you leave. Do you really want to leave?');
        }
        return true;
    }
}
