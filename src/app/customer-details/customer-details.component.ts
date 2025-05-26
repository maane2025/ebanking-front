import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { AccountService } from '../services/account.service';
import { Customer } from '../models/customer';
import { BankAccount } from '../models/account';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css'],
})
export class CustomerDetailsComponent implements OnInit {
  customer?: Customer;
  accounts: BankAccount[] = [];
  isLoading = false;
  activeTab = 0;

  displayedColumns: string[] = ['id', 'type', 'balance', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCustomer(+id);
      this.loadCustomerAccounts(+id);
    }
  }

  loadCustomer(id: number): void {
    this.isLoading = true;
    this.customerService.getCustomer(id).subscribe({
      next: (customer) => {
        this.customer = customer;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load customer', err);
        this.isLoading = false;
      },
    });
  }

  loadCustomerAccounts(customerId: number): void {
    this.isLoading = true;
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts.filter(
          (acc) => acc.customer.id === customerId
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load accounts', err);
        this.isLoading = false;
      },
    });
  }

  viewAccount(accountId: string): void {
    this.router.navigate(['/accounts', accountId]);
  }

  viewAllAccounts(): void {
    if (this.customer) {
      // Navigate to accounts page with customer ID as query parameter
      this.router.navigate(['/accounts'], {
        queryParams: { customerId: this.customer.id },
      });
    }
  }

  createAccount(): void {
    if (this.customer) {
      this.router.navigate(['/customers', this.customer.id, 'new-account']);
    }
  }
}
