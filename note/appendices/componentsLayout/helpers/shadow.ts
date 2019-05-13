import BoundingClientRect from './BoundingClientRectInterface';

/* import grid from '../models/grid'; */

const drawShadow = (htmlView, left, top, grid): void => {
    const shadow = <HTMLElement>document.createElement('div');

    const viewRect = <BoundingClientRect>htmlView.children[0].getBoundingClientRect();
    shadow.className = 'element-shadow';

    shadow.style.top = `${top}px`;
    shadow.style.left = `${left}px`;
    shadow.style.width = `${viewRect.width - 1}px`;
    shadow.style.height = `${viewRect.height - 1}px`;
    shadow.style.position = 'relative';

    grid.appendChild(shadow);
};

const removeShadow = (): void => {
    let div = document.getElementsByClassName('element-shadow')[0];
    if (div && div.parentNode) {
        div.parentNode.removeChild(div);
    }
};

const drawShadowGrid = (htmlView: HTMLElement) => {
    const div = <HTMLElement>document.createElement('div');
    const viewRect = <BoundingClientRect>htmlView.getBoundingClientRect();
    div.className = 'grid-shadow';

    div.style.top = `${viewRect.top}px`;
    div.style.left = `${viewRect.left}px`;
    div.style.width = `${viewRect.width}px`;
    div.style.height = `${viewRect.height}px`;

    htmlView.appendChild(div);
};

const removeShadowGrid = (): void => {
    let div = document.getElementsByClassName('grid-shadow')[0];
    div.parentNode.removeChild(div);
};

export {
    drawShadow,
    drawShadowGrid,
    removeShadowGrid,
    removeShadow
};
