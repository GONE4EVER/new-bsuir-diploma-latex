import getGrid from '../helpers/getGrid';
import ComponentsLayout from '../interfaces/ComponentsLayout';
import BaseLayout from '../interfaces/BaseLayout';

const horizontalLayoutConfig: BaseLayout = {
    name: 'AppOrchid-Horizontal-Layout',
    defaults: {
        isEmpty: true,
        type: 'space',
        css: 'AO_Layout',
        template: '<div class="iii">Horizontal-Layout</div>',
    },
    $init(config): void {
        const grid = <ComponentsLayout>getGrid(this);

        if (typeof config.cols === 'undefined') {
            config.cols = [
                {
                    template: '<div class="iii">Horizontal-Layout</div>',
                    type: 'clean',
                    height: grid.config.separation * 3,
                    width: grid.config.separation * 6 > 220
                        ? grid.config.separation * 3
                        : grid.config.separation * 6
                }
            ];
        }
        webix.DragControl.addDrop(this.$view, this, true);
    }
};

export default horizontalLayoutConfig;
