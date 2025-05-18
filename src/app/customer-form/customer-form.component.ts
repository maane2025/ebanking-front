import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  isEditMode = false;
  customerId?: string;

  customerForm;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.customerId = id;
      this.loadCustomer(id);
    }
  }

  loadCustomer(id: string): void {
    this.customerService.getCustomer(id).subscribe({
      next: (customer) => {
        this.customerForm.patchValue({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address
        });
      },
      error: (err) => console.error('Failed to load customer', err)
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) return;

    const customerData = this.customerForm.value as Omit<Customer, 'id'>;

    if (this.isEditMode && this.customerId) {
      this.customerService.updateCustomer(this.customerId, customerData).subscribe({
        next: () => this.router.navigate(['/customers', this.customerId]),
        error: (err) => console.error('Failed to update customer', err)
      });
    } else {
      this.customerService.createCustomer(customerData).subscribe({
        next: (customer) => this.router.navigate(['/customers', customer.id]),
        error: (err) => console.error('Failed to create customer', err)
      });
    }
  }
}