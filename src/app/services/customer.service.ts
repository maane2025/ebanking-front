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

  searchCustomers(keyword: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/search`, {
      params: { keyword }
    });
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: Omit<Customer, 'id'>): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(id: number, customer: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
