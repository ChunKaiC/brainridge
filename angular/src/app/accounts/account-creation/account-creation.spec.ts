import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppButton } from '../../shared/app-button/app-button';
import { AccountCreation } from './account-creation';

describe('AccountCreation', () => {
  let component: AccountCreation;
  let fixture: ComponentFixture<AccountCreation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
      ],
      declarations: [AccountCreation, AppButton],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCreation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
