import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PrimaryHeaderComponent} from "./shared/components/primary-header/primary-header.component";
import {InitialDataService} from "./core/services/initial-data.service";
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PrimaryHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly title = signal('Budgetly');
  private readonly initialDataService = inject(InitialDataService);
  readonly authService = inject(AuthService);

  readonly isInitialLoading = computed(() => !this.initialDataService.areCategoriesLoaded() || !this.initialDataService.areTransactionTypesLoaded());
}
