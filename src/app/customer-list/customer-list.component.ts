import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'actions'];
  searchKeyword: string = '';
  isLoading: boolean = false;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load customers', err);
        this.isLoading = false;
      },
    });
  }

  searchCustomers(): void {
    if (this.searchKeyword.trim() === '') {
      this.loadCustomers();
      return;
    }

    this.isLoading = true;
    this.customerService.searchCustomers(this.searchKeyword).subscribe({
      next: (customers) => {
        this.customers = customers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to search customers', err);
        this.isLoading = false;
      },
    });
  }

  editCustomer(id: number): void {
    console.log('Edit customer called with ID:', id);
    this.router.navigate(['/customers/edit', id]);
  }

  deleteCustomer(id: number): void {
    console.log('Delete customer called with ID:', id);
    if (confirm('Are you sure you want to delete this customer?')) {
      this.isLoading = true;
      console.log('Deleting customer with ID:', id);
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          console.log('Customer deleted successfully');
          this.loadCustomers();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to delete customer', err);
          alert(
            'Failed to delete customer: ' + (err.message || 'Unknown error')
          );
          this.isLoading = false;
        },
      });
    } else {
      console.log('Delete cancelled by user');
    }
  }
}
