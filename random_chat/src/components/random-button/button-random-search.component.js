import { ReaderDom } from '../../app';
import Button from './button-random-search.component.html';

export default class ButtonRandom extends HTMLElement {
    constructor() {
        super();
        this.appendChild(ReaderDom.appendComponent(Button));
        this.hide();
    }
}
