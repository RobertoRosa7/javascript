import { Firebase } from './../utils/Firebase';
import { Model } from './Model';

export class User extends Model{
    constructor(id){
        super();
        if(id) this.getById(id);
    }
    get name(){return this._data.name; }
    set name(value){this._data.name = value; }

    get email(){return this._data.email; }
    set email(value){this._data.email = value; }

    get photo(){return this._data.photo; }
    set photo(value){this._data.photo = value; }

    get chatId(){return this._data.chatId; }
    set chatId(value){this._data.chatId = value; }
    
    // get id from user (email)
    getById(id){
        // return promise, can or can not work
        return new Promise((success, fail) =>{
            // para ficar ouvindo em tempo real
            User.findByEmail(id).onSnapshot(doc =>{
                this.fromJSON(doc.data());
                success(doc);
            });
            /*
            // get() doc from firestore to access datas - somente uma vez
            this promise return the document from firestore
            User.findByEmail(id).get().then(doc =>{
                receive document in JSON
                this.fromJSON(doc.data());
                // success get all data from firebase
                success(doc);
            //});
            */
        }); 
    }
    // save data on firebase
    save(){
        // passing toJSON like param in set 
        return User.findByEmail(this.email).set(this.toJSON());
    }
   // get ref from firebase
   static getRef(){
       // access the referenses from firebase and get collection /users
       return Firebase.db().collection('/users');
   }
   // search for user email
   static findByEmail(email){
        // access doc from collection /users
        return User.getRef().doc(email);
   }
   // get contacts
   static getContactsRef(email){
       return User.getRef().doc(email).collection('contacts');
   }
   // add contact
   addContact(contact){
       // add contact | add new collection | convert to base64
       // btoa('string') convert to base64
       // atob('base64') convert to string
       return User.getContactsRef(this.email).doc(btoa(contact.email)).set(contact.toJSON());
   }
   // get user to add list contact
   getContacts(filter = ''){
       // promise to receive contacts from database
       return new Promise((success, fail)=>{
           // listening all change on firebase
            User.getContactsRef(this.email).where('name','>=', filter).onSnapshot(docs =>{
                // declare array empty to storage conctacts
                let contacts = [];
                // run each docs 
                docs.forEach(doc =>{
                    // declare data to receive documents
                    let data = doc.data();
                    // add id on document 
                    data.id = doc.id;
                    // add contact
                    contacts.push(data);
                });
                // start listening who is listening in this events
                this.trigger('contactsChange', docs);
                // success return contacts promise
                success(contacts);
            });
       });
   }
}