import { Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';

export const routes: Routes = [
    { path: '', redirectTo: '/customers', pathMatch: 'full' },
    { path: 'customers', component: CustomerListComponent },
    { path: 'customers/:id', component: CustomerDetailsComponent },
    { path: '**', redirectTo: '/customers' }
];
