import { callWindowOnGridlayoutDrop } from './helpers/gridLayoutWindow/config';
import ComponentsLayout from '../layouts/interfaces/ComponentsLayout';
import { deleteSelectedCss } from '../../helpers/highlighting';
import { deleteResizer } from './helpers/componentResizer';


// const UNFOCUSED = 0;
const FOCUSED = 1;
const DEFAULT_OFFSET = 400;


function getBranch(origin, parentId) {
    return origin.filter(element => element.parentId === parentId);
}

const componentLayout: ComponentsLayout = {
    name: 'AppOrchid-Components-Layout',
    default: {
        drag: 'target',
        cells: []
    },
    config: {
        separation: 20
    },
    _canvasId: `canvas:grid:${webix.uid()}`,
    $init(config) {
        const self = this;
        // ignore serialize for itself
        config.presetParse = false;

        this._collection = [];
        this._cells = [];

        webix.DragControl.addDrop(self.$view, {
            $drop(source, target, ev) {
                let dnd = webix.DragControl.getContext();

                if (dnd.from.name === 'dataview' &&
                    (dnd.from.getItem(dnd.source[0]).widgetType === 'layout' || dnd.from.getItem(dnd.source[0]).widgetType === 'card')
                ) {
                    if (dnd.from.name === 'dataview') {
                        let elementConfig = webix.copy(dnd.from.getItem(dnd.source[0]).config);

                        if (elementConfig.view === 'AppOrchid-Gridlayout') {
                            self._onGridLayoutDrop(elementConfig, ev);
                            return;
                        }

                        elementConfig.id = webix.uid();
                        self._addMovableElement(elementConfig, ev);
                    }
                } else if (dnd.from.name === 'dataview' && dnd.from.getItem(dnd.source[0]).widgetType !== 'layout') {
                    webix.message({
                        text: 'Only layouts can be placed on the grid',
                        type: 'error',
                        expire: 2000
                    });
                }
            }
        });
        this.$ready.push(this.drawCanvasGrid);
    },
    _onGridLayoutDrop(elementConfig, ev) {
        let promise = new Promise((resolve, reject) => {
            callWindowOnGridlayoutDrop(resolve, reject);
        });

        promise
            .then((res: { dx, dy }) => {
                let { dx, dy } = { dx: parseInt(res.dx, 10), dy: parseInt(res.dy, 10) };
                elementConfig.height = 2 * dy * this.config.separation;
                elementConfig.width = 2 * dx * this.config.separation;

                let gridlayout = Object.assign({}, { gridColumns: dx, gridRows: dy }, elementConfig);

                gridlayout.id = webix.uid();
                this._addMovableElement(gridlayout, ev);
            })
            .catch(err => webix.message({
                text: err,
                type: 'error',
                expire: 2000
            }));
    },
    drawCanvasGrid() {
        const self = this;
        let conf = {
            template: () => `<canvas
                                id ="${self._canvasId}"
                                height="${document.body.clientHeight}"
                                width="${document.body.clientWidth}"
                                />`,
            top: 0,
            left: 0,
            zIndex: -10,
            autoheight: true,
            presetParse: false,
            on: {
                onAfterRender() {
                    this.define('height', document.body.clientHeight);
                    this.define('width', document.body.clientWidth);
                    this.resize();

                    self._drawGrid();
                }
            }
        };
        this.addView(conf);
    },
    _drawGrid(gridOptions) {
        let cnv = this.getNode()
            .querySelector('canvas');
        // let cnv = document.getElementById(this._canvasId);
        let opts = gridOptions;

        /* if (!opts) {
            opts = {
                lines: {
                    separation: 20,
                    color: '#DFE2E6'
                }
            };
        }
        this.config.separation = opts.lines.separation;
        this._drawGridLines(cnv, opts.lines); */

        if (!opts) {
            opts = {
                separation: 20,
                color: '#DFE2E6'
            };
        }
        this.config.separation = opts.separation;
        this._drawGridLines(cnv, opts);
    },
    _drawGridLines(cnv, lineOptions) {
        let iWidth = cnv.width;
        let iHeight = cnv.height;

        let iCount;
        let ctx: CanvasRenderingContext2D = cnv.getContext('2d');
        ctx.strokeStyle = lineOptions.color;
        /* ctx.strokeWidth = 1; */
        ctx.beginPath();

        iCount = Math.floor(iWidth / lineOptions.separation);

        for (let i = 1; i <= iCount; i++) {
            let x = i * lineOptions.separation;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, iHeight);
        }

        iCount = Math.floor(iHeight / lineOptions.separation);

        for (let i = 1; i <= iCount; i++) {
            let y = i * lineOptions.separation;
            ctx.moveTo(0, y);
            ctx.lineTo(iWidth, y);
        }

        ctx.strokeStyle = lineOptions.color || '#DFE2E6';
        ctx.fillStyle = 'rgba(209,209,209,0);';

        ctx.stroke();
        ctx.closePath();
    },
    _getMovableElementEvents() {
        const self = this;
        const movableElementEvents = {
            onFocus(view) {
                this.config.focused = FOCUSED;
                const grid = <webix.ui.baselayout>$$(self.config.id);

                grid.callEvent('onMovableElementSelect', [view, self]);
            },
            onBlur() {
                deleteSelectedCss();
                deleteResizer();
            }
        };

        return {
            on: { ...movableElementEvents }
        };
    },
    _addMovableElement(config, ev) {
        let height;
        let width;
        let top;
        let left;
        const self = this;

        // when vertical or horizontal layout
        if (!config.width || !config.height) {
            width = this.config.separation;
            height = this.config.separation;
        } else {
            width = config.width;
            height = config.height;
        }

        top = ev ? ev.offsetY - (height / 2) : DEFAULT_OFFSET;
        left = ev ? ev.offsetX - (width / 2) : DEFAULT_OFFSET;

        config.top = top;
        config.left = left;

        function _recursiveMovableEvents(element) {
            if (element.cols && element.cols.length) {
                element.cols = element.cols.map(subElement => _recursiveMovableEvents(subElement));
            }

            if (element.rows && element.rows.length) {
                element.rows = element.rows.map(subElement => _recursiveMovableEvents(subElement));
            }

            if (element.cells && element.cells.length) {
                element.cells = element.cells.map(subElement => _recursiveMovableEvents(subElement));
            }

            // TODO: add fix for scroll view

            // if (element.cells && element.cells.length) {
            //     element.cells = element.cells.map((subElement) => {
            //         return _recursiveMovableEvents(subElement);
            //     });
            // }

            return Object.assign(
                {},
                self._getMovableElementEvents(element),
                webix.copy(element)
            );
        }

        let baseElement = {
            view: 'elementMovable',
            move: true,
            presetParse: false,
            css: {
                border: '3px solid transparent'
            },
            rows: [
                _recursiveMovableEvents(config)
            ],
            id: webix.uid(),
            top,
            left
        };

        this.addView(baseElement);
        this.callEvent('componentAdded', [baseElement.id]);
        return config;
    },
    getSerializedCollection() {
        let allItems = [];

        function __addSubItemsToCollection(parentElement) {
            let childViews = parentElement.getChildViews();
            let parentId = null;
            if (parentElement.hasOwnProperty('config')
                && (!parentElement.config.hasOwnProperty('presetParse')
                    || parentElement.config.presetParse === true)) {
                parentId = parentElement.config.id;
            }

            childViews.forEach((singleView) => {
                __addSubItemsToCollection(singleView);

                if (singleView.hasOwnProperty('config')
                    && (!singleView.config.hasOwnProperty('presetParse')
                        || singleView.config.presetParse === true)) {
                    let newConfig = { ...singleView.config };

                    if (newConfig.view === 'datatable') {
                        delete newConfig.columns;

                        newConfig.columns = singleView.config.columns.map((column, index) => ({
                            header: column.header[0].text,
                            id: column.id,
                            minWidth: column.minWidth
                        }));
                    }

                    delete newConfig.suggest;
                    delete newConfig.popup;
                    if (newConfig.options) {
                        newConfig.options = (<any>$$(newConfig.options).config).body.data;
                    }

                    if (parentId) {
                        newConfig.parentId = parentId;
                    }
                    allItems.push(newConfig);
                }
            });
        }

        __addSubItemsToCollection(this);

        allItems = allItems.reverse();
        let collection = allItems;
        let array = [];
        collection.forEach((curr) => {
            if (curr.view === 'AppOrchid-Horizontal-Layout') {
                curr.cols = getBranch(collection, curr.id);
                curr.cols = curr.cols.reverse();
                if (curr.cols.length) {
                    curr.isEmpty = false;
                }
            } else if (curr.view === 'AppOrchid-Vertical-Layout' || 'AppOrchid-Scrollview') {
                curr.rows = getBranch(collection, curr.id);
                curr.rows = curr.rows.reverse();
                if (curr.rows.length) {
                    curr.isEmpty = false;
                }
            } else if (curr.view === 'AppOrchid-Gridlayout') {
                curr.cells = getBranch(collection, curr.id);
                curr.cells = curr.cells.reverse();
                if (curr.cells.length) {
                    curr.isEmpty = false;
                }
            }
            if (!curr.parentId) {
                array.push(curr);
            }
        });

        return array.reverse();
    },
    addViewMovable(config, ev) {
        return this._addMovableElement(config, ev);
    }
};

export default componentLayout;
