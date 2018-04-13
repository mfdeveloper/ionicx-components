import { Button } from 'ionic-angular';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IonicMonthPickerController } from './../../src/ionic-monthpicker.controller';

/**
 * Generated class for the IonicMonthPickerTriggerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ion-monthpicker-trigger',
  templateUrl: 'ionic-monthpicker-trigger.html'
})
export class IonicMonthPickerTriggerComponent {

  @ViewChild('btnMonthPicker')
  btnPicker: Button;

  @Input()
  title = 'Select a month';

  @Input()
  text = this.title;

  @Input()
  lang: string;

  @Input()
  cancelLabel: string;

  @Input()
  monthLabels: string[];

  @Input()
  container: {
    type?: string;
    opts?: any;
  } = {
    type: 'modal'
  };

  @Input()
  target: any[] | any;

  @Input()
  changeBtnTitle = true;

  @Input()
  color = 'primary';

  @Input()
  round = false;

  @Input()
  full = false;

  @Input()
  large = false;

  @Input()
  outline = false;

  constructor(
    protected elementRef: ElementRef,
    protected monthPickerCtrl: IonicMonthPickerController
  ) { }

  openPicker() {

    if (this.changeBtnTitle) {
      if (this.target instanceof Array && this.target.indexOf(this) === -1) {
        this.target.push(this);
      } else if (!this.target) {
        this.target = this;
      }
    }

    const options: any = {
      title: this.title,
      container: this.container,
      data: {
        target: this.target
      }
    };

    if (this.lang) {
      options.lang = this.lang;
    }

    if (this.cancelLabel) {
      options.cancelLabel = this.cancelLabel;
    }

    if (this.monthLabels) {
      options.monthLabels = {};
      options.monthLabels[this.lang] = this.monthLabels;
    }

    const overlay = this.monthPickerCtrl.create(options);
    overlay.present();
  }
}
