import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { BankAccount, AccountHistory, AccountOperation } from '../models/account';
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
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
  
  ],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  account?: BankAccount;
  operations: AccountOperation[] = [];
  accountHistory?: AccountHistory;
  isLoading = false;
  activeTab = 0;
  
  // Pagination
  pageSize = 5;
  currentPage = 0;
  totalOperations = 0;
  
  displayedColumns: string[] = ['date', 'type', 'amount', 'description'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    const accountId = this.route.snapshot.paramMap.get('accountId');
    if (accountId) {
      this.loadAccount(accountId);
      this.loadAccountOperations(accountId);
    }
  }

  loadAccount(accountId: string): void {
    this.isLoading = true;
    this.accountService.getAccount(accountId).subscribe({
      next: (account) => {
        this.account = account;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load account', err);
        this.isLoading = false;
      }
    });
  }

  loadAccountOperations(accountId: string): void {
    this.isLoading = true;
    this.accountService.getAccountOperations(accountId).subscribe({
      next: (operations) => {
        this.operations = operations;
        this.totalOperations = operations.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load operations', err);
        this.isLoading = false;
      }
    });
  }

  loadAccountHistory(accountId: string): void {
    this.isLoading = true;
    this.accountService.getAccountHistory(accountId, this.currentPage, this.pageSize)
      .subscribe({
        next: (history) => {
          this.accountHistory = history;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load account history', err);
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.account) {
      this.loadAccountHistory(this.account.id);
    }
  }

  performOperation(operationType: string): void {
    if (this.account) {
      this.router.navigate([`/accounts/${this.account.id}/${operationType}`]);
    }
  }
}