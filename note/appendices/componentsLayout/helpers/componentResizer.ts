import BoundingClientRect from './BoundingClientRectInterface';

let globalContext: any;

const initResize = (e: Event) => {
    const getResizer = () => document.getElementsByClassName('resizer-border')[0];

    let div = <HTMLElement>getResizer();
    let target = (<Element>e.target);

    let divClientRect = <BoundingClientRect>div.getBoundingClientRect();
    let differenceTop = divClientRect.top - parseFloat(div.style.top);
    let differenceLeft = divClientRect.left - parseFloat(div.style.left);

    let reversePoint = {
        top: divClientRect.bottom,
        left: divClientRect.right
    };

    // const hideUnusedPoints = (): void => {
    //     const points = <NodeList>getResizer().childNodes;
    //     points.forEach((point) => {
    //         if (point !== e.target) {
    //             point.parentNode.removeChild(point);
    //         }
    //     });
    // };

    const resizeWebixComponent = (resizerElement: HTMLElement) => {
        let componentView = <any>globalContext;
        let movableView = componentView.getParentView();

        let resizerRect = <BoundingClientRect>resizerElement.getBoundingClientRect();

        let top = resizerRect.top - differenceTop;
        let left = resizerRect.left - differenceLeft;
        // TODO: sorve problem with Combo component into layout
        //
        componentView.define({
            height: resizerRect.height - 8, // borders * 2?
            width: resizerRect.width - 8, // borders * 2?
            top,
            left
        });

        if (movableView.config.view === 'elementMovable') {
            movableView.define({ top, left });
            movableView.resize();
        }
    };

    let resize = (ev: MouseEvent) => {
        // hideUnusedPoints(e);
        let availableResize = <string | null>target.getAttribute('available-resize');
        if (availableResize) {
            if (availableResize.indexOf('top') !== -1) {
                div.style.top = `${ev.clientY - differenceTop}px`;
                div.style.height = `${reversePoint.top - ev.clientY}px`;
                if (availableResize.indexOf('width') !== -1) {
                    div.style.width = `${reversePoint.left - ev.clientX}px`;
                }
            }
            if (availableResize.indexOf('left') !== -1) {
                div.style.left = `${ev.clientX - differenceLeft}px`;
                div.style.width = `${reversePoint.left - ev.clientX}px`;
                if (availableResize.indexOf('height') !== -1) {
                    div.style.height = `${reversePoint.top - ev.clientY}px`;
                }
            }
            if (availableResize.indexOf('width') !== -1) {
                div.style.width = `${ev.clientX - divClientRect.x}px`;
            }
            if (availableResize.indexOf('height') !== -1) {
                div.style.height = `${ev.clientY - divClientRect.y}px`;
            }
            resizeWebixComponent(div);
        }
    };
    let stopResize = (ev: MouseEvent) => {
        window.removeEventListener('mousemove', resize, false);
        window.removeEventListener('mouseup', stopResize, false);

        let componentView = globalContext;
        componentView.callEvent('onBlur');
        componentView.callEvent('onFocus', [componentView]);
    };
    window.addEventListener('mousemove', resize, false);
    window.addEventListener('mouseup', stopResize, false);
};


const getPoint = (top: number, left: number, cursor: string, resize: string) => {
    let div = <HTMLElement>document.createElement('div');

    div.className = 'resizer-point';
    div.style.top = `${top}px`;
    div.style.left = `${left}px`;
    div.style.cursor = cursor;

    div.setAttribute('available-resize', resize);
    div.addEventListener('mousedown', initResize, false);

    return div;
};

const drawPoints = (node: HTMLElement) => {
    let boundRect = <BoundingClientRect>node.getBoundingClientRect();
    let width = boundRect.width;
    let height = boundRect.height;

    // TODO: try to find more flex solution
    node.appendChild(getPoint(-8, -8, 'nwse-resize', 'top,left'));
    node.appendChild(getPoint(-8, width / 2 - 4, 'ns-resize', 'top'));
    node.appendChild(getPoint(-8, width - 4, 'nesw-resize', 'top, width'));
    node.appendChild(getPoint(height / 2 - 8, -8, 'ew-resize', 'left'));
    node.appendChild(getPoint(height / 2 - 8, width - 4, 'ew-resize', 'width'));
    node.appendChild(getPoint(height - 4, -8, 'nesw-resize', 'left, height'));
    node.appendChild(getPoint(height - 4, width / 2 - 4, 'ns-resize', 'height'));
    node.appendChild(getPoint(height - 4, width - 4, 'nwse-resize', 'width, height'));
};

const drawResizer = (context: webix.ui.baselayout) => {
    globalContext = context;

    let div = <HTMLElement>document.createElement('div');
    div.className = 'resizer-border';

    div.style.top = `${context.getParentView().$view.offsetTop}px`;
    div.style.left = `${context.getParentView().$view.offsetLeft}px`;
    div.style.width = `${context.getParentView().$view.offsetWidth}px`;
    div.style.height = `${context.getParentView().$view.offsetHeight}px`;

    context.getParentView()
        .getParentView()
        .$view
        .appendChild(div);

    drawPoints(div);
};

const deleteResizer = (): void => {
    let resizer = document.getElementsByClassName('resizer-border')[0];
    if (resizer) {
        resizer.parentNode.removeChild(resizer);
    }
};

export {
    drawResizer,
    deleteResizer,
    drawPoints
};
