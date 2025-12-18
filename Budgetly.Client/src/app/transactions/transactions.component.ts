import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {
  analysisTypeId: number | null = null;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { analysisTypeId?: number } | undefined;
    this.analysisTypeId = state?.analysisTypeId ?? null;
  }
}
