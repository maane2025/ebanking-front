import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OperationBaseComponent } from '../operation-base/operation-base.component';
import { DebitRequest } from '../models/account';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-debit-operation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: '../operation-base/operation-base.component.html',
  styleUrls: ['./debit-operation.component.css']
})
export class DebitOperationComponent extends OperationBaseComponent {
  operationForm;
  
  constructor(
    route: ActivatedRoute,
    router: Router,
    accountService: AccountService,
    snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    super(route, router, accountService, snackBar);
    this.operationForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required]
    });
  }

  performOperation(): void {
    if (this.operationForm.invalid || !this.account) return;

    this.isLoading = true;
    const request: DebitRequest = {
      accountId: this.account.id,
      amount: Number(this.operationForm.value.amount),
      description: this.operationForm.value.description ?? ''
    };

    this.accountService.debit(request).subscribe({
      next: () => {
        this.showSuccessMessage('Account debited successfully');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to debit account', err);
        this.showErrorMessage('Failed to debit account');
        this.isLoading = false;
      }
    });
  }
}
