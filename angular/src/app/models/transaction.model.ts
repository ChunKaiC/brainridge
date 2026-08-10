export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  date: number;
  notes: string;
}
