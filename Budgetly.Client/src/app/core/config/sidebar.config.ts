import { SidebarItem } from '../models/sidebar.model';

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 0,
    label: 'Dashboard',
    icon: 'bi-speedometer2',
    route: '/dashboard'
  },
  {
    id: 1,
    label: 'Add Expenditure',
    icon: 'bi-plus-circle',
    route: '/transactions'
  },
  {
    id: 2,
    label: 'Weekly Expenditure',
    icon: 'bi-calendar-week',
    route: '/analysis'
  },
  {
    id: 3,
    label: 'Monthly Expenditure',
    icon: 'bi-calendar-month',
    route: '/analysis'
  },
  {
    id: 4,
    label: 'Yearly Expenditure',
    icon: 'bi-calendar3',
    route: '/analysis'
  },
  {
    id: 5,
    label: 'Custom Range Expenditure',
    icon: 'bi-calendar-range',
    route: '/analysis'
  },
  {
    id: 6,
    label: 'Search Transaction',
    icon: 'bi-search',
    route: '/transactions'
  }
];
