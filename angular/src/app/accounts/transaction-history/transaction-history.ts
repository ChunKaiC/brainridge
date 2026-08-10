import { Component, computed, inject, input, signal } from '@angular/core';
import { AccountService } from '../../core/account-service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction-history',
  standalone: false,
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.scss',
  providers: [CurrencyPipe, DatePipe],
})
export class TransactionHistory {
  private readonly currencyPipe = inject(CurrencyPipe);
  private readonly datePipe = inject(DatePipe);

  readonly id = input.required<string>();
  readonly searchTerm = signal<string>('');
  
  private readonly accountService: AccountService = inject(AccountService);
  readonly account = computed(() => this.accountService.getAccount(this.id()));
  readonly transactions = computed(() => {
    const accountId = this.id();
    const term = this.searchTerm().trim().toLowerCase();

    const enriched = this.accountService.getTransactions(accountId).map((transaction) => {
      const outgoing = transaction.senderId === accountId;
      const counterpartyId = outgoing ? transaction.receiverId : transaction.senderId;

      return {
        ...transaction,
        outgoing,
        counterparty: this.accountService.getAccount(counterpartyId)?.name ?? 'Unknown account',
      };
    });

    if (!term) {
      return enriched;
    }

    return enriched.filter((transaction) =>
      [
        `[${this.datePipe.transform(transaction.date, 'fullDate')}]`,
        transaction.outgoing ? 'sent' : 'received',
        this.currencyPipe.transform(transaction.amount) ?? '',
        transaction.outgoing ? 'to' : 'from',
        transaction.counterparty,
        transaction.notes,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  });
}
