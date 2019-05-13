import Window from '../../interfaces/DropComponentWindow';
import CommonCallback from '../../interfaces/subinterfaces/CommonCallback';

const WINDOW_ID = 'window:onElementInsert';
const getWindowId = (): string => WINDOW_ID;

function selectInputContent(): void {
    this.getNode().children[0].children[1].select();
}

const windowLayoutConfig: Window = {
    id: getWindowId(),
    view: 'window',
    modal: true,
    head: 'Component Options',
    position: 'center',
    on: {
        onHide(): void {
            this.getBody().clear();
            this.getBody().clearValidation();
        },
        onShow(): void {
            this.getBody().setValues({dx: 4, dy: 4, x: 0, y: 0});
        }
    },
    body: {
        view: 'form',
        elements: [
            {view: 'text', label: 'dx', name: 'dx', invalidMessage: 'This field should be a number!', click: selectInputContent},
            {view: 'text', label: 'dy', name: 'dy', invalidMessage: 'This field should be a number!', click: selectInputContent},
            {view: 'text', label: 'x', name: 'x', invalidMessage: 'This field should be a number!', click: selectInputContent},
            {view: 'text', label: 'y', name: 'y', invalidMessage: 'This field should be a number!', click: selectInputContent},
            {cols: [
                {
                    view: 'button',
                    label: 'Add',
                    type: 'form',
                    click(): void {
                        const form: webix.ui.form = this.getFormView();
                        if (<boolean>form.validate()) {
                            const values: {dx, dy, x, y} = this.getFormView().getValues();
                            let result = {
                                dx: parseInt(values.dx, 10),
                                dy: parseInt(values.dy, 10),
                                x: parseInt(values.x, 10),
                                y: parseInt(values.y, 10)
                            };

                            $$(getWindowId()).hide();
                            (<Window>$$(getWindowId()).config).resolve(result);
                        }
                    }},
                {
                    view: 'button',
                    label: 'Cancel',
                    click(): void {
                        $$(getWindowId()).hide();
                        (<Window>$$(getWindowId()).config).reject('Canceled');
                    }
                }
            ]}
        ],
        rules: {
            x(value): boolean  { return !isNaN(parseInt(value, 10)); },
            y(value): boolean  { return !isNaN(parseInt(value, 10)); },
            dx(value): boolean { return parseInt(value, 10) !== 0 && !isNaN(parseInt(value, 10)); },
            dy(value): boolean { return parseInt(value, 10) !== 0 && !isNaN(parseInt(value, 10)); }
        }
    },
    onElementAdd(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;

        return <webix.ui.window>$$(getWindowId());
    }
};


const callWindowElementInsert =
    (resolve: CommonCallback, reject: CommonCallback) =>
        (<Window>$$(getWindowId()).config).onElementAdd(resolve, reject).show();


export {
    windowLayoutConfig,
    getWindowId
};

export default callWindowElementInsert;
