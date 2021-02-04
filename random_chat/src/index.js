import RoutesService from './services/routes-service';
import { ReaderDom } from './app';
import AppComponent from './pages/app/app-component.html';
import AppPage from './pages/app/app-component';
import NoPageComponent from './pages/no-page/no-page-component.html';
import Teste from './pages/test/test-component.html';
import Login from './components/auth/login-component';

export default class Root extends HTMLElement{
    constructor(){
        super();
        const self = this;

        this.router = new RoutesService({
            mode:'hash',
            root:'/',
            hooks:{
                before: function(newPage){
                    console.info('before page load hooks', newPage);
                }
            },
            page404: function(path){
                document.querySelector('app-loading-page').style.display = 'none';
                self.clearIfExistsComponents(self);
                self.appendChild(ReaderDom.appendComponent(NoPageComponent));
            }
        });
        this.router.add('', function(){
            // if(!localStorage.getItem('user')) self.router.redirectTo('login');
            if(!localStorage.getItem('isLogged')) self.router.redirectTo('login');
            self.showMainPage();
        });

        // this.router.remove('about')
        // this.router.navigateTo('hello/World', {foo: "bar"})
        // this.router.refresh();
        
        // this.router.add('search', function(){
        //     console.log('search page')
        // }, {unloadCb: function(async){
        //     if(async){
        //         console.warn('you have unsave data, continue?');
        //         return confirm('you have unsave data, continue?');
        //     }
        //     return false;
        // }});
        
        this.router.add('login', function(){
            // if(localStorage.getItem('user')) self.router.redirectTo('');
            if(!localStorage.getItem('isLogged')) self.router.redirectTo('login');
            if(!window.customElements.get('app-login')) window.customElements.define('app-login', Login);

            document.querySelector('app-loading-page').style.display = 'none';
            self.clearIfExistsComponents(self);
            
            const LoginComponent = window.customElements.get('app-login');
            self.appendChild(new LoginComponent().firstChild);
            
            if(self.querySelector('#login-form')) 
                self.querySelector('#login-form')
                    .on('isAuth', e => self.router.redirectTo(''));
        });
        
        this.router.check();
        this.router.addUriListener();     
    }
    clearIfExistsComponents(component){
        while(component.firstChild){
            component.removeChild(component.firstChild);
        }
    }
    showMainPage(){
        this.clearIfExistsComponents(this);
        this.appendChild(ReaderDom.appendComponent(AppComponent));
        this.app = new AppPage();
        
        this.app.el.app.on('isAuth', e => {
            document.querySelector('app-loading-page').hide();
            this.app.el['app'].css({display:'flex'});
        });
    }
    showTestPage(){
        this.clearIfExistsComponents(this);
        this.appendChild(ReaderDom.appendComponent(Teste));

        this.querySelector('#back-from-page-teste')
            .on('click', e => {
                this.router.navigateTo('');
        });
    }
    showLoginPage(){
        this.clearIfExistsComponents(this);
        // const login = new LoginComponent();
        // this.appendChild(this.teste.firstChild);
    }
}