// novo metodo para class HTMLFormElement
HTMLFormElement.prototype.save = function(settings){
    // define este elemento na var form
    let form = this;
    // adiciona evento de submit
    form.addEventListener('submit', e =>{
        //bloqueando evento padrão de envio
        e.preventDefault();
        // nova instancia do classe formdata
        let formData = new FormData(form);
        // recuperando dados
        fetch(form.action, {
            method: form.method,
            body: formData
        }).then(response => response.json()).then(json =>{
            if(json.error){
                if(typeof settings.failure === 'function') settings.failure(json.error);
            }else{
                if(typeof settings.success === 'function') settings.success(json);
            }
        }).catch(err =>{
            if(typeof settings.failure === 'function') settings.failure(err);
        });
    });
}