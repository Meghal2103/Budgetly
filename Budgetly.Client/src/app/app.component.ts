import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PrimaryHeaderComponent} from "./shared/components/primary-header/primary-header.component";
import {InitialDataService} from "./core/services/initial-data.service";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PrimaryHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly title = signal('Budgetly');
  public initialDataService = inject(InitialDataService);
}
