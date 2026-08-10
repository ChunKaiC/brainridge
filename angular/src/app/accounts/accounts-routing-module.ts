import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountCreation } from './account-creation/account-creation';
import { AccountList } from './account-list/account-list';
import { TransactionHistory } from './transaction-history/transaction-history';
import { Transfer } from './transfer/transfer';

const routes: Routes = [
  {
    path: 'accounts',
    children: [
      { path: '', component: AccountList },
      { path: 'new', component: AccountCreation },
      { path: ':id/history', component: TransactionHistory },
      { path: 'transfer', component: Transfer },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}
