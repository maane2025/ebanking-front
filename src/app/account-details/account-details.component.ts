import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../services/account.service';
import { CustomerService } from '../services/customer.service';
import { HttpClient } from '@angular/common/http';
import {
  BankAccount,
  AccountHistory,
  AccountOperation,
} from '../models/account';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
  ],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css'],
})
export class AccountDetailsComponent implements OnInit {
  account?: BankAccount;
  accounts: BankAccount[] = [];
  operations: AccountOperation[] = [];
  accountHistory?: AccountHistory;
  isLoading = false;
  activeTab = 0;
  customerName?: string;
  apiError?: string;

  // Pagination
  pageSize = 5;
  currentPage = 0;
  totalOperations = 0;

  // Table columns
  displayedColumns: string[] = ['date', 'type', 'amount', 'description'];
  accountsColumns: string[] = [
    'id',
    'type',
    'balance',
    'customer',
    'details',
    'actions',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private customerService: CustomerService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('AccountDetailsComponent initialized');
    const accountId = this.route.snapshot.paramMap.get('accountId');
    console.log('Route param accountId:', accountId);

    if (accountId) {
      this.loadAccount(accountId);
      this.loadAccountOperations(accountId);
      this.loadAccountHistory(accountId);
    } else {
      console.log('No accountId provided, loading all accounts');
      this.loadAllAccounts();
    }
  }

  reloadAccounts(): void {
    this.apiError = undefined;
    this.loadAllAccounts();
  }

