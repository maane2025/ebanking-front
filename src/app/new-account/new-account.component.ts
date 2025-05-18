import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService, NewAccountRequest } from '../services/account.service';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-new-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
})
export class NewAccountComponent implements OnInit {
  accountForm;
  isLoading = false;
  customerId: string;
  customer?: Customer;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.customerId = this.route.snapshot.paramMap.get('customerId') || '';
    this.accountForm = this.fb.group({
      type: ['CurrentAccount', Validators.required],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    if (this.customerId) {
      this.loadCustomer(Number(this.customerId));
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
        this.snackBar.open('Failed to load customer', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onSubmit(): void {
    if (this.accountForm.invalid) {
      console.log('Form is invalid:', this.accountForm.errors);
      return;
    }

    this.isLoading = true;
    console.log('Creating new account for customer:', this.customerId);

    // Create account data with the correct type
    const accountData: NewAccountRequest = {
      type: this.accountForm.value.type as 'CurrentAccount' | 'SavingAccount',
      balance: Number(this.accountForm.value.initialBalance),
      customerId: Number(this.customerId),
    };

    // Add account-specific fields based on the account type
    if (accountData.type === 'CurrentAccount') {
      accountData.overDraft = 0; // Default overdraft
    } else if (accountData.type === 'SavingAccount') {
      accountData.interestRate = 5.5; // Default interest rate
    }

    console.log('Account data:', accountData);

    // This is a placeholder - you'll need to implement the createAccount method in your AccountService
    this.accountService.createAccount(accountData).subscribe({
      next: (account) => {
        console.log('Account created successfully:', account);
        this.showSuccessMessage('Account created successfully');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to create account', err);
        this.showErrorMessage(
          'Failed to create account: ' + (err.message || 'Unknown error')
        );
        this.isLoading = false;
      },
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.router.navigate(['/customers', this.customerId]);
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
