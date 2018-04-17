import { ModalController, PopoverController } from 'ionic-angular';
import { Injector, Type } from '@angular/core';
import { IonicMonthPickerComponent, IonicController, IonicOverlay } from './ionic-monthpicker.component';
import { Injectable } from '@angular/core';

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
    [key: string]: Type<IonicController>;
}

@Injectable()
export class IonicMonthPickerController {

    containerType = 'modal';

    protected wrapperControllers: WrapperController = {
        'modal': ModalController,
        'popover': PopoverController
    };

    constructor(
        protected injector: Injector
    ) { }

    create(opts: MonthPickerOptions = {}): IonicOverlay {

        opts.container = opts.container || {
            type: this.containerType
        };

        const containerController = this.wrapperControllers[opts.container.type];
        if (!containerController) {
            throw new Error(`The IONIC controller '${opts.container.type}' doesn't exists or this component don't support them`)
        }

        opts.data = opts.data || {};
        if (opts.title) {
            opts.data.title = opts.title;
        }

        if (opts.lang) {
            opts.data.lang = opts.lang;
        }

        const container = this.injector.get<IonicController>(containerController);
        opts.data.container = container;
        if (container instanceof PopoverController) {
            opts.container.opts = opts.container.opts || {};
            opts.container.opts.cssClass = 'popover-monthpicker';
        }

        const containerComp = container.create(
            opts.component || IonicMonthPickerComponent,
            opts.data,
            opts.container.opts
        );

        return containerComp;
    }

    addWrapper(controllerMap: WrapperController): IonicMonthPickerController {
        for (const type in controllerMap) {
            if (controllerMap.hasOwnProperty(type)) {
                this.wrapperControllers[type] = controllerMap[type];
            }
        }
        return this;
    }
}
