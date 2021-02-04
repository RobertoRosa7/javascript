import { ReaderDom } from '../../app';
import SidebarComponent from './sidebar-component.html';
import Format from '../../utils/format';
import { Wordlist } from '../../utils/wordlist';
import User from '../../services/user';
import RenderView from '../../services/renderView';
import ChatService from '../../services/chat';
import RoutesService from '../../services/routes-service';
import Database from '../../services/websql-service';

export default class Sidebar extends HTMLElement{
    constructor(){
        super();
        this.appendChild(ReaderDom.appendComponent(SidebarComponent));
        this.el = {};

        this.db = new Database();
        this.render = new RenderView();
        this.router = new RoutesService();

        this.querySelectorAll('[id]').forEach(element => {
            this.el[Format.formatToCamelCase(element.id)] = element;
        });

       
        this.config = { animate:'animated',fadeinleft:'fadeInLeft',left:'hide-left', sidebar:false};

        this.setProfile();
        this.initEvents();
    }

    initEvents(){
        this.openAndHidePanel();
        this.eventEditName();
        this.eventProfileAddContact();
        this.closeAllPanelLeft();
        this.eventRizeWindow();
        this.eventProfileSetPhoto();

        document.querySelector('app-chat')
            .addEventListener('hideProfile', e => this.eventHideMenuOnclick());

        this.el['backButtonFromSidebar'].on('click', e => {
            this.eventHideMenuOnclick();
        });
    }
    eventRizeWindow(){
        window.addEventListener('resize', (e) => {
            if(e.target.innerWidth <= 768){
                this.removeClass(this.config.animate);
                this.removeClass(this.config.fadeinleft);
                this.style.width = 0;
                this.config.sidebar = true;
            }else{
                this.removeClass(this.config.left);
                this.addClass(this.config.animate);
                this.addClass(this.config.fadeinleft);
                this.style.width = '100%';
                this.config.sidebar = false;
            }
        });

        window.addEventListener('load', e => {
            if(window.innerWidth <= 768){
                this.removeClass(this.config.animate);
                this.removeClass(this.config.fadeinleft);
                this.style.width = 0;
                this.config.sidebar = true;
            }else{
                this.removeClass(this.config.left);
                this.addClass(this.config.animate);
                this.addClass(this.config.fadeinleft);
                this.style.width = '100%';
                this.config.sidebar = false;
            }
        });
    }
    async setProfile(){
        const { email } = JSON.parse(localStorage.getItem('isLogged'));
        this.user = new User(email);

        this.user.on('datachange', e => {
            if(e.photo){
                this.el['noPhotoUrl'].hide();
                this.el['noStatusHeaderProfile'].hide();
                this.el['profileSetPhoto'].hide();

                this.el['profileConfigImage'].css({display:'inline-block'});
                this.el['profileConfigImage'].src = e.photo;

                this.el['photoUrl'].show();
                this.el['photoUrl'].src = e.photo;

                this.el['statusHeaderProfile'].show();
                this.el['statusHeaderProfile'].src = e.photo;
            }
            this.el['editName'].innerHTML = (e.name) ? e.name : e.email;
            this.el['profileName'].innerHTML = (e.name) ? e.name : e.email;
            this.el['profileName'].setAttribute('title', (e.name) ? e.name : e.email);
            
            this.el['logout'].show();

            this.el['logout'].on('click', e => {
                document.querySelector('title').innerHTML = 'Random chat';
                localStorage.removeItem('isLogged');
                this.router.navigateTo('login');
            });
        });
        this.user.on('contactschange', contacts => {
            this.fetchContactToStorage(contacts);
        });
        await this.user.getContacts();
    }
    fetchContactToStorage(contacts){
        this.el['contactsProfile'].innerHTML = '';
        
        contacts.forEach((value, index) => {
            let contact = value.data();
            let li = document.createElement('li');
            li.innerHTML += this.render.renderListContact(contact);
            li.querySelectorAll('button .contact-image').forEach(contact => contact.hide());
            li.onclick = e => this.openPanelConversation(contact);
            this.el['contactsProfile'].appendChild(li);
        });
    }
    openPanelConversation(contact){
        this.dispatchEvent(new CustomEvent('contactchange',{'detail':contact}));
        this.closeAllPanelLeft();
        this.eventHideMenuOnclick();
    }
    openAndHidePanel(){
        this.el['headerMessages'].on('click', e => {
            this.el['panelContacts'].show();
            
            setTimeout(() => {
                this.el['panelContacts'].addClass('open-panel');
            },300);
        });
        
        this.el['closePanelProfile'].on('click', e => {
            this.el['panelProfile'].removeClass('open-panel');
            
            setTimeout(() => {
                this.el['panelProfile'].hide();
            }, 300);
        });

        this.el['sidebarProfile'].onclick = e =>{
            this.el['panelProfile'].show();
            
            setTimeout(() => {
                this.el['panelProfile'].addClass('open-panel');
            },300);
        };

        this.el['closePanelContacts'].on('click', e => {
            this.el['panelContacts'].removeClass('open-panel');
            
            setTimeout(() => {
                this.el['panelContacts'].hide();
            }, 300);
        });
    }
    eventEditName(){
        this.el['editName'].on('focus', e => {
            e.target.innerHTML = '';
        });
        
        this.el['editName'].on('keypress', e => {
            if(e.target.innerHTML.length < 30){
            
            }else{
                this.el['editName'].setAttribute('contenteditable', false);
            }
            
            if(e.key == 'Enter'){
                e.preventDefault();
                this.el['editNameEnter'].click();
            }
        });
        
        this.el['editNameEnter'].on('click', async e => {
            this.el['editNameEnter'].disabled = true;
            let permission = true;
            let anonimous = '';
            
            Wordlist.forEach(l => {
               if(l.toLocaleLowerCase() == this.el['editName'].innerHTML.toLocaleLowerCase()){
                    permission = false;
                    anonimous = 'Anonimous';
               }
            });

            if(!permission){
                this.el['editNameEnter'].disabled = false;
                this.snackbarService.callNotification('offline', `nome ${this.el['editName'].innerHTML} inválido`, '&times;');
            
            }else{
                this.user.name = this.el['editName'].innerHTML;
                await this.user.save();
                this.el['editNameEnter'].disabled = false;
            }
        });
    }
    eventProfileSetPhoto(){
        this.el['profileImg'].on('click', setPhoto => this.el['profileInputPhoto'].click());
        this.el['profileInputPhoto'].on('change', setPhotoProfile);

        function setPhotoProfile(file){
            console.log(file);
        }
    
    }
    eventProfileAddContact(){
        this.el['profileAddContact'].on('submit', e => {
            e.preventDefault();
            
            const formAddContact = new FormData(this.el['profileAddContact']);
            const contact = new User(formAddContact.get('email'));

            contact.on('datachange', async e => {
                if(e.email){
                    // create new chat if not exists
                    const chat = await ChatService.createIfNotExists(this.user.email, contact.email);
                  
                    contact.chatId = chat.id;
                    
                    this.user.chatId = chat.id;
                    
                    contact.addContact(this.user);

                    await this.user.addContact(contact);
                    
                    this.closeAllPanelLeft();
                    this.notification('Novo contato adicionado.');
                }else{
                    this.notification('Usuário não encontrado.');
                }
            });
        });
    }
    eventHideMenuOnclick(){
        if(this.config.sidebar && !this.hasClass(this.config.animate)){
            this.addClass(this.config.animate);
            this.addClass(this.config.fadeinleft);
            this.style.width = '100%';
            this.config.sidebar = false;
        }else{
            this.removeClass(this.config.animate);
            this.removeClass(this.config.fadeinleft);
            this.style.width = 0;
            this.config.sidebar = true;
        }
    }
    closeAllMainPanel(){
        this.el['chat'].hide();
        this.el['takePhoto'].hide();
        this.el['previewPanelFile'].hide();
        this.el['imageCamera'].hide();
        this.el['statusPhotoTakeSend'].hide();
        this.el['iconFile'].hide();
        this.el['containerDocumentPreview'].hide();
        this.el['statusAttachFile'].disabled = false;
    }
    closeAllPanelLeft(){
        this.el['panelProfile'].removeClass('open-panel');
        this.el['panelContacts'].removeClass('open-panel');

        setTimeout(() => {
            this.el['panelProfile'].hide();
            this.el['panelContacts'].hide();
        }, 300)
    }
    notification(text){
        document.querySelector('app-snackbar')
            .dispatchEvent(new CustomEvent('show', {detail:text}));
    }
}
