import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { BankAccount } from '../models/account';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  template: ''
})
export abstract class OperationBaseComponent implements OnInit {
  account?: BankAccount;
  isLoading = false;
  accountId: string;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected accountService: AccountService,
    protected snackBar: MatSnackBar
  ) {
    this.accountId = this.route.snapshot.paramMap.get('accountId') || '';
  }

  ngOnInit(): void {
    this.loadAccount();
  }

  loadAccount(): void {
    this.isLoading = true;
    this.accountService.getAccount(this.accountId).subscribe({
      next: (account) => {
        this.account = account;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load account', err);
        this.isLoading = false;
        this.snackBar.open('Failed to load account', 'Close', { duration: 3000 });
      }
    });
  }

  abstract performOperation(): void;

  protected showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.router.navigate(['/accounts', this.accountId]);
  }

  protected showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}