import Firebase from '../services/firebase';
import Model from './model';
import Auth from './auth-service';
import Database from './websql-service';

export default class User extends Model{
    constructor(email){
        super();
        this.db = new Database
        this.auth = new Auth();
        this.email = email;

        if(email) this.getByEmail(email);
    }
    get name(){return this.data.name};
    set name(name){this.data.name = name};

    get email(){return this.data.email};
    set email(email){this.data.email = email};

    get photo(){return this.data.photo};
    set photo(photo){this.data.photo = photo};

    get chatId(){return this.data.chatId};
    set chatId(chatId){this.data.chatId = chatId};

    // esqueci o uso deste método
    // async fetchUser(user){
    //     const contacts = await this.contacts.fetchContacts();
        
    //     console.log(this.users);

    //     this.users.forEach(u => {
    //         contacts.forEach(c => u.contacts.push(c));
    //     });

    //     if(localStorage.getItem('users')){
    //         const users = JSON.parse(localStorage.getItem('users'));
    //         return Promise.resolve(users.filter(u => u.email == user.user.email)[0]);
    //     }else{
    //         localStorage.setItem('users', JSON.stringify(this.users));
    //         const users =  this.users;
    //         return Promise.resolve(users.filter(u => u.email == user.email)[0]);
    //     }
    // }
    static getRef(){
        return Firebase.database().collection('/users');
    }
    static findByEmail(email){
        return User.getRef().doc(email);
    }
    static getRefContacts(email){
        return User.getRef().doc(email).collection('contacts');
    }
    getByEmail(email){
        return new Promise(resolve => {
            User.findByEmail(email).onSnapshot(doc => {
                    this.fromJson(doc.data());
                    resolve(doc);
            });
        });
    }
    async save(){
        try{ return await User.findByEmail(this.email).set(this.toJson()) }catch(e){ console.error(e) }
    }
    async addContact(contact){
        return await User.getRefContacts(this.email).doc(btoa(contact.email)).set(contact.toJson());
    }
    getContacts(filter = ''){
        return new Promise(async resolve => {
            User.getRefContacts(this.email).where('name', '>=', filter).onSnapshot(async docs => {
                const contacts = [];

                docs.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    contacts.push(data);
                });
                this.trigger('contactschange', docs);
                const db = await this.db.createIndexdb('contacts');
                const store = await this.db.databaseIsReady(db);
                const contactsStore = await this.db.getAllData(store, 'contacts');

                if(contactsStore && contactsStore.length == contacts.length){
                    resolve(contactsStore);
                }else{
                    await this.db.insertContacts(store, 'contacts', contacts);
                    resolve(contacts);
                }
            });
        });
    }
}