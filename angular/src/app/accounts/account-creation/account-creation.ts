import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../../core/account-service';
import { AccountType } from '../../models/account.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-creation',
  standalone: false,
  templateUrl: './account-creation.html',
  styleUrl: './account-creation.scss',
})
export class AccountCreation {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(30)]],
    initialBalance: ['', [Validators.required, Validators.min(0.01)]],
    accountType: ['', [Validators.required]],
  });

  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const value = this.form.getRawValue();
    this.accountService.createAccount(
      value.name,
      value.accountType === 'chequing' ? 'chequing' : 'savings',
      Number(value.initialBalance),
    );
    this.router.navigate(['/accounts']);
  }

  get selectedType(): AccountType {
    return this.form.controls.accountType.value === 'chequing' ? 'chequing' : 'savings';
  }
}
