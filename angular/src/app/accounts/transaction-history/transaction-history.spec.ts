import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { TransactionHistory } from './transaction-history';

describe('TransactionHistory', () => {
  let component: TransactionHistory;
  let fixture: ComponentFixture<TransactionHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule],
      declarations: [TransactionHistory],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionHistory);
    fixture.componentRef.setInput('id', 'test-account-id');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
