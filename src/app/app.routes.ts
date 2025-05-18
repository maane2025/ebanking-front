import { Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { CreditOperationComponent } from './credit-operation/credit-operation.component';
import { DebitOperationComponent } from './debit-operation/debit-operation.component';
import { TransferOperationComponent } from './transfer-operation/transfer-operation.component';
import { NewAccountComponent } from './new-account/new-account.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'customers/edit/:id', component: CustomerFormComponent },
  { path: 'customers/:id', component: CustomerDetailsComponent },
  // { path: 'accounts', component: AccountListComponent },
  { path: 'accounts', component: AccountDetailsComponent },
  { path: 'accounts/:accountId', component: AccountDetailsComponent },
  { path: 'accounts/:accountId/credit', component: CreditOperationComponent },
  { path: 'accounts/:accountId/debit', component: DebitOperationComponent },
  {
    path: 'accounts/:accountId/transfer',
    component: TransferOperationComponent,
  },
  { path: 'customers/:customerId/new-account', component: NewAccountComponent },
  { path: '**', redirectTo: '/customers' },
];
