import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../services/account.service';
import { TransferRequest } from '../models/account';

@Component({
  selector: 'app-transfer-operation',
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
  templateUrl: './transfer-operation.component.html',
  styleUrls: ['./transfer-operation.component.css']
})
export class TransferOperationComponent {
  transferForm;
  isLoading = false;
  accountId: string;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.accountId = this.route.snapshot.paramMap.get('accountId') || '';
    this.transferForm = this.fb.group({
      accountDestination: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.transferForm.invalid) {
      console.log('Form is invalid:', this.transferForm.errors);
      return;
    }

    this.isLoading = true;
    console.log('Submitting transfer form');
    
    const request: TransferRequest = {
      accountSource: this.accountId,
      accountDestination: this.transferForm.value.accountDestination || '',
      amount: Number(this.transferForm.value.amount),
      description: this.transferForm.value.description || ''
    };

    console.log('Transfer request:', request);

    this.accountService.transfer(request).subscribe({
      next: () => {
        console.log('Transfer successful');
        this.showSuccessMessage('Transfer completed successfully');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to transfer funds', err);
        this.showErrorMessage('Failed to transfer funds: ' + (err.message || 'Unknown error'));
        this.isLoading = false;
      }
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.router.navigate(['/accounts', this.accountId]);
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
