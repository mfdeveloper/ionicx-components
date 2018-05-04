import { WrapperController, MonthPickerOptions, IonicOverlay, IonicController } from './ionic-monthpicker-options';
import { Injector, Type, Injectable } from '@angular/core';
import { ModalController, PopoverController, NavController, NavOptions, App } from 'ionic-angular';
import { IonicMonthPickerComponent } from './ionic-monthpicker.component';


@Injectable()
export class IonicMonthPickerController {

    protected containerTypeDefault = 'modal';

    protected wrapperControllers: WrapperController = {
        modal: {
            controller: ModalController
        },
        popover: {
            controller: PopoverController,
            opts: {
                cssClass: 'popover-monthpicker'
            }
        },
        page: {
            controller: NavController
        }
    };

    constructor(
        protected injector: Injector,
        protected app: App
    ) { }

    create(opts: MonthPickerOptions = {}): IonicOverlay {

        opts.container = opts.container || {
            type: this.containerTypeDefault
        };

        const wrapperContainer = this.wrapperControllers[opts.container.type];
        if (!wrapperContainer || !wrapperContainer.controller) {
            throw new Error(`The IONIC controller '${opts.container.type}' not exists or this component don't support them`);
        }

        opts.data = opts.data || {};
        if (opts.title) {
            opts.data.title = opts.title;
        }

        if (opts.lang) {
            opts.data.lang = opts.lang;
        }

        let container: IonicController | NavController = null;

        /**
         * Injector doesn't works to inject `NavController`,
         * because this require at least a `<ion-nav>` component
         * into your IONIC app.
         *
         * @see https://github.com/ionic-team/ionic/issues/9581
         */
        if (wrapperContainer.controller === NavController) {

            opts.data.container = this.app['getActiveNavs'] ? this.app['getActiveNavs']()[0] : this.app.getActiveNav();
            if (!opts.data.container) {
                throw new Error(`At least one NavController is required to use a container type "${opts.container.type}"`);
            }

            const polyfillOverlay = this.createNavOverlay(opts.data.container, opts);
            return new polyfillOverlay();

        } else {

            container = this.injector.get<IonicController>(wrapperContainer.controller);
            opts.data.container = container;
            if (container instanceof PopoverController) {
                opts.container.opts = opts.container.opts || wrapperContainer.opts;
            }

            const containerComp = container.create(
                opts.component || IonicMonthPickerComponent,
                opts.data,
                opts.container.opts
            );

            return containerComp;
        }

    }

    addWrapper(controllerMap: WrapperController): IonicMonthPickerController {
        for (const type in controllerMap) {
            if (controllerMap.hasOwnProperty(type)) {
                this.wrapperControllers[type] = controllerMap[type];
            }
        }
        return this;
    }

    protected createNavOverlay(container: NavController, opts: MonthPickerOptions) {

        const navOverlay = class implements IonicOverlay {

            nav = container;

            present(navOptions?: NavOptions) {
                return this.nav.push(opts.component || IonicMonthPickerComponent, opts.data, navOptions);
            }

            dismiss(data?: any, role?: string, navOptions?: NavOptions): Promise<any> {
                return this.nav.pop(navOptions);
            }

            onDidDismiss(callback: (data: any, role: string) => void) {
                this.nav.viewDidLeave.subscribe(callback);
            }

            onWillDismiss = (callback: Function) => {
                this.nav.viewWillLeave.subscribe(callback);
            }
        };

        /**
         * JS dynamic inheritance from the
         * prototype parent `NavControllerBase`.
         *
         * Whether your browser don't support `Object.getPrototypeOf`,
         * use `navOverlayObj.nav` property to call `NavController`
         * methods.
         */
        const parentPrototype = Object.getPrototypeOf(Object.getPrototypeOf(container));
        Object.getOwnPropertyNames(parentPrototype).forEach(name => {
            navOverlay.prototype[name] = container[name];
        });

        return navOverlay;
    }
}
