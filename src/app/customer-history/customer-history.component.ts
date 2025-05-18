import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerHistory } from '../models/customer';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, DatePipe],
  templateUrl: './customer-history.component.html',
  styleUrls: ['./customer-history.component.css']
})
export class CustomerHistoryComponent {
  @Input() history: CustomerHistory[] = [];
  displayedColumns: string[] = ['action', 'details', 'timestamp'];
}