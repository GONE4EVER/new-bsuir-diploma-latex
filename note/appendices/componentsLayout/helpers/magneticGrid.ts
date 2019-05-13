const stickToGrid = (view, left, top, scale, align?): { left: number, top: number } => {
    const cell = scale;
    let grid = { cellWidth: cell, cellHeight: cell };

    let wrapWidth = <number>view.getParentView().getParentView().$width;
    let wrapHeight = <number>view.getParentView().getParentView().$height;
    let height = <number>view.$height;
    let width = <number>view.$width;

    if (left % grid.cellWidth) {
        if (width > grid.cellWidth) {
            if (left % grid.cellWidth < (grid.cellWidth - (left % grid.cellWidth)) || align) {
                left = Math.round(left / grid.cellWidth) * grid.cellWidth;
            } else {
                left += (grid.cellWidth - (left % grid.cellWidth));
            }
        } else if (top % grid.cellWidth < (grid.cellWidth - (left % grid.cellWidth + width)) || align) {
            left = Math.round(left / grid.cellWidth) * grid.cellWidth;
        } else {
            left += (grid.cellWidth - (left % grid.cellWidth + width));
        }
    }


    if (top % grid.cellHeight) {
        if (height > grid.cellHeight) {
            if (top % grid.cellHeight < (grid.cellHeight - (top % grid.cellHeight)) || align) {
                top = Math.round(top / grid.cellHeight) * grid.cellHeight;
            } else {
                top += (grid.cellHeight - (top % grid.cellHeight));
            }
        } else if (top % grid.cellHeight < (grid.cellHeight - (top % grid.cellHeight + height)) || align) {
            top = Math.round(top / grid.cellHeight) * grid.cellHeight;
        } else {
            top += (grid.cellHeight - (top % grid.cellHeight + height));
        }
    }

    if (left + width > wrapWidth) {
        left = wrapWidth - width;
    }
    if (top + height > wrapHeight) {
        top = wrapHeight - height;
    }
    return { left: left - 20, top: top - 20 };
};

export {
    stickToGrid
};
