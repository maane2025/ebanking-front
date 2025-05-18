export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface BankAccount {
  id: string;
  type: string;
  balance: number;
  createdAt: string;
  status: string | null;
  customer: Customer; // Changed from customerDTO to customer
  // Account-specific fields
  overDraft?: number;
  interestRate?: number;
}

export interface AccountOperation {
  id: number;
  operationDate: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  description: string;
}

export interface AccountHistory {
  accountId: string;
  balance: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  accountOperationDTOS: AccountOperation[]; // Note the field name change from API
}

export interface TransferRequest {
  accountSource: string;
  accountDestination: string;
  amount: number;
  description: string;
}

export interface DebitRequest {
  accountId: string;
  amount: number;
  description: string;
}

export interface CreditRequest {
  accountId: string;
  amount: number;
  description: string;
}
