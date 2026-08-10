import { Component, input, output } from '@angular/core';
import { AccountType } from '../../models/account.model';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './app-button.html',
  styleUrl: './app-button.scss',
})
export class AppButton {
  readonly label = input.required<string>();
  readonly variant = input<AccountType>('chequing');
  readonly disabled = input(false);
  readonly clicked = output<void>();
}
