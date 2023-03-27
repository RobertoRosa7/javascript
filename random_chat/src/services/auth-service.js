import Firebase from './firebase';

export default class Auth {
    constructor() {
        this.fbService = new Firebase();
    }
    async initAuth() {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await this.fbService.initAuth());
            } catch (e) {
                reject(e);
            }
        });
    }
    async initAuthWidthEmailPassword(payload) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await this.fbService.initLoginWidthEmail(payload));
            } catch (e) {
                reject(e);
            }
        });
    }
}
