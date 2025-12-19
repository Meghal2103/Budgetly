import { AnalysisItems } from '../enums/analysis-items.enum';
import { SidebarItem } from '../models/sidebar.model';

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 'Dashboard',
    label: 'Dashboard',
    icon: 'bi-speedometer2',
    route: '/dashboard'
  },
  {
    id: 'View Transactions',
    label: 'View Transaction',
    icon: 'bi-search',
    route: '/transactions'
  },
  {
    id: AnalysisItems.Weekly,
    label: 'Weekly Expenditure',
    icon: 'bi-calendar-week',
    route: '/analysis'
  },
  {
    id: AnalysisItems.Monthly,
    label: 'Monthly Expenditure',
    icon: 'bi-calendar-month',
    route: '/analysis'
  },
  {
    id: AnalysisItems.Yearly,
    label: 'Yearly Expenditure',
    icon: 'bi-calendar3',
    route: '/analysis'
  },
  {
    id: AnalysisItems.Custom_Range,
    label: 'Custom Range Expenditure',
    icon: 'bi-calendar-range',
    route: '/analysis'
  },
];

  // {
  //   id: 'Add Expenditure',
  //   label: 'Add Expenditure',
  //   icon: 'bi-plus-circle',
  //   route: '/transactions/add-transaction'
  // },