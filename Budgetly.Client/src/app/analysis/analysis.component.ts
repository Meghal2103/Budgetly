import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../core/services/sidebar.service';
import { AnalysisItems } from '../core/enums/analysis-items.enum';
import {SecondaryHeaderComponent} from "./secondary-header/secondary-header.component";
import {ChartModule} from "primeng/chart";
import { routes } from '../core/enums/route.enum';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    category: string;
    paymentMode: string;
    date: Date;
}

@Component({
    selector: 'app-analysis',
    imports: [SecondaryHeaderComponent, ChartModule],
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
    public sidebarService: SidebarService = inject(SidebarService);
    private router: Router = inject(Router);
    public analysisItems = AnalysisItems;
    
    public transactions: Transaction[] = [];
    public last20Transactions: Transaction[] = [];
    
    // Analysis data
    public totalSpend: number = 0;
    public mostSpentCategory: string = '';
    public mostUsedPaymentMethod: string = '';
    
    // Chart data
    public categoryChartData: any = { labels: [], datasets: [] };
    public paymentModeChartData: any = { labels: [], datasets: [] };
    public periodComparisonChartData: any = { labels: [], datasets: [] };
    
    // Chart options
    public chartOptions: any = {};       // for line chart
    public pieChartOptions: any = {};    // for both pie charts

    ngOnInit(): void {
        this.generateDummyData();
        this.calculateAnalysisData();
        this.setupCharts();
    }

    private generateDummyData(): void {
        const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Healthcare', 'Education', 'Travel'];
        const paymentModes = ['Credit Card', 'Debit Card', 'Cash', 'UPI', 'Bank Transfer'];
        
        // const currentPeriod = this.sidebarService.activeItem;
        // const daysInPeriod = this.getDaysInPeriod(currentPeriod);
        
        // Generate transactions for current period
        for (let i = 0; i < 20; i++) {
            // const daysAgo = Math.floor(Math.random() * daysInPeriod);
            const date = new Date();
            // date.setDate(date.getDate() - daysAgo);
            
            this.transactions.push({
                id: i + 1,
                description: this.getRandomDescription(categories[Math.floor(Math.random() * categories.length)]),
                amount: Math.floor(Math.random() * 5000) + 100,
                category: categories[Math.floor(Math.random() * categories.length)],
                paymentMode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
                date: date
            });
        }
        
        // Sort by date (most recent first) and get last 20
        this.last20Transactions = [...this.transactions]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 20);
    }

    private getRandomDescription(category: string): string {
        const descriptions: { [key: string]: string[] } = {
            'Food & Dining': ['Restaurant Bill', 'Grocery Shopping', 'Coffee Shop', 'Fast Food', 'Food Delivery'],
            'Transportation': ['Uber Ride', 'Gas Station', 'Public Transport', 'Parking Fee', 'Car Maintenance'],
            'Shopping': ['Clothing Store', 'Electronics', 'Online Purchase', 'Department Store', 'Book Store'],
            'Bills & Utilities': ['Electricity Bill', 'Water Bill', 'Internet Bill', 'Phone Bill', 'Gas Bill'],
            'Entertainment': ['Movie Ticket', 'Concert', 'Streaming Service', 'Gaming', 'Theater'],
            'Healthcare': ['Pharmacy', 'Doctor Visit', 'Lab Test', 'Medicine', 'Health Insurance'],
            'Education': ['Course Fee', 'Books', 'Tuition', 'Online Course', 'School Supplies'],
            'Travel': ['Hotel Booking', 'Flight Ticket', 'Train Ticket', 'Travel Insurance', 'Tour Package']
        };
        const options = descriptions[category] || ['Transaction'];
        return options[Math.floor(Math.random() * options.length)];
    }

    private getDaysInPeriod(period: string): number {
        switch (period) {
            case AnalysisItems.Weekly:
                return 7;
            case AnalysisItems.Monthly:
                return 30;
            case AnalysisItems.Yearly:
                return 365;
            case AnalysisItems.Custom_Range:
                return 30; // Default for custom
            default:
                return 30;
        }
    }

    private setupCharts(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Category breakdown pie chart
        const categoryTotals = this.calculateCategoryTotals();
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

        // Payment mode pie chart
        const paymentModeTotals = this.calculatePaymentModeTotals();
        this.paymentModeChartData = {
            labels: Object.keys(paymentModeTotals),
            datasets: [
                {
                    data: Object.values(paymentModeTotals),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                    ]
                }
            ]
        };

        // Period comparison line chart
        // const currentPeriod = this.sidebarService.activeItem;
        // const comparisonData = this.generatePeriodComparisonData(currentPeriod);
        // this.periodComparisonChartData = {
        //     labels: comparisonData.labels,
        //     datasets: [
        //         {
        //             label: 'Current Period',
        //             data: comparisonData.current,
        //             fill: false,
        //             borderColor: '#36A2EB',
        //             tension: 0.4
        //         },
        //         {
        //             label: 'Previous Period',
        //             data: comparisonData.previous,
        //             fill: false,
        //             borderColor: '#FF6384',
        //             tension: 0.4
        //         }
        //     ]
        // };

        // Options for line chart (keep axes)
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
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

        // Options for pie charts (no x/y axes)
        this.pieChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };
    }

    private calculateCategoryTotals(): { [key: string]: number } {
        const totals: { [key: string]: number } = {};
        this.transactions.forEach(t => {
            totals[t.category] = (totals[t.category] || 0) + t.amount;
        });
        return totals;
    }

    private calculatePaymentModeTotals(): { [key: string]: number } {
        const totals: { [key: string]: number } = {};
        this.transactions.forEach(t => {
            totals[t.paymentMode] = (totals[t.paymentMode] || 0) + t.amount;
        });
        return totals;
    }

    private generatePeriodComparisonData(period: string): { labels: string[], current: number[], previous: number[] } {
        const daysInPeriod = this.getDaysInPeriod(period);
        const intervals = period === AnalysisItems.Weekly ? 7 : period === AnalysisItems.Monthly ? 5 : period === AnalysisItems.Yearly ? 12 : 5;
        
        const labels: string[] = [];
        const current: number[] = [];
        const previous: number[] = [];

        if (period === AnalysisItems.Weekly) {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            for (let i = 0; i < 7; i++) {
                labels.push(days[i]);
                current.push(Math.floor(Math.random() * 5000) + 1000);
                previous.push(Math.floor(Math.random() * 5000) + 1000);
            }
        } else if (period === AnalysisItems.Monthly) {
            for (let i = 0; i < 4; i++) {
                labels.push(`Week ${i + 1}`);
                current.push(Math.floor(Math.random() * 15000) + 5000);
                previous.push(Math.floor(Math.random() * 15000) + 5000);
            }
        } else if (period === AnalysisItems.Yearly) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            for (let i = 0; i < 12; i++) {
                labels.push(months[i]);
                current.push(Math.floor(Math.random() * 50000) + 20000);
                previous.push(Math.floor(Math.random() * 50000) + 20000);
            }
        } else {
            for (let i = 0; i < 5; i++) {
                labels.push(`Day ${i + 1}`);
                current.push(Math.floor(Math.random() * 5000) + 1000);
                previous.push(Math.floor(Math.random() * 5000) + 1000);
            }
        }

        return { labels, current, previous };
    }

    // public getPeriodLabel(): string {
    //     // return this.sidebarService.activeItem;
    // }

    public formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }

    public formatDate(date: Date): string {
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(date);
    }

    private calculateAnalysisData(): void {
        // Calculate total spend
        this.totalSpend = this.transactions.reduce((sum, t) => sum + t.amount, 0);

        // Calculate most spent category
        const categoryTotals = this.calculateCategoryTotals();
        const categoryKeys = Object.keys(categoryTotals);
        if (categoryKeys.length > 0) {
            this.mostSpentCategory = categoryKeys.reduce((a, b) => 
                categoryTotals[a] > categoryTotals[b] ? a : b
            );
        }

        // Calculate most used payment method
        const paymentModeCounts: { [key: string]: number } = {};
        this.transactions.forEach(t => {
            paymentModeCounts[t.paymentMode] = (paymentModeCounts[t.paymentMode] || 0) + 1;
        });
        const paymentModeKeys = Object.keys(paymentModeCounts);
        if (paymentModeKeys.length > 0) {
            this.mostUsedPaymentMethod = paymentModeKeys.reduce((a, b) => 
                paymentModeCounts[a] > paymentModeCounts[b] ? a : b
            );
        }
    }

    public navigateToTransactions(): void {
        this.router.navigate([routes.viewTransactions]);
    }
}
