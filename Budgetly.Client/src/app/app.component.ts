import { Component, OnInit, inject } from '@angular/core';
import { InitialDataService } from './core/services/initial-data.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Budgetly.Client';
  private initialDataService: InitialDataService = inject(InitialDataService);
  private authService: AuthService = inject(AuthService);

  ngOnInit(): void {
    // Load initial data once when app initializes (if user is logged in)
    if (this.authService.isLoggedIn) {
      // Load transaction types
      this.initialDataService.loadTransactionTypes().subscribe({
        next: () => {
          // Transaction types are now cached in the service
        },
        error: (error) => {
          console.error('Failed to load transaction types:', error);
        }
      });

      // Load categories
      this.initialDataService.loadCategories().subscribe({
        next: () => {
          // Categories are now cached in the service
        },
        error: (error) => {
          console.error('Failed to load categories:', error);
        }
      });
    }
  }
}
