class HcodeFileReader{
    constructor(inputEl, imgEl){
        // modal create
        this.inputEl = inputEl;
        // modal img
        this.imgEl = imgEl;
        // inicialização do evento
        this.initInputEvent();
    }
    // inicialização do evento input
    initInputEvent(){
        // selecionando modal create e ouvindo possíveis mudança de evento
        document.querySelector(this.inputEl).addEventListener('change', e=>{
            // chamada do metodo com promisa da imagem carregada
            this.reader(e.target.files[0]).then(result =>{
                // aplicando imagem ao source
                document.querySelector(this.imgEl).src = result;
            });
        });
    }
    // carregar imagem para preview
    reader(file){
        // nova promesa
        return new Promise((resolve, reject) =>{
            // instancia do filereader
            let reader = new FileReader();
            // carregamento da imagem
            reader.onload = function(){
                // resolve se não ocorrer error
                resolve(reader.result);
            }
            // se ocorrer erros
            reader.onerror = function(){
                reject('Não foi possível ler a imagem');
            }
            // aplicar encode url no arquivo
            reader.readAsDataURL(file);
        });
    }
}