import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppButton } from './app-button/app-button';

@NgModule({
  declarations: [AppButton],
  imports: [CommonModule],
  exports: [AppButton],
})
export class SharedModule {}
