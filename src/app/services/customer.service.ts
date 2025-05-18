import { Injectable } from '@angular/core';
import { Customer, CustomerHistory } from '../models/customer';
import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = `http://localhost:8080/customers`;

  constructor(private http: HttpClient) {}
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  searchCustomers(keyword: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/search`, {
      params: { keyword },
    });
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: Omit<Customer, 'id'>): Observable<Customer> {
    console.log('Creating customer with data:', customer);
    console.log('API URL:', this.apiUrl);
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(
    id: number,
    customer: Partial<Customer>
  ): Observable<Customer> {
    console.log('Service: Updating customer with ID:', id);
    console.log('Update data:', customer);
    console.log('Update URL:', `${this.apiUrl}/${id}`);
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    console.log('Service: Deleting customer with ID:', id);
    console.log('Delete URL:', `${this.apiUrl}/${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