  loadAllAccounts(): void {
    console.log('Loading all accounts');
    this.isLoading = true;
    this.accounts = []; // Reset accounts array
    this.apiError = undefined; // Reset API error

    // Check if there's a customerId query parameter to filter accounts
    const customerId = this.route.snapshot.queryParamMap.get('customerId');
    console.log('Query param customerId:', customerId);

    try {
      this.accountService.getAccounts().subscribe({
        next: (accounts) => {
          console.log('All accounts loaded successfully:', accounts);
          console.log('Accounts data type:', typeof accounts);
          console.log('Is accounts an array?', Array.isArray(accounts));

          if (!accounts || !Array.isArray(accounts)) {
            console.error('Invalid accounts data received:', accounts);
            this.apiError =
              'Invalid data format received from API: ' +
              JSON.stringify(accounts);
            this.isLoading = false;
            return;
          }

          // For debugging, log the first account's structure if available
          if (accounts.length > 0) {
            console.log(
              'First account structure:',
              JSON.stringify(accounts[0], null, 2)
            );
            console.log('First account customer:', accounts[0].customer);
          }

          // If customerId is provided, filter accounts by that customer
          if (customerId) {
            console.log('Filtering accounts for customer ID:', customerId);
            try {
              this.accounts = accounts.filter(
                (acc) => acc.customer && acc.customer.id === Number(customerId)
              );
              console.log('Filtered accounts:', this.accounts);

              // Set customer name from the first account's customer
              if (this.accounts.length > 0) {
                this.customerName = this.accounts[0].customer.name;
                console.log(
                  'Set customer name from account:',
                  this.customerName
                );
              } else {
                // If no accounts found for this customer, load customer name directly
                this.customerService.getCustomer(Number(customerId)).subscribe({
                  next: (customer) => {
                    this.customerName = customer.name;
                    console.log(
                      'Set customer name from customer service:',
                      this.customerName
                    );
                  },
                  error: (err) => {
                    console.error('Failed to load customer name', err);
                  },
                });
              }
            } catch (filterError) {
              console.error('Error filtering accounts:', filterError);
            }
          } else {
            this.accounts = accounts;
            this.customerName = undefined;
            console.log('Using all accounts, count:', this.accounts.length);
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load accounts', err);
          this.apiError =
            'Error connecting to API: ' + (err.message || 'Unknown error');
          this.isLoading = false;
        },
      });
    } catch (error) {
      console.error('Exception in loadAllAccounts:', error);
      this.apiError =
        'Exception occurred: ' +
        (error instanceof Error ? error.message : String(error));
      this.isLoading = false;
    }
  }

  selectAccount(accountId: string): void {
    console.log('Account selected:', accountId);
    this.router.navigate(['/accounts', accountId]);
  }

  loadTestData(): void {
    console.log('Loading test data');
    this.isLoading = true;

    // Sample data based on the API response you provided
    const testAccounts = [
      {
        type: 'CurrentAccount',
        id: '06b1bfa6-86d3-462f-83fb-fba79bf0a1c7',
        balance: 705667.435850535,
        createdAt: '2025-05-18T14:09:36.000+00:00',
        status: null,
        customer: {
          id: 2,
          name: 'Hamid',
          email: 'Hamid@gmail.com',
        },
        overDraft: 0,
      },
      {
        type: 'CurrentAccount',
        id: '092b950c-ada7-4de0-8853-a9cc274dc206',
        balance: 951502.780427141,
        createdAt: '2025-05-18T14:09:36.000+00:00',
        status: null,
        customer: {
          id: 1,
          name: 'Ilyas',
          email: 'Ilyassui@gmail.com',
        },
        overDraft: 0,
      },
      {
        type: 'CurrentAccount',
        id: '77f983bd-73d4-4f25-90c9-68cb6f40317c',
        balance: 684980.699797557,
        createdAt: '2025-05-18T14:09:36.000+00:00',
        status: null,
        customer: {
          id: 3,
          name: 'Mohamed',
          email: 'Mohamed@gmail.com',
        },
        overDraft: 0,
      },
      {
        type: 'SavingAccount',
        id: '1e1fec9e-e72b-4b36-9863-0be35f08ee67',
        balance: 709509.310097501,
        createdAt: '2025-05-18T14:09:36.000+00:00',
        status: null,
        customer: {
          id: 2,
          name: 'Hamid',
          email: 'Hamid@gmail.com',
        },
        interestRate: 5.5,
      },
      {
        type: 'SavingAccount',
        id: 'a037ffa4-563e-43dd-8b09-c6fb0e563ac0',
        balance: 613649.385310973,
        createdAt: '2025-05-18T14:09:36.000+00:00',
        status: null,
        customer: {
          id: 1,
          name: 'Ilyas',
          email: 'Ilyassui@gmail.com',
        },
        interestRate: 5.5,
      },
      {
        type: 'SavingAccount',
        id: 'a5da88e3-4c17-4cd1-89a9-ef90d2616adc',
        balance: 543782.135270915,
        createdAt: '2025-05-18T14:09:36.000+00:00',
        status: null,
        customer: {
          id: 3,
          name: 'Mohamed',
          email: 'Mohamed@gmail.com',
        },
        interestRate: 5.5,
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      this.accounts = testAccounts;
      this.isLoading = false;
      console.log('Test data loaded:', this.accounts);
    }, 1000);
  }

  clearCustomerFilter(): void {
    console.log('Clearing customer filter');
    this.router.navigate(['/accounts']);
  }

  testDirectApiCall(): void {
    console.log('Testing direct API call');
    this.isLoading = true;
    this.apiError = undefined;

    // Make a direct HTTP request to the API
    this.http.get('http://localhost:8080/accounts').subscribe({
      next: (response) => {
        console.log('Direct API call successful:', response);

        // Check if the response is valid
        if (Array.isArray(response) && response.length > 0) {
          console.log('API returned valid data');

          // Process the response to match our model
          const accounts = response as any[];
          accounts.forEach((account) => {
            if (account.customerDTO && !account.customer) {
              account.customer = account.customerDTO;
              delete account.customerDTO;
            }
          });

          // Update the accounts array
          this.accounts = accounts as BankAccount[];
          this.isLoading = false;
        } else {
          console.error('API returned invalid data:', response);
          this.apiError =
            'API returned invalid data: ' + JSON.stringify(response);
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Direct API call failed:', err);
        this.apiError =
          'Direct API call failed: ' + (err.message || 'Unknown error');
        this.isLoading = false;
      },
    });
  }

  loadAccount(accountId: string): void {
    console.log('Loading account with ID:', accountId);
    this.isLoading = true;
    this.accountService.getAccount(accountId).subscribe({
      next: (account) => {
        console.log('Account loaded successfully:', account);
        this.account = account;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load account', err);
        this.isLoading = false;
        // Show an error message to the user
        alert('Failed to load account: ' + (err.message || 'Unknown error'));
      },
    });
  }

  loadAccountOperations(accountId: string): void {
    console.log('Loading account operations for ID:', accountId);
    this.isLoading = true;
    this.accountService.getAccountOperations(accountId).subscribe({
      next: (operations) => {
        console.log('Account operations loaded successfully:', operations);
        this.operations = operations;
        this.totalOperations = operations.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load operations', err);
        this.isLoading = false;
        // Show an error message to the user
        alert(
          'Failed to load account operations: ' +
            (err.message || 'Unknown error')
        );
      },
    });
  }

  loadAccountHistory(accountId: string): void {
    console.log(
      'Loading account history for ID:',
      accountId,
      'page:',
      this.currentPage,
      'size:',
      this.pageSize
    );
    this.isLoading = true;
    this.accountService
      .getAccountHistory(accountId, this.currentPage, this.pageSize)
      .subscribe({
        next: (history) => {
          console.log('Account history loaded successfully:', history);
          this.accountHistory = history;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load account history', err);
          this.isLoading = false;
          // Show an error message to the user
          alert(
            'Failed to load account history: ' +
              (err.message || 'Unknown error')
          );
        },
      });
  }

  onPageChange(event: PageEvent): void {
    console.log('Page changed:', event);
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.account) {
      this.loadAccountHistory(this.account.id);
    }
  }

  performOperation(operationType: string): void {
    console.log(
      'Performing operation:',
      operationType,
      'on account:',
      this.account?.id
    );
    if (this.account) {
      this.router.navigate([`/accounts/${this.account.id}/${operationType}`]);
    } else {
      console.error('Cannot perform operation: No account selected');
      alert('Please select an account first');
    }
  }
}
