import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccount, AccountHistory, AccountOperation, TransferRequest, DebitRequest, CreditRequest } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  private apiUrl = `http://localhost:8080/accounts`;

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.apiUrl);
  }

  getAccount(accountId: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.apiUrl}/${accountId}`);
  }

  getAccountHistory(accountId: string, page: number = 0, size: number = 5): Observable<AccountHistory> {
    return this.http.get<AccountHistory>(`${this.apiUrl}/${accountId}/pageOperations`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

  getAccountOperations(accountId: string): Observable<AccountOperation[]> {
    return this.http.get<AccountOperation[]>(`${this.apiUrl}/${accountId}/operations`);
  }

  transfer(transferRequest: TransferRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/transfer`, transferRequest);
  }

  debit(debitRequest: DebitRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/debit`, debitRequest);
  }

  credit(creditRequest: CreditRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/credit`, creditRequest);
  }
}