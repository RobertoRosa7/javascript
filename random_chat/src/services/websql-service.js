import Messages from './messages';

export default class Database {
    constructor() {
        this.db = openDatabase('random_chat', '1.0', 'web database', 2 * 1024 * 1024);

        this.createTableBlackList();
        this.createTableUsers();

        // this.database;
        // this.dbname = 'clientes';

        // this.DadosClientes = [
        //     { ssn: "444-44-4444", nome: "Bill", idade: 35, email: "bill@company.com" },
        //     { ssn: "555-55-5555", nome: "Donna", idade: 32, email: "donna@home.org" }
        // ]
        // this.request.onerror = event => {
        //     console.log(event.target, 'sem permissão');
        // }

        // this.request.onsuccess = event => {
        //     this.database = this.request.result;

        //     // this.database.transaction("clientes")
        //     //     .objectStore("clientes")
        //     //     .get("444-44-4444")
        //     //     .onsuccess = event => {
        //     //         console.log(this.request.result);
        //     //   };
        //     // var transaction = this.database.transaction(['clientes']);
        //     // var store = transaction.objectStore('clientes');
        //     // var req = store.get('444-44-4444');

        //     // req.onsuccess = e => console.log(req.result);
        //     // console.log(transaction);
        // }

        // this.request.onupgradeneeded = event => {
        //     const db = event.target.result;

        //     // Cria um objectStore para conter a informação sobre nossos clientes. Nós vamos
        //     // usar "ssn" como key path porque sabemos que é único;
        //     const store = db.createObjectStore('clientes',{ keyPath:'ssn' });

        //     // Cria um índice para buscar clientes pelo nome. Podemos ter nomes
        //     // duplicados, então não podemos usar como índice único.
        //     // store.createIndex("nome", "nome", { unique: false });

        //     // Cria um índice para buscar clientes por email. Queremos ter certeza
        //     // que não teremos 2 clientes com o mesmo e-mail;
        //     // store.createIndex("email", "email", { unique: true });

        //     // Usando transação oncomplete para afirmar que a criação do objectStore
        //     // é terminada antes de adicionar algum dado nele.
        //     store.transaction.oncomplete = e => {
        //         // Armazenando valores no novo objectStore
        //         const clientesStore = db.transaction('clientes', 'readwrite').objectStore('clientes');
        //         for(let i in this.DadosClientes){
        //             clientesStore.add(this.DadosClientes[i]);
        //         }
        //     }
        // }

        // this.createIndexdb('clientes');
        // this.databaseIsReady()
        //     .then(res => {
        //         const payload = { ssn:"11-11", nome: "kakashi", idade: 32, email: "kakashi@gmail.com" }

        //         // this.addData(res, payload)
        //         //     .then(client => console.log(client));

        //         // this.getClients(res,'kakashi@gmail.com')
        //         //     .then(client => console.log(client));

        //         // this.deleteData(res, '11-11')
        //         //     .then(() => {});

        //         // this.getAllData(res)
        //         //     .then(e => console.log(e));
        // });
    }

    // create table dynamic coming soon
    createTableBlackList() {
        const query = `CREATE TABLE IF NOT EXISTS black_list(id unique,chipher,email,exceeded_reset,time_start)`;
        this.db.transaction((exec) => exec.executeSql(query));
    }
    createTableUsers() {
        const query = `CREATE TABLE users(
            id unique,
            name,
            email unique,
            photo,
            password,
            token)`;
        this.db.transaction((exec) => exec.executeSql(query));
    }
    createUser(user) {
        const query = `INSERT INTO users(
            id,
            name,
            email,
            photo,
            password,
            token)VALUES(?,?,?,?,?,?)`;
        const array = [user.id, user.name, user.email, user.photo, user.password, user.token];
        this.db.transaction((exec) => exec.executeSql(query, array));
    }
    insertTable(table, payload) {
        this.db.transaction((exec) => {
            const query = `INSERT INTO ${table}(id,chipher,email,exceeded_reset,time_start)VALUES(?,?,?,?,?)`;
            const array = [
                payload.id,
                payload.chipher,
                payload.email,
                payload.exceeded_reset,
                payload.time_start,
            ];
            exec.executeSql(query, array);
        });
    }
    select(table) {
        return new Promise((resolve) => {
            const register = [];
            this.db.transaction((exec) => {
                exec.executeSql(
                    `SELECT * FROM ${table}`,
                    [],
                    (tx, result) => {
                        for (let i = 0; i < result.rows.length; i++) {
                            register.push(result.rows.item(i));
                        }
                    },
                    null
                );
            });
            setTimeout(() => resolve(register), 300);
        });
    }
    selectByEmail(table, email) {
        return new Promise((resolve) => {
            this.db.transaction((exec) => {
                const query = `SELECT * FROM ${table} WHERE email=?`;
                exec.executeSql(
                    query,
                    [email],
                    (tx, result) => {
                        result.rows.length > 0 ? resolve(result.rows[0]) : resolve(null);
                    },
                    null
                );
            });
        });
    }
    delete(table, email) {
        this.db.transaction((exec) => {
            const query = `DELETE FROM ${table} WHERE email=?`;
            exec.executeSql(query, [email]);
        });
    }
    dropTable(table) {
        this.db.transaction((exec) => {
            exec.executeSql(
                `DROP TABLE ${table}`,
                [],
                (exec, results) => console.info('Table Dropped'),
                (exec, error) => console.error('Error: ' + error.message)
            );
        });
    }

