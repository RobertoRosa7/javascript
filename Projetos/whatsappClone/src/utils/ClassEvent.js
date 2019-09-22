export class ClassEvent{
    constructor(){
        this._events = {};
    }
     // criando evento para ficar escutando se ocorrer play de record audio
     on(eventName, fn){
        // verificar se já existe algum evento no elemento se não cria um Array
        if(!this._events[eventName]) this._events[eventName] = new Array();
      
        // adicionando funções no array para execução
        this._events[eventName].push(fn);
    }
    // executar play com um ou mais argumentos
    trigger(){
        // arguments é nativo de todas as funções javascript, passando ou não
        // arguments não é um array deve ser convertido usando spread
        let args = [...arguments];
        
        // shift remover primeiro elemento do array porque o primeiro parâmetro será
        // o nome do evento
        let eventName = args.shift();
        
        // adicionando novos eventos
        args.push(new Event(eventName));
        
        // verificando se há ouvintes no evento de play e se é uma instancia de array
        if(this._events[eventName] instanceof Array) {
            // percorrendo cada eventos dentro da instancia de array
            this._events[eventName].forEach(fn => {
                // executando a função que foi achada dentro do array apply() executa metodo
                fn.apply(null, args);
            });
        }
    }
}