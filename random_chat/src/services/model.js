import CreateEvent from "../utils/createEvents";

export default class Model extends CreateEvent{
	constructor(){
		super();
		this.data = {};
	}
	fromJson(json){
		this.data = Object.assign(this.data, json);
		this.trigger('datachange', this.toJson());
	}
	toJson(){
		return this.data;
	}
	onSuccess(){
		this.indexedDBMessages = window.indexedDB.open('messages', 3);
		this.indexedDBMessages.onupgradeneeded = e => 
			this.indexedDBMessages.result.createObjectStore('messages', { keyPath: 'key_path'});
		
		return new Promise(resolve => 
			this.indexedDBMessages.onsuccess = e => resolve(e.target.result));
	}
	onError(){
		return new Promise(resolve => 
			this.indexedDBMessages.onerror = e => resolve(e.target.result));
	}
	onCreate(payload){
		this.onSuccess().then(database => database.transaction('messages', 'readwrite')
			.objectStore('messages').add(payload).onsuccess = e => this.trigger('messagechange', payload))
	}
	getAll(){
		return new Promise(resolve => 
			this.onSuccess().then(database => database.transaction('messages')
				.objectStore('messages').getAll().onsuccess = e => resolve(e.target.result)))
	}
}