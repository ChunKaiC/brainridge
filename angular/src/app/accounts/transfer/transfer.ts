import { Component, inject, signal } from '@angular/core';
import { AccountService } from '../../core/account-service';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';

function differentAccounts(group: AbstractControl): ValidationErrors | null {
  const senderId = group.get('senderId')?.value;
  const receiverId = group.get('receiverId')?.value;

  if (receiverId && senderId && senderId === receiverId) {
    return { sameAccount: true };
  }
  return null;
}

function sufficientBalance(accountService: AccountService): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const senderId = group.get('senderId')?.value;
    const amount = Number(group.get('amount')?.value);

    if (!senderId || !amount) {
      return null;
    }

    const sender = accountService.getAccount(senderId);
    if (sender && sender.balance < amount) {
      return { insufficientBalance: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-transfer',
  standalone: false,
  templateUrl: './transfer.html',
  styleUrl: './transfer.scss',
})
export class Transfer {
  private readonly accountService: AccountService = inject(AccountService);
  readonly accounts = this.accountService.accounts;

  readonly errorMessage = signal<string | null>(null);

  private readonly router = inject(Router);

  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group(
    {
      senderId: ['', [Validators.required]],
      receiverId: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      notes: [''],
    },
    { validators: [differentAccounts, sufficientBalance(this.accountService)] },
  );

  onSubmit() {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    try {
      this.accountService.transfer(
        value.senderId,
        value.receiverId,
        Number(value.amount),
        value.notes,
      );
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Transaction failed for unknown reasons.',
      );
      return;
    }

    this.router.navigate(['/accounts']);
  }
}
