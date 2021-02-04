import { ReaderDom } from '../../app';
import SnackbarComponent from './snackbar-component.html';
import Format from '../../utils/format';

export default class Snackbar extends HTMLElement{
    constructor(){
        super();
        this.appendChild(ReaderDom.appendComponent(SnackbarComponent));
        this.el = {};
        
        this.querySelectorAll('[id]').forEach(element => {
            this.el[Format.formatToCamelCase(element.id)] = element;
        });
        this.addEventListener('show', e => this.callNotification(e.detail));
    }

    callNotification(text){
        this.show();
        this.el['snackbarText'].innerHTML = text;
        this.el['snackbarText'].css({color: 'white'});
        this.el['notification'].removeClass('online', 'offline');
        this.el['notification'].className = 'online';

        setTimeout(() => {this.hide()}, 3000);
    }
}
