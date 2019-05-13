import GridLayoutWindow from '../../../layouts/interfaces/GridLayoutWindow';
import CommonCallback from '../../../layouts/interfaces/subinterfaces/CommonCallback';

const DX_INPUT_ID = 'window:form:dxInput';
const DY_INPUT_ID = 'window:form:dyInput';
const FORM_INPUT_ID = 'window:form';
const OK_BUTTON_ID = 'window:form:confirmButton';
const WINDOW_ID = 'window:onGridlayoutCreate';

const getDXInput = (): string => DX_INPUT_ID;
const getDYInput = (): string => DY_INPUT_ID;
const getFormId = (): string => FORM_INPUT_ID;
const getOkBtnId = (): string => OK_BUTTON_ID;
const getWindowId = (): string => WINDOW_ID;

function selectInputContent(): void {
    this.getNode().children[0].children[1].select();
}

const gridLayoutWindowConfig: GridLayoutWindow = {
    id: getWindowId(),
    view: 'window',
    height: 250,
    width: 300,
    head: 'Gridlayout properties',
    position: 'center',
    modal: true,
    body: {
        rows: [
            {
                id: getFormId(),
                borderless: true,
                view: 'form',
                elements: [
                    {
                        id: getDXInput(),
                        view: 'text',
                        name: 'dx',
                        label: 'Grid width (dx)',
                        labelWidth: 120,
                        invalidMessage: 'Invalid value',
                        on: {
                            onKeyPress(code, ev) {
                                if (isNaN(parseInt(ev.key, 10)) && (code !== 9 && code !== 8)) {
                                    return false;
                                }
                                this.getParentView().clearValidation();
                            },
                            onEnter() {
                                (<webix.ui.button>$$(getOkBtnId())).config.click();
                            },
                            onFocus: selectInputContent
                        }
                    },
                    {
                        id: getDYInput(),
                        view: 'text',
                        name: 'dy',
                        label: 'Grid height (dy)',
                        labelWidth: 120,
                        invalidMessage: 'Invalid value',
                        on: {
                            onKeyPress(code, ev): boolean | void {
                                if (isNaN(parseInt(ev.key, 10)) && (code !== 9 && code !== 8)) {
                                    return false;
                                }
                                this.getParentView().clearValidation();
                            },
                            onEnter(): void {
                                (<webix.ui.button>$$(getOkBtnId())).config.click();
                            },
                            onFocus: selectInputContent
                        }
                    }
                ],
                rules: {
                    dx(value: string): boolean { return parseInt(value, 10) !== 0 && !isNaN(parseInt(value, 10)); },
                    dy(value: string): boolean { return parseInt(value, 10) !== 0 && !isNaN(parseInt(value, 10)); }
                }
            },
            {
                borderless: true,
                cols: [
                    {
                        id: getOkBtnId(),
                        view: 'button',
                        label: 'Set',
                        click(): void {
                            const form = <webix.ui.form>$$(getFormId());

                            /* let dx = form.getValues().dx;
                            let dy = form.getValues().dy; */

                            if (form.validate()) {
                                (<GridLayoutWindow>$$(getWindowId()).config).resolve(form.getValues());
                                $$(getWindowId()).hide();
                            }
                        }
                    },
                    {
                        view: 'button',
                        label: 'Cancel',
                        type: 'danger',
                        click() {
                            (<GridLayoutWindow>$$(getWindowId()).config).reject('Canceled');
                            this.getTopParentView().hide();
                        }
                    }
                ]
            }
        ]
    },
    onGridAdd(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;

        return <webix.ui.window>$$(getWindowId());
    },
    on: {
        onHide() {
            (<webix.ui.form>$$(getFormId())).clear();
        },
        onShow() {
            (<webix.ui.text>$$(getDXInput())).setValue('4');
            (<webix.ui.text>$$(getDYInput())).setValue('4');
        }
    }
};


const callWindowOnGridlayoutDrop = (resolve: CommonCallback, reject: CommonCallback) =>
    (<GridLayoutWindow>$$(getWindowId()).config).onGridAdd(resolve, reject).show();

export { callWindowOnGridlayoutDrop };

export default gridLayoutWindowConfig;
