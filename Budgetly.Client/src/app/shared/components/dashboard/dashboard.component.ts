import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ChartModule } from "primeng/chart";
import { routes } from '../../../core/enums/route.enum';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  paymentMode: string;
  date: Date;
}

@Component({
  selector: 'app-dashboard',
  imports: [ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Summary data
  totalSpendThisMonth: number = 0;
  monthlyBudget: number = 50000;
  remainingBudget: number = 0;
  totalTransactions: number = 0;
  averageDailySpend: number = 0;

  // Recent transactions
  recentTransactions: Transaction[] = [];

  // Chart data
  monthlySpendingChartData: any = { labels: [], datasets: [] };
  categoryChartData: any = { labels: [], datasets: [] };

  chartOptions: any = {};
  pieChartOptions: any = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.generateDummyData();
    this.calculateSummary();
    this.setupCharts();
  }

  private generateDummyData(): void {
    const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Healthcare', 'Education', 'Travel'];
    const paymentModes = ['Credit Card', 'Debit Card', 'Cash', 'UPI', 'Bank Transfer'];
    const descriptions = [
      'Restaurant Bill', 'Grocery Shopping', 'Coffee Shop', 'Fast Food', 'Food Delivery',
      'Uber Ride', 'Gas Station', 'Public Transport', 'Parking Fee', 'Car Maintenance',
      'Clothing Store', 'Electronics', 'Online Purchase', 'Department Store', 'Book Store',
      'Electricity Bill', 'Water Bill', 'Internet Bill', 'Phone Bill', 'Gas Bill'
    ];

    const transactions: Transaction[] = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Generate transactions for current month
    for (let i = 0; i < 30; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(currentYear, currentMonth, today.getDate() - daysAgo);

      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        transactions.push({
          id: i + 1,
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          amount: Math.floor(Math.random() * 5000) + 100,
          category: categories[Math.floor(Math.random() * categories.length)],
          paymentMode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
          date: date
        });
      }
    }

    // Sort by date (most recent first) and get last 5
    this.recentTransactions = transactions
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);

    // Calculate total spend this month
    this.totalSpendThisMonth = transactions.reduce((sum, t) => sum + t.amount, 0);
    this.totalTransactions = transactions.length;
    this.remainingBudget = Math.max(0, this.monthlyBudget - this.totalSpendThisMonth);
    this.averageDailySpend = this.totalSpendThisMonth / today.getDate();
  }

  private calculateSummary(): void {
    // Summary calculations are done in generateDummyData
  }

  private setupCharts(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#374151';
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6b7280';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#e5e7eb';

    // Monthly spending trend (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyData = months.map(() => Math.floor(Math.random() * 30000) + 20000);

    this.monthlySpendingChartData = {
      labels: months,
      datasets: [
        {
          label: 'Monthly Spending',
          data: monthlyData,
          fill: true,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4
        }
      ]
    };

    // Category breakdown
    const categoryTotals: { [key: string]: number } = {};
    this.recentTransactions.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    // Fill with dummy data if needed
    const allCategories = ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Healthcare', 'Education', 'Travel'];
    allCategories.forEach(cat => {
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = Math.floor(Math.random() * 5000) + 1000;
      }
    });

    this.categoryChartData = {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
          ]
        }
      ]
    };

    // Line chart options
    this.chartOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

    // Pie chart options
    this.pieChartOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            usePointStyle: true,
            padding: 15
          }
        }
      }
    };
  }

  navigateToTransactions(): void {
    this.router.navigate([routes.viewTransactions]);
  }

  navigateToAnalysis(): void {
    this.router.navigate(['/analysis']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  getBudgetPercentage(): number {
    return (this.totalSpendThisMonth / this.monthlyBudget) * 100;
  }

  getBudgetStatusClass(): string {
    const percentage = this.getBudgetPercentage();
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'success';
  }
}
