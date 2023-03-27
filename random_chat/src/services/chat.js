import Model from './model';
import Firebase from './firebase';

export default class ChatService extends Model {
    constructor() {
        super();
    }

    get users() {
        return this.data.users;
    }
    set users(value) {
        this.data.users = value;
    }

    get timestamp() {
        return this.data.timestamp;
    }
    set timestamp(value) {
        this.data.timestamp = value;
    }

    static getRef() {
        return Firebase.database().collection('/chats');
    }
    static createIfNotExists(meEmail, contactEmail) {
        return new Promise(async (resolve, reject) => {
            try {
                const chats = await ChatService.find(meEmail, contactEmail);
                chats.empty
                    ? resolve(await ChatService.createChat(meEmail, contactEmail))
                    : chats.forEach((chat) => resolve(chat));
            } catch (e) {
                reject(e);
            }
        });
    }
    static find(meEmail, contactEmail) {
        return ChatService.getRef()
            .where(btoa(contactEmail), '==', true)
            .where(btoa(meEmail), '==', true)
            .get();
    }
    static createChat(meEmail, contactEmail) {
        return new Promise(async (resolve, reject) => {
            const users = {};
            users[btoa(meEmail)] = true;
            users[btoa(contactEmail)] = true;

            try {
                const doc = await ChatService.getRef().add({ users, timestamp: new Date() });
                const chat = await ChatService.getRef().doc(doc.id).get();
                resolve(chat);
            } catch (e) {
                reject(e);
            }
        });
    }
}
