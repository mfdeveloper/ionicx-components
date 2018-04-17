import { FormControl } from '@angular/forms';
import { Button } from 'ionic-angular';
import {
  Component, ElementRef, Input, Output, ViewChild, ChangeDetectorRef,
  ChangeDetectionStrategy, OnInit, EventEmitter
} from '@angular/core';

import { IonicMonthPickerController } from './../../src/ionic-monthpicker.controller';

/**
 * Generated class for the IonicMonthPickerTriggerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ion-monthpicker-trigger',
  templateUrl: 'ionic-monthpicker-trigger.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonicMonthPickerTriggerComponent implements OnInit {

  @ViewChild('btnMonthPicker')
  btnPicker: Button;

  @Output()
  afterRender = new EventEmitter<any>();

  @Input()
  title: string;

  @Input()
  text: string;

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

  @Input()
  itemStart = false;

  @Input()
  itemEnd = false;

  protected defaultTitle = 'Select a month';

  constructor(
    protected elementRef: ElementRef,
    protected changeDetectorRef: ChangeDetectorRef,
    protected monthPickerCtrl: IonicMonthPickerController
  ) { }

  ngOnInit() {

    if (!this.title) {
      this.title = this.defaultTitle;
    }

    this.text = this.title;

    this.afterRender.subscribe(() => {
      if (this.target instanceof Array) {
        const target: FormControl = this.target.find(el => el instanceof FormControl ? true : false);
        if (target && target.value) {
          this.text = target.value;
        } else {
          this.text = this.title;
        }
      } else {
        this.text = this.title;
      }

      this.changeDetectorRef.detectChanges();
    });

    this.changeDetectorRef.detectChanges();
  }

  openPicker(event: Event) {

    event.stopPropagation();
    event.preventDefault();

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

  detectChanges() {
    this.changeDetectorRef.detectChanges();
  }
}
