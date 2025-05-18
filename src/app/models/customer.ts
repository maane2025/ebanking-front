export interface Customer {
  id: number;
  name: string;
  email: string;
}
  
  export interface CustomerHistory {
    id: string;
    customerId: string;
    action: string; // e.g., 'created', 'updated', 'purchased'
    details: string;
    timestamp: Date;
    userId?: string; 
  }