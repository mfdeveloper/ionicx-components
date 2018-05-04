import { Type } from '@angular/core';
import { NavOptions, ViewController } from 'ionic-angular';

export interface MonthPickerOptions {
    title?: string;
    component?: Type<any>;
    data?: any;
    lang?: string;
    container?: {
        type: string;
        opts?: any;
    };
}

export interface WrapperController {
    [key: string]: {
        controller: Type<IonicController> | any,
        opts?: any
    };
}

export interface IonicOverlay {
    overlay?: ViewController;
    present(navOptions?: NavOptions): Promise<any>;
    dismiss(data?: any, role?: string, navOptions?: NavOptions): Promise<any>;
    onDidDismiss(callback: (data: any, role: string) => void): void;
    onWillDismiss(callback: Function): void;
}

export interface IonicController {
    create(component?: any, data?: {}, opts?: any): IonicOverlay;
}
