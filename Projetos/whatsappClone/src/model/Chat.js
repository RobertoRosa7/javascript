import { Model } from "./Model";
import { Firebase } from "../utils/Firebase";

export class Chat extends Model{
    constructor(){
        super();
    }
    // GET and SET
    get users() {return this._data.users;}
    set users(value) {this._data.users = value;}
    get timeStamp() {return this._data.timeStamp;}
    set timeStamp(value) {this._data.timeStamp = value;}

    // get referense of chat from firebase
    static getRef(){
        return Firebase.db().collection('/chats');
    }
    // create new chat if not exists
    static create(meEmail, contactEmail){
        return new Promise((success, fail) =>{
            // create users to chat
            let users = {};
            // convert email to base64
            users[btoa(meEmail)] = true;
            users[btoa(contactEmail)] = true;
            // add users to chat
            Chat.getRef().add({
                users,
                timeStamp:Date(),
            }).then(doc =>{ // este doc contem somente id
                // recuperando id do document onde está chat
                Chat.getRef().doc(doc.id).get().then(chat =>{
                    success(chat);
                }).catch(err =>{fail(err)});
            }).catch(err =>{fail(err)});
        });
    }
    // find email from users to chat
    static find(meEmail, contactEmail){
        // method where('quem procuro','condição','tipo')
        // qual é o chat que tem os dois email igual true
        return Chat.getRef().where(btoa(meEmail),'==', true).where(btoa(contactEmail),'==',true).get();
    }
    // create chat if not exists
    static createChatIfNotExists(meEmail, contactEmail){
        return new Promise((success, fail) =>{
            // verify if chat exists for me and contact
            Chat.find(meEmail, contactEmail).then(chats =>{
                // verify if chats is empty
                if(chats.empty){
                    // create
                    Chat.create(meEmail, contactEmail).then(chat =>{
                        success(chat);
                    });
                }else{
                    // show list chats
                    chats.forEach(chat =>{
                        success(chat);
                    });
                }
            }).catch(err =>{
                console.error(err);
            });
        });
    }
}