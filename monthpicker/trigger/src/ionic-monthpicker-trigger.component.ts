import {
  Component, ElementRef, Input, Output, ViewChild, ChangeDetectorRef,
  ChangeDetectionStrategy, OnInit, EventEmitter, HostListener, Optional, Host, SkipSelf
} from '@angular/core';
import {
  FormControl, NG_VALUE_ACCESSOR,
  ControlValueAccessor, ControlContainer, AbstractControl
} from '@angular/forms';
import { Button, Ion } from 'ionic-angular';

import { IonicMonthPickerController } from './../../src/ionic-monthpicker.controller';

/**
 * A custom button trigger component, to open a month calendar into
 * a overlay (modal, popover, page...)
 *
 * This is a custom for form component, that can be used with
 * Angular Reactive forms
 *
 * @see https://blog.angularindepth.com/never-again-be-confused-when-implementing-controlvalueaccessor-in-angular-forms-93b9eee9ee83
 * @see https://stackoverflow.com/questions/44731894/get-access-to-formcontrol-from-the-custom-form-component-in-angular
 */
@Component({
  selector: 'ion-monthpicker-trigger',
  templateUrl: 'ionic-monthpicker-trigger.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: IonicMonthPickerTriggerComponent,
    multi: true
  }]
})
export class IonicMonthPickerTriggerComponent implements OnInit, ControlValueAccessor {

  @ViewChild('btnMonthPicker')
  btnPicker: Button;

  @Output()
  change = new EventEmitter<string>();

  @Output()
  touched = new EventEmitter<TouchEvent>();

  @Input()
  formControlName: string;

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

  protected control: AbstractControl;

  constructor(
    protected elementRef: ElementRef,
    protected changeDetectorRef: ChangeDetectorRef,
    @Optional() @Host() @SkipSelf()
    protected controlContainer: ControlContainer,
    protected monthPickerCtrl: IonicMonthPickerController
  ) { }

  ngOnInit() {

    if (!this.title) {
      this.title = this.defaultTitle;
    }

    this.text = this.title;

    if (this.controlContainer && this.formControlName) {
      this.control = this.controlContainer.control.get(this.formControlName);
    }

    this.changeDetectorRef.detectChanges();
  }

  writeValue(value: any) {

    if (this.control) {
      this.text = this.control.value;
    }

    if (this.target instanceof Array) {
      for (let target of this.target) {
        if (this.target instanceof FormControl) {
          if (target && target.value) {
            this.text = target.value;
          }
        } else if (target instanceof Ion) {
          target = target.getElementRef();
        }

        if (target instanceof ElementRef) {
          const nativeElement = <HTMLElement>target.nativeElement;

          if (nativeElement instanceof HTMLInputElement) {
            nativeElement.value = value;
          } else {
            nativeElement.innerText = value;
          }
        }
      }
    }

    this.changeDetectorRef.detectChanges();
  }

  registerOnChange(fn: any) {
    this.change.subscribe(fn);
  }

  registerOnTouched(fn: any) {
    this.touched.subscribe(fn);
  }

  @HostListener('change', ['$event.target.value'])
  onChange(value: string) {
    this.change.emit(value);
  }

  @HostListener('blur', ['$event'])
  onTouched(event: TouchEvent) {
    this.touched.emit(event);
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
