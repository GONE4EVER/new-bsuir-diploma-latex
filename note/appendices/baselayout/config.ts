import BaseLayout from '../interfaces/BaseLayout';
import getGrid from '../helpers/getGrid';
import DragContext from '../interfaces/subinterfaces/DragContext';

const baselayoutConfig: BaseLayout = {
    name: 'AppOrchidBaseLayout',
    defaults: {
        isEmpty: true,
        type: 'space',
        css: 'AO_Layout'
    },
    $init() {
        this.$ready.push(
            () => {
                this.attachEvent('_onElementRemoved', function () {
                    let flag = 0;
                    let children: webix.ui.layout[] = this.getChildViews();

                    if (!children.length) {
                        this.getParentView().getParentView().removeView(this.getParentView())
                        return;
                    }

                    if (children[0].config.view === 'resizer') {
                        this.blockEvent();
                        this.removeView(children[0].config.id);
                        this.unblockEvent();
                    }

                    if (children[children.length - 1].config.view === 'resizer') {
                        this.blockEvent();
                        this.removeView(children[children.length - 1].config.id);
                        this.unblockEvent();
                    }
                    children.forEach((element) => {
                        if (flag && element.config.view === 'resizer') {
                            const elementParent = element.getParentView();

                            elementParent.blockEvent();
                            elementParent.removeView(element.config.id);
                            elementParent.unblockEvent();
                            flag = 0;
                        } else if (element.config.view === 'resizer') {
                            flag = 1;
                        }
                    });

                });
            }
        );
    },
    $drop(source, target, ev) {
        let dnd: DragContext = webix.DragControl.getContext();
        if (dnd.from.config) {
            const grid = <webix.ui.gridlayout>getGrid(this);
            const webixTarget = <webix.ui.layout>this._getWebixElementFromNode(ev.target);

            let elementId: string | number;
            let elementConfig: any = webix.copy(dnd.from.getItem(dnd.source[0]).config);
            elementConfig.parentId = this.config.id;
            elementConfig.id = webix.uid();

            if (this.config.isEmpty || webixTarget === this) {
                elementId = this._addElement(elementConfig);
            } else {
                let position = -1;
                for (let i = 0; i < this.getChildViews().length; i++) {
                    if (this.getChildViews()[i] === webixTarget) {
                        position = i;
                        break;
                    }
                }

                elementId = this._addElement(elementConfig, position);
            }
            grid.callEvent('componentAdded', [elementId]);
        }
    },
    _getWebixElementFromNode(node) {
        if (node.getAttribute('view_id')) {
            return <webix.ui.layout>$$(node.getAttribute('view_id'));
        }

        return <HTMLElement>this._getWebixElementFromNode(node.parentNode);
    },
    _addElement(config, position) {
        this.callEvent('newElementAdded');
        config.on = {
            onFocus(view) {
                const grid = <webix.ui.gridlayout>getGrid(view);
                grid.callEvent('onMovableElementSelect', [view]);
            }
        };

        if (this.config.isEmpty) {
            delete this.config.isEmpty;
            return webix.ui(webix.copy(config), this.getChildViews()[0]);
        }
        if (this.getChildViews().length > 0) {
            this.addView({
                view: 'resizer'
            }, position);
        }

        return this.addView(webix.copy(config), position);
    }
};

export default baselayoutConfig;
