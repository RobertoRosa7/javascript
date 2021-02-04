import { ReaderDom } from '../../app';
import ListContactsComponent from './list-contacts-component.html';
import Format from '../../utils/format';
import RenderView from '../../services/renderView';

export default class ListContacts extends HTMLElement{
    constructor(){
        super();
        this.appendChild(ReaderDom.appendComponent(ListContactsComponent));
        this.el = {};
        this.render = new RenderView();

        this.querySelectorAll('[id]').forEach(element => {
            this.el[Format.formatToCamelCase(element.id)] = element;
        });
        
        this.addEventListener('contactIsLoaded', e => {
            // this.contacts = JSON.parse(contacts.target.dataset.contacts);
            this.contacts = e.detail;
            this.el['listContact'].innerHTML = '';
            
            this.contacts.forEach((contact, index) => {
                let li = document.createElement('li');
                li.innerHTML += this.render.renderListContact(contact);
                li.querySelectorAll('button .contact-image').forEach(contact => contact.hide());
                li.onclick = e => this.openPanelConversation(contact);
                this.el['listContact'].appendChild(li);
            });
        });
    }
    openPanelConversation(contact){
        this.dispatchEvent(new CustomEvent('contactchange',{'detail':contact}));
    }
}