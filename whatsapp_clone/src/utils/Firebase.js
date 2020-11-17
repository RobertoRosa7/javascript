const firebase = require('firebase');
require('firebase/firestore');
//require('firebase/auth');
//import firebase from 'firebase/app';
//import 'firebase/firestore';

export class Firebase{
    constructor(){
        this._config = {
            apiKey: "AIzaSyDXS6FX96y2UB-l4NuMztDZX-novqzerU4",
            authDomain: "whatsappclone-f90a2.firebaseapp.com",
            databaseURL: "https://whatsappclone-f90a2.firebaseio.com",
            projectId: "whatsappclone-f90a2",
            storageBucket: "whatsappclone-f90a2.appspot.com",
            messagingSenderId: "581936291707"
        };
        //this._initialized = true; not necessary use
        this.init();
    }
    // method that active others
    init(){
        // verify if there no have other app on firebase initialized
        // change from !this._initialized to !window.initializedFirebase, use Global
        if(!window._initializedFirebase){
            firebase.initializeApp(this._config);
            // ativa snapshot pra ficar constantemente de olho
            firebase.firestore().settings({
                timestampsInSnapshots:true
            });
            window.initializedFirebase = true;
        }
    }
    // firebase - database
    static db(){
        return firebase.firestore();
    }
    // firebase - storage
    static hd(){
        return firebase.storage();
    }
    // method auth firebase
    googleAuth(){
        // promise of authentication from Google
        return new Promise((resolve, reject) =>{
            // provider Google for auth, we can use Facebook or Twitter too
            let provider = new firebase.auth.GoogleAuthProvider();
            // Google irá abrir uma janela pedindo autenticação
            firebase.auth().signInWithPopup(provider).then(result =>{
                // receive token 
                let token = result.credential.accessToken;
                // receive data user
                let user = result.user;
                // resolve the promise with success
                resolve({
                    user,
                    token
                });
            }).catch(err =>{
                // possible error code
                let erroCode = err.code;
                let erroMessage = err.message;
                // the email of the user's account used
                let email = err.email;
                // the firebase.auth.AuthCredential type that was used
                let credential = err.credential;
                reject(err);
            });
        });
    }
}