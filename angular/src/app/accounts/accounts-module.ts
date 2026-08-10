import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AccountsRoutingModule } from './accounts-routing-module';
import { AccountList } from './account-list/account-list';
import { AccountCreation } from './account-creation/account-creation';
import { Transfer } from './transfer/transfer';
import { TransactionHistory } from './transaction-history/transaction-history';
import { SharedModule } from '../shared/shared-module';

// Material UI
import { MatCard } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AccountList, AccountCreation, Transfer, TransactionHistory],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatCard,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
  ],
})
export class AccountsModule {}
