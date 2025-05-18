import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { Customer, CustomerHistory } from '../models/customer';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomerHistoryComponent } from '../customer-history/customer-history.component';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    CustomerHistoryComponent
  ],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  customer?: Customer;
  history: CustomerHistory[] = [];
  activeTab = 'details';

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCustomer(id);
      this.loadCustomerHistory(id);
    }
  }

  loadCustomer(id: string): void {
    this.customerService.getCustomer(id).subscribe({
      next: (customer) => this.customer = customer,
      error: (err) => console.error('Failed to load customer', err)
    });
  }

  loadCustomerHistory(id: string): void {
    this.customerService.getCustomerHistory(id).subscribe({
      next: (history) => this.history = history,
      error: (err) => console.error('Failed to load customer history', err)
    });
  }
}