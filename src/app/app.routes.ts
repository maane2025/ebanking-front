import { Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { CreditOperationComponent } from './credit-operation/credit-operation.component';
import { DebitOperationComponent } from './debit-operation/debit-operation.component';
import { TransferOperationComponent } from './transfer-operation/transfer-operation.component';
import { NewAccountComponent } from './new-account/new-account.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UnauthorizedComponent } from './auth/unauthorized/unauthorized.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Authentication routes (public)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  // Protected routes
  {
    path: '',
    redirectTo: '/customers',
    pathMatch: 'full',
  },
  {
    path: 'customers',
    component: CustomerListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'customers/new',
    component: CustomerFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'customers/edit/:id',
    component: CustomerFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'customers/:id',
    component: CustomerDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'accounts',
    component: AccountDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'accounts/:accountId',
    component: AccountDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'accounts/:accountId/credit',
    component: CreditOperationComponent,
    canActivate: [authGuard],
  },
  {
    path: 'accounts/:accountId/debit',
    component: DebitOperationComponent,
    canActivate: [authGuard],
  },
  {
    path: 'accounts/:accountId/transfer',
    component: TransferOperationComponent,
    canActivate: [authGuard],
  },
  {
    path: 'customers/:customerId/new-account',
    component: NewAccountComponent,
    canActivate: [authGuard],
  },

  // Fallback route
  { path: '**', redirectTo: '/login' },
];
