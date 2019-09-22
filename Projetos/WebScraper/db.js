const firebase = require('firebase');
// importando módulo firebase

require('firebase/firestore');
// importando storage do firebase

firebase.initializeApp({
// objeto de inicialização do firebase default

    apikey: 'AIzaSyCvutMJVv27QKQjeFIy6tEO73-8a_MMe1o',
    authDomain: 'api-restaurant-1339a.firebaseapp.com',
    databaseURL: "https://api-restaurant-1339a.firebaseio.com",
    storageBucket: "api-restaurant-1339a.appspot.com",
    projectId: 'api-restaurant-1339a',
    
});

const db = firebase.firestore();
// executando a função de storage do firebase 

db.settings({
// objeto para configuração do bando de dados no firebase

    // timestampsInSnapshots: true
});

module.exports = db;