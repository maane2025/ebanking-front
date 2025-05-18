import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {
  BankAccount,
  AccountHistory,
  AccountOperation,
  TransferRequest,
  DebitRequest,
  CreditRequest,
} from '../models/account';

// Interface for creating a new account
export interface NewAccountRequest {
  // Common fields for all account types
  type: 'CurrentAccount' | 'SavingAccount';
  balance: number;
  customerId: number;

  // Account-specific fields
  overDraft?: number; // For CurrentAccount
  interestRate?: number; // For SavingAccount
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = `http://localhost:8080/accounts`;

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<BankAccount[]> {
    console.log('Service: Getting all accounts from URL:', this.apiUrl);
    return this.http.get<BankAccount[]>(this.apiUrl).pipe(
      tap((accounts) => {
        console.log('Service: Received accounts data:', accounts);
        if (accounts.length === 0) {
          console.warn('Service: No accounts returned from API');
        } else {
          console.log('Service: First account structure:', accounts[0]);

          // Check if the API response uses customerDTO instead of customer
          if (
            accounts[0].hasOwnProperty('customerDTO') &&
            !accounts[0].hasOwnProperty('customer')
          ) {
            console.log('Service: Converting customerDTO to customer');
            // Convert customerDTO to customer for each account
            accounts.forEach((account: any) => {
              account.customer = account.customerDTO;
              delete account.customerDTO;
            });
          }
        }
      }),
      catchError((error) => {
        console.error('Service: Error fetching accounts:', error);
        return throwError(() => error);
      })
    );
  }

  getAccount(accountId: string): Observable<BankAccount> {
    console.log('Service: Getting account with ID:', accountId);
    return this.http.get<BankAccount>(`${this.apiUrl}/${accountId}`).pipe(
      tap((account) => {
        console.log('Service: Received account data:', account);

        // Check if the API response uses customerDTO instead of customer
        if (
          account.hasOwnProperty('customerDTO') &&
          !account.hasOwnProperty('customer')
        ) {
          console.log('Service: Converting customerDTO to customer');
          // Convert customerDTO to customer
          (account as any).customer = (account as any).customerDTO;
          delete (account as any).customerDTO;
        }
      }),
      catchError((error) => {
        console.error('Service: Error fetching account:', error);
        return throwError(() => error);
      })
    );
  }

  getAccountHistory(
    accountId: string,
    page: number = 0,
    size: number = 5
  ): Observable<AccountHistory> {
    console.log(
      'Service: Getting account history for ID:',
      accountId,
      'page:',
      page,
      'size:',
      size
    );
    return this.http.get<AccountHistory>(
      `${this.apiUrl}/${accountId}/pageOperations`,
      {
        params: new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString()),
      }
    );
  }

  getAccountOperations(accountId: string): Observable<AccountOperation[]> {
    console.log('Service: Getting account operations for ID:', accountId);
    return this.http.get<AccountOperation[]>(
      `${this.apiUrl}/${accountId}/operations`
    );
  }

  transfer(transferRequest: TransferRequest): Observable<void> {
    console.log('Service: Transferring funds', transferRequest);
    return this.http.post<void>(`${this.apiUrl}/transfer`, transferRequest);
  }

  debit(debitRequest: DebitRequest): Observable<void> {
    console.log('Service: Debiting account', debitRequest);
    return this.http.post<void>(`${this.apiUrl}/debit`, debitRequest);
  }

  credit(creditRequest: CreditRequest): Observable<void> {
    console.log('Service: Crediting account', creditRequest);
    return this.http.post<void>(`${this.apiUrl}/credit`, creditRequest);
  }

  createAccount(accountData: NewAccountRequest): Observable<BankAccount> {
    console.log('Service: Creating new account', accountData);

    // Ensure the account type is valid
    if (
      accountData.type !== 'CurrentAccount' &&
      accountData.type !== 'SavingAccount'
    ) {
      console.error('Invalid account type:', accountData.type);
      return throwError(
        () =>
          new Error(
            'Invalid account type. Must be CurrentAccount or SavingAccount.'
          )
      );
    }

    // Add default values for account-specific fields if not provided
    if (
      accountData.type === 'CurrentAccount' &&
      accountData.overDraft === undefined
    ) {
      accountData.overDraft = 0; // Default overdraft for current accounts
    }

    if (
      accountData.type === 'SavingAccount' &&
      accountData.interestRate === undefined
    ) {
      accountData.interestRate = 5.5; // Default interest rate for savings accounts
    }

    // Log the final request data
    console.log('Service: Sending account creation request:', accountData);

    // Make the API call with error handling
    return this.http.post<BankAccount>(this.apiUrl, accountData).pipe(
      tap((account) => {
        console.log('Service: Account created successfully:', account);
      }),
      catchError((error) => {
        console.error('Service: Error creating account:', error);
        return throwError(
          () =>
            new Error(
              'Failed to create account: ' + (error.message || 'Unknown error')
            )
        );
      })
    );
  }
}
