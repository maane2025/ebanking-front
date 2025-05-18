import { Injectable } from '@angular/core';
import { Customer, CustomerHistory } from '../models/customer';
import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = `http://localhost:8080/customers`;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: Omit<Customer, 'id'>): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(id: string, customer: Partial<Customer>): Observable<Customer> {
    return this.http.patch<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCustomerHistory(id: string): Observable<CustomerHistory[]> {
    return this.http.get<CustomerHistory[]>(`${this.apiUrl}/${id}/history`);
  }
}
