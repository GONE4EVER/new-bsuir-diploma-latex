import './helpers/movable';
import componentLayout from './config';
import './helpers/gridLayoutWindow/index';



webix.protoUI(componentLayout, webix.Movable, webix.DragItem, webix.ui.abslayout);
