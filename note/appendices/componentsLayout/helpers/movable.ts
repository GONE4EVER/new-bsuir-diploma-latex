import { stickToGrid } from './magneticGrid';
import { drawShadow, removeShadow } from './shadow';
import BoundingClientRect from './BoundingClientRectInterface';


webix.protoUI({
    name: 'elementMovable',
    move_setter(value: any): any {
        if (value) {
            this._move_admin = webix.clone(this._move_admin);
            this._move_admin.master = this;
            webix.DragControl.addDrag(this.$view, this._move_admin);
        }
        return value;
    },
    _move_admin: {
        $dragCreate(object, e): HTMLElement | boolean {
            let master = <any>webix.DragControl.getMaster(object).master;

            if ($$(e.target.getAttribute('view_id')) &&
                $$(e.target.getAttribute('view_id')).config.view === 'resizer') {
                return false;
            }

            if (master.config.move) {
                let offset = <{ x: number, y: number }>webix.html.offset(object);
                let pos = webix.html.pos(e);

                // TODO: need to get width of  componentBar
                webix.DragControl.top = offset.y - pos.y;
                webix.DragControl.left = offset.x - pos.x;
                return webix.toNode(master.$view);
            }
            return false;
        },
        $dragDestroy(): void {
            const master = <BoundingClientRect>this.master.getChildViews()[0].$view.getBoundingClientRect();
            const grid = <any>this.master.getParentView();

            const gridBounds = <BoundingClientRect>this.master.getParentView()
                .$view
                .getBoundingClientRect();
            let view = <any>this.master;

            let diffX = <number>master.x - gridBounds.x;
            let diffY = <number>master.y - gridBounds.y;

            let { left, top } = <{ left: number, top: number }>stickToGrid(this.master, diffX, diffY, grid.config.separation);

            if (view._settings) {
                view._settings.top = top + 7;
                view._settings.left = left + 7;
            }

            webix.DragControl.top = 5;
            webix.DragControl.left = 5;

            view.resize();

            removeShadow();

            this.master.callEvent('onViewMoveEnd', []);
            let item = this.master.getChildViews()[0];

            item.config.top = this.master.config.top;
            item.config.left = this.master.config.left;

            const elem = <webix.ui.baselayout>view.getChildViews()[0];

            elem.callEvent('onBlur', []);
            elem.callEvent('onFocus', [elem]);
        },
        $dragPos(pos, e): void {
            this.master.callEvent('onViewMove', [pos, e]);

            const grid = <any>this.master.getParentView();
            const gridBounds = <BoundingClientRect>grid.$view.getBoundingClientRect();

            let context = webix.DragControl.getContext();
            let control = context.source;

            pos.x = e.clientX - gridBounds.x;
            control.style.left = pos.x;
            pos.y = e.clientY - gridBounds.y;
            control.style.top = pos.y;

            const master = <BoundingClientRect>this.master.getChildViews()[0].$view.getBoundingClientRect();

            let diffX = <number>master.left - gridBounds.x;
            let diffY = <number>master.top - gridBounds.y;

            let { left, top } = <{ left: number, top: number }>stickToGrid(this.master, diffX, diffY, grid.config.separation);

            let shadowRect = <HTMLElement>document.getElementsByClassName('element-shadow')[0];

            if (shadowRect) {
                removeShadow();
            }

            if (!shadowRect
                || (shadowRect.getBoundingClientRect().left !== left
                    && shadowRect.getBoundingClientRect().top !== top)) {
                drawShadow(this.master.$view, left + 10, top + 10, grid.getNode());
            }
        }
    }
}, webix.ui.layout, webix.Movable);
