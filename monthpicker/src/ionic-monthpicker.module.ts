import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';

import { IonicMonthPickerComponent } from './ionic-monthpicker.component';
import { IonicMonthPickerTriggerComponent } from './../trigger/src/ionic-monthpicker-trigger.component';
import { IonicMonthPickerController } from './ionic-monthpicker.controller';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  declarations: [
    IonicMonthPickerComponent,
    IonicMonthPickerTriggerComponent
  ],
  providers: [
    IonicMonthPickerController
  ],
  exports: [
    IonicMonthPickerComponent,
    IonicMonthPickerTriggerComponent
  ],
  entryComponents: [
    IonicMonthPickerComponent,
    IonicMonthPickerTriggerComponent
  ]
})
export class IonicMonthPickerModule {}
