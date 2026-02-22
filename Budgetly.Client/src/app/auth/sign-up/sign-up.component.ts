import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { Register } from '../../core/models/auth/auth.model';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  public sidebarService = inject(SidebarService);

  signUpForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    dateOfBirth: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const payload: Register = {
      firstName: this.signUpForm.value.firstName?.trim(),
      lastName: this.signUpForm.value.lastName?.trim(),
      email: this.signUpForm.value.email?.trim(),
      dateOfBirth: this.signUpForm.value.dateOfBirth,
      password: this.signUpForm.value.password
    };

    this.sidebarService.appLoader = true;
    this.authService.register(payload).subscribe({
      next: (message: string) => {
        this.sidebarService.appLoader = false;
        this.signUpForm.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: message || 'Registration successful'
        });
        this.router.navigate(['/auth/login']);
      },
      error: (error: Error) => {
        this.sidebarService.appLoader = false;
        this.signUpForm.reset();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'An error occurred during registration'
        });
      }
    });
  }
}
