
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number; // use positive for income, negative for expense
  description: string;
  date: string; // ISO
  type: TransactionType;
}
