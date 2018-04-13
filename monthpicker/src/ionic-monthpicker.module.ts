import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { IonicMonthPickerComponent } from './ionic-monthpicker.component';
import { IonicMonthPickerTriggerComponent } from './../trigger/src/ionic-monthpicker-trigger.component';
// import { IonicMonthPickerTriggerComponent } from './ionic-monthpicker-trigger.component';
import { IonicMonthPickerController } from './ionic-monthpicker.controller';

@NgModule({
  imports: [
    CommonModule,
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
