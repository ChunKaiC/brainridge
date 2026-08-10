import { Service, signal } from '@angular/core';
import { Account, AccountType } from '../models/account.model';
import { Transaction } from '../models/transaction.model';

@Service()
export class AccountService {
  private readonly _accounts = signal<Account[]>([]);
  readonly accounts = this._accounts.asReadonly();

  private readonly _transactions = signal<Transaction[]>([]);
  readonly transactions = this._transactions.asReadonly();

  createAccount(name: string, type: AccountType, initialBalance: number) {
    const newAccount: Account = {
      id: crypto.randomUUID(),
      name,
      type,
      balance: initialBalance,
    };
    this._accounts.update((accounts) => [...accounts, newAccount]);
  }

  getAccount(id: string): Account | undefined {
    return this._accounts().find((account) => account.id === id);
  }

  transfer(senderId: string, receiverId: string, amount: number, notes?: string) {
    const sender = this.getAccount(senderId);
    const receiver = this.getAccount(receiverId);

    if (sender === undefined) {
      throw new Error('Sender ID invalid.');
    }
    if (receiver === undefined) {
      throw new Error('Receiver ID invalid.');
    }
    if (sender.id === receiver.id) {
      throw new Error('Cannot transfer to the same account.');
    }
    if (amount <= 0) {
      throw new Error('Transfer amount must be positive');
    }
    if (sender.balance < amount) {
      throw new Error('Sender balance insufficient.');
    }

    const newSender: Account = { ...sender, balance: sender.balance - amount };
    const newReceiver: Account = { ...receiver, balance: receiver.balance + amount };
    this._accounts.update((accounts) =>
      accounts.map((account) => {
        if (account.id === senderId) {
          return newSender;
        } else if (account.id === receiverId) {
          return newReceiver;
        } else {
          return account;
        }
      }),
    );

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      senderId,
      receiverId,
      amount,
      date: Date.now(),
      notes: notes === undefined ? '' : notes,
    };
    this._transactions.update((transactions) => [...transactions, newTransaction]);
  }

  getTransactions(id: string) {
    return this._transactions().filter(
      (transaction) => transaction.senderId === id || transaction.receiverId === id,
    );
  }
}