    databaseIsReady(db) {
        return new Promise((resolve) => (db.onsuccess = (e) => resolve(e.target.result)));
    }
    getData(ref, name, id) {
        return new Promise(
            (resolve) =>
                (ref.transaction(name, 'readonly').objectStore(name).get(id).onsuccess = (e) =>
                    resolve(e.target.result))
        );
    }
    addData(ref, payload, name) {
        return new Promise(
            (resolve) =>
                (ref.transaction(name, 'readwrite').objectStore(name).add(payload).onsuccess = (
                    e
                ) => resolve(e.target.result))
        );
    }
    insertContacts(ref, name, payloads) {
        return new Promise((resolve) => {
            const storeContacts = ref.transaction(name, 'readwrite').objectStore(name);
            for (let i in payloads) {
                storeContacts.add(payloads[i]);
            }
            resolve(storeContacts);
        });
    }
    deleteData(ref, name, id) {
        return new Promise(
            (resolve) =>
                (ref.transaction(name, 'readwrite').objectStore(name).delete(id).onsuccess = (e) =>
                    resolve(e.target.result))
        );
    }
    getAllData(ref, name) {
        return new Promise((resolve) => {
            ref.transaction(name, 'readonly').objectStore(name).getAll().onsuccess = (e) =>
                resolve(e.target.result);
        });
    }
    addMessage(ref, name, payload) {
        return new Promise((resolve) => {
            ref.transaction(name, 'readwrite').objectStore(name).add(payload).onsuccess = (e) =>
                resolve(e.target.result);
        });
    }
    createIndexdb(name) {
        return new Promise((resolve) => {
            const db = window.indexedDB.open(name, 2);
            db.onupgradeneeded = (e) => db.result.createObjectStore(name, { keyPath: 'email' });
            resolve(db);
        });
    }
    createIndexdbChat(name) {
        return new Promise((resolve) => {
            const db = window.indexedDB.open(name, 3);
            db.onupgradeneeded = (e) => db.result.createObjectStore(name, { autoIncrement: true });
            resolve(db);
        });
    }
    getAllMessages(store) {
        return new Promise((resolve) => {
            this.createIndexdbChat(store).then((db) =>
                this.databaseIsReady(db).then((ref) =>
                    this.getAllData(ref, store).then((result) => resolve(result))
                )
            );
        });
    }
    addMessage(store, payload) {
        return new Promise((resolve) => {
            this.createIndexdbChat(store).then((db) =>
                this.databaseIsReady(db).then((data) =>
                    this.addData(data, payload, store).then((result) =>
                        Messages.sendMessage(payload).then((succes) => resolve(succes))
                    )
                )
            );
        });
    }
    addMessageLocal(store, payload) {
        return new Promise((resolve) => {
            this.createIndexdbChat(store).then((db) =>
                this.databaseIsReady(db).then((data) =>
                    this.addData(data, payload, store).then((result) => resolve(result))
                )
            );
        });
    }
    addAllMessages(store, payloads) {
        return new Promise((resolve) => {
            this.createIndexdbChat(store).then((db) =>
                this.databaseIsReady(db).then((data) => {
                    const messages = data.transaction(store, 'readwrite').objectStore(store);
                    for (let i in payloads) {
                        messages.add(payloads[i]);
                    }
                    resolve(messages);
                })
            );
        });
    }
    countAllMessages(store) {
        return new Promise((resolve) => {
            this.createIndexdbChat(store).then((db) =>
                this.databaseIsReady(db).then((ref) =>
                    this.getAllData(ref, store).then((result) => resolve(result.length))
                )
            );
        });
    }
    filterContactActive(contact, messages) {
        return new Promise((resolve) =>
            resolve(messages.filter((message) => message.chatId == contact.chatId)).sort((a, b) => {
                if (a.timestamp > b.timestamp) return 1;
                if (a.timestamp < b.timestamp) return -1;
                return 1;
            })
        );
    }
    saveMessagesOnIndexedb(contact) {
        return new Promise(async (resolve) =>
            resolve(
                await this.addAllMessages('chats', await this.fetchContactsFromFirebase(contact))
            )
        );
    }
    countAllMessagesComingFirebase(contact) {
        return new Promise(async (resolve) => {
            const contacts = await this.fetchContactsFromFirebase(contact);
            resolve(contacts.length);
        });
    }
    fetchContactsFromFirebase(contact) {
        return new Promise((resolve) => {
            const accumated = [];
            Messages.getRef(contact.chatId)
                .orderBy('timestamp')
                .onSnapshot((docs) => {
                    docs.forEach((doc) => {
                        let data = doc.data();
                        let payload = { ...data, id: doc.ref.id };
                        accumated.push(data);
                    });
                });
            setTimeout(async () => resolve(accumated), 700);
        });
    }
}
