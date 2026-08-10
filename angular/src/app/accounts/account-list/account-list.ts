import { Component, inject } from '@angular/core';
import { AccountService } from '../../core/account-service';

@Component({
  selector: 'app-account-list',
  standalone: false,
  templateUrl: './account-list.html',
  styleUrl: './account-list.scss',
})
export class AccountList {
  private readonly accountService: AccountService = inject(AccountService);
  readonly accounts = this.accountService.accounts;
}
