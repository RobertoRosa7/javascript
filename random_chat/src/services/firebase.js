import Database from './websql-service';

const firebase = require('firebase');
require('firebase/firestore');

export default class Firebase {
	constructor(){
		this.db = new Database();

		this.firebaseConfig = {
			apiKey: "AIzaSyDXS6FX96y2UB-l4NuMztDZX-novqzerU4",
			authDomain: "whatsappclone-f90a2.firebaseapp.com",
			databaseURL: "https://whatsappclone-f90a2.firebaseio.com",
			projectId: "whatsappclone-f90a2",
			storageBucket: "whatsappclone-f90a2.appspot.com",
			messagingSenderId: "581936291707",
			appId: "1:581936291707:web:d58418711ca3f5933ce7de"
		};

		this.initialize = false;
		this.init();
	}

	init(){
		if(!window.initializeFirebase) {
			firebase.initializeApp(this.firebaseConfig);
			window.initializeFirebase = true;
		}
	}
	
	static database(){ return firebase.firestore(); }
	static storage(){ return firebase.storage(); }

	initAuth(){
		return new Promise(async (resolve, reject) => {
			try{
				const provider = new firebase.auth.GoogleAuthProvider();
				const response = await firebase.auth().signInWithPopup(provider);
				const payload = {
					"token":response.credential.accessToken,
					"id":response.user.uid,
					"name":response.user.displayName,
					"email":response.user.email,
					"photo":response.user.photoURL,
					"password":null
				}
				delete payload.password;
				const db = await this.db.createIndexdb('users');
				const data = await this.db.databaseIsReady(db);
				const user = await this.db.getData(data, 'users', payload.email);

				if(!user){
					await this.db.addData(data, payload, 'users');
					resolve(payload);
				}else{
					resolve(user);
				}
				// if(user) resolve(user);
				// if(localStorage.getItem('user')){
				//     resolve(JSON.parse(localStorage.getItem('user')));
				// }else{
				//     const auth = await firebase.auth().signInWithPopup(provider);
				//     localStorage.setItem('user', JSON.stringify({token:auth.credential.accessToken, user:auth.user}));
				//     resolve({token: auth.credential.accessToken, user: auth.user});
				// }
			}catch(e){ reject(e) }
		});
	}

	initLoginWidthEmail(payload){
		return new Promise(async (resolve, reject) => {
			try{
				const response = await firebase.auth()
					.createUserWithEmailAndPassword(payload.email, payload.password);
				
				const payloadUser = {
					"id":response.user.uid,
					"email":response.user.email,
					"name":response.user.displayName,
					"photo":response.user.photoURL,
					"password": payload.password,
					"token":''
				}
				const db = await this.db.createIndexdb('users');
				const data = await this.db.databaseIsReady(db);
				const user = await this.db.getData(data, 'users', payload.email);
				
				if(!user){
					await this.db.addData(data, payload, 'users');
					resolve(payloadUser);
				}else{
					resolve(user);
				}
				// if(localStorage.getItem('user')){
				//     resolve(JSON.parse(localStorage.getItem('user')));
				// }else{
				//     const auth = await firebase.auth()
				//         .createUserWithEmailAndPassword(payload.email, payload.password);
				//     // localStorage.setItem('user', JSON.stringify({token:auth.credential.accessToken, user:auth.user}));
				//     // resolve({token: auth.credential.accessToken, user: auth.user});
				//     resolve(auth);
				// }
			}catch(e){ reject(e) }
		});
	}
}