import GridLayout from '../interfaces/GridLayout';
import DragContext from '../interfaces/subinterfaces/DragContext';

import callWindowElementInsert from './dropComponentWindow/config';
import getGrid from '../helpers/getGrid';
/* import {getConfigId} from '../../componentsLayout/helpers/id'; */
import {addSelectedCss} from '../../../helpers/highlighting';

const gridlayoutConfig: GridLayout = {
    name: 'AppOrchid-Gridlayout',
    defaults: {
        isEmpty: true,
        type: 'space',
        autoplace: false
    },
    dropOptionsWindowId: 'AppOrchid-GridLayout-Drop-Options',
    $init() {
        webix.DragControl.addDrop(this.$view, this, true);
        webix.html.addCss(this.$view, 'gridlayout');
    },
    $drop() {
        let dnd: DragContext = webix.DragControl.getContext();
        if (dnd.from.config) {
            const grid = <webix.ui.gridlayout>getGrid(this);

            let elementConfig: object = webix.copy(dnd.from.getItem(dnd.source[0]).config);

            const gridElementConfig = {
                ...elementConfig,
                id: webix.uid(),
                parentId: /* getConfigId */(this.config.id)
            };

            let promise = new Promise((resolve, reject) => {
                callWindowElementInsert(resolve, reject);
            });

            promise
                .then((componentOptions) => {
                    const resultConfig = {...gridElementConfig, ...componentOptions};
                    const elementId: object = this._addElement(resultConfig);
                    grid.callEvent('componentAdded', [elementId]);
                })
                .catch(err => webix.message({
                    text: err,
                    type: 'error',
                    expire: 2000
                }));
        }
    },
    _addElement(config) {
        webix.html.removeCss(<HTMLElement>this.$view, 'gridlayout');

        config.on = {
            onFocus(view) {
                const grid = <webix.ui.gridlayout>getGrid(view);

                addSelectedCss(view);

                grid.callEvent('onMovableElementSelect', [view]);
            }
        };
        /* const grid = getGrid(this);

        let thisFromCollection = grid.getSerializedCollection().find((element) => {
            if (element.id === this.config.id) {
                return element;
            }
        });

        console.log(thisFromCollection); */

        /* this.getChildViews().forEach((element) => {
            this.removeView(element);
        }); */

        /* webix.ui(thisFromCollection, this.getParentView()); */

        return <webix.ui.layout>this.addView(config);
    }
}

export default gridlayoutConfig;
