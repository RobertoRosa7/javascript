import { ReaderDom } from '../../app';
import LoadingPageComponent from './loading-page-component.html';

export default class LoadingPage extends HTMLElement {
    constructor() {
        super();
        this.appendChild(ReaderDom.appendComponent(LoadingPageComponent));
    }
}
