import { Component, Type, OnInit, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ViewController, NavParams, NavOptions, Ion, TextInput } from 'ionic-angular';

@Component({
    selector: 'ion-monthpicker',
    templateUrl: './ionic-monthpicker.html',
    styleUrls: ['./ionic-monthpicker.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonicMonthPickerComponent implements OnInit {

    title = 'Select a month';
    monthLabels = {
        'en': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        'pt': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    };
    lang = 'en';
    cancelLabel = 'Cancel';

    protected currentMonth: string;

    protected target: any;

    constructor(
        protected viewCtrl: ViewController,
        protected navParams: NavParams,
        protected changeDetection: ChangeDetectorRef
    ) { }

    ngOnInit() {

        this.title = this.navParams.get('title') || this.title;
        this.lang = this.navParams.get('lang') || this.lang;

        this.target = this.navParams.get('target');
        if (this.target) {
            this.currentMonth = this.getTargetValue(this.target);
        }
        this.changeDetection.detectChanges();
    }

    selectMonth(month: string, event: MouseEvent) {
        const container = this.navParams.get('container');

        if (container) {
            event.stopPropagation();
            event.preventDefault();

            this.currentMonth = month.toUpperCase();

            /**
             * To avoid Ionic problems with detect
             * change after view closes, do set value in target
             * before dismiss()
             */
            this.viewCtrl.onWillDismiss(() => {
                if (this.target instanceof Array) {
                    for (const element of this.target) {
                        this.setTargetValue(this.currentMonth, element);
                    }
                } else {
                    this.setTargetValue(this.currentMonth, this.target);
                }
            });

            this.viewCtrl.dismiss();
        }
    }

    getTargetValue(target?: any): string {
        target = target || this.navParams.get('target');
        let targetWithValue = target instanceof Array ? target[0] : target;

        if (targetWithValue) {
            if (targetWithValue instanceof Ion) {
                targetWithValue = targetWithValue.getElementRef();
            } else if (targetWithValue.text) {
                return targetWithValue.text;
            }
        }

        if (targetWithValue instanceof FormControl || targetWithValue instanceof TextInput) {
            return targetWithValue.value;
        } else if (targetWithValue instanceof ElementRef) {
            const nativeElement = <HTMLElement>targetWithValue.nativeElement;

            if (nativeElement instanceof HTMLInputElement) {
                return nativeElement.value;
            } else {
                return nativeElement.innerText;
            }
        }
    }

    setTargetValue(value: any, target?: any): boolean {
        target = target || this.navParams.get('target');
        let valueChanged = false;

        if (target) {
            if (target instanceof Ion) {
                target = target.getElementRef();
            } else if (target.text) {
                target.text = value;
                valueChanged = true;
            }
        }

        if (target instanceof FormControl) {
            target.setValue(value);
            valueChanged = true;
        } else if (target instanceof TextInput) {
            if (target['setValue']) {
                target['setValue'](value);
                valueChanged = true;
            } else {
                target.writeValue(value);
                valueChanged = true;
            }
        } else if (target instanceof ElementRef) {
            const nativeElement = <HTMLElement>target.nativeElement;

            if (nativeElement instanceof HTMLInputElement) {
                nativeElement.value = value;
                valueChanged = true;
            } else {
                nativeElement.innerText = value;
                valueChanged = true;
            }
        }

        if (valueChanged) {
            this.changeDetection.detectChanges();

            if (typeof target['detectChanges'] === 'function') {
                target.detectChanges();
            }
        }

        return valueChanged;
    }

    cancel() {
        this.viewCtrl.dismiss();
    }

    setMonth(month: string) {
        this.currentMonth = month;
    }

    getMonth(): string {
        return this.currentMonth;
    }

    isSelected(month: string): boolean {
        if (this.currentMonth && month) {
            return this.currentMonth.toUpperCase() === month.toUpperCase();
        }
        return false;
    }
}
