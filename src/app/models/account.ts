export interface BankAccount {
    id: string;
    type: string;
    balance: number;
    customerId: number;
    createdAt: string;
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
    accountOperations: AccountOperation[];
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