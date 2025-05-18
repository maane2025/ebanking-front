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
    MatDatepickerModule,
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
})
export class CustomerFormComponent implements OnInit {
  isEditMode = false;
  customerId?: string;
  formErrors: any = null;

  customerForm;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    console.log('CustomerFormComponent initialized');
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route param id:', id);

    if (id && id !== 'new') {
      this.isEditMode = true;
      this.customerId = id;
      console.log('Edit mode activated for customer ID:', id);
      this.loadCustomer(id);
    } else {
      console.log('Create new customer mode');
    }
  }

  loadCustomer(id: string): void {
    this.customerService.getCustomer(Number(id)).subscribe({
      next: (customer) => {
        this.customerForm.patchValue({
          name: customer.name,
          email: customer.email,
        });
      },
      error: (err) => console.error('Failed to load customer', err),
    });
  }

  onSubmit(): void {
    console.log('Form submitted');

    if (this.customerForm.invalid) {
      console.log('Form is invalid:', this.customerForm.errors);
      return;
    }

    const customerData = this.customerForm.value as Omit<Customer, 'id'>;
    console.log('Customer data to submit:', customerData);

    if (this.isEditMode && this.customerId) {
      console.log('Updating customer with ID:', this.customerId);
      this.customerService
        .updateCustomer(Number(this.customerId), customerData)
        .subscribe({
          next: (response) => {
            console.log('Customer updated successfully:', response);
            this.router.navigate(['/customers', this.customerId]);
          },
          error: (err) => {
            console.error('Failed to update customer', err);
            alert(
              'Failed to update customer: ' + (err.message || 'Unknown error')
            );
          },
        });
    } else {
      console.log('Creating new customer');
      this.customerService.createCustomer(customerData).subscribe({
        next: (customer) => {
          console.log('Customer created successfully:', customer);
          this.router.navigate(['/customers', customer.id]);
        },
        error: (err) => {
          console.error('Failed to create customer', err);
          alert(
            'Failed to create customer: ' + (err.message || 'Unknown error')
          );
        },
      });
    }
  }

  debugForm(): void {
    console.log('Debug form clicked');
    this.formErrors = {
      formValue: this.customerForm.value,
      formStatus: this.customerForm.status,
      formValid: this.customerForm.valid,
      formInvalid: this.customerForm.invalid,
      formErrors: this.customerForm.errors,
      nameErrors: this.customerForm.get('name')?.errors,
      emailErrors: this.customerForm.get('email')?.errors,
    };
    console.log('Form debug info:', this.formErrors);
  }
}
