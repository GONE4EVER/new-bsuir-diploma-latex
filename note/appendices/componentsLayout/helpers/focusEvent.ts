import { addSelectedCss } from '../../../helpers/highlighting';
import { deleteResizer, drawResizer } from './componentResizer';

export default (view: any): void => {
    addSelectedCss(view);
    deleteResizer();
    if (!(<{ parentId: string }>view.config).parentId) {
        drawResizer(view);
    }
};
