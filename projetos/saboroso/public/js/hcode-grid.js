class HcodeGrid{
    constructor(settings){
        // mesclando objetos para um novo com Object.assign()
        settings.listeners = Object.assign({},{
            afterUpdateClick:e =>{
                // abrindo modal pelo JQuery
                $('#modal-update').modal('show');
            },

            afterDeleteClick: e =>{
                window.location.reload();
            },

            afterFormCreate: e =>{
                window.location.reload();
            },

            afterFormUpdate: e =>{
                window.location.reload();
            },

            afterFormCreateError: e =>{
                alert('Não foi possível enviar o formulário!');
            },

            afterFormUpdateError: e =>{
                alert('Não foi possível atualiar o formulário');
            }

        }, settings.listeners);

        this.options = Object.assign({}, {
            formUpdate:'#modal-update form',
            formCreate:'#modal-create form',
            btnUpdate:'btn-update',
            btnDelete:'btn-delete',
            onUpdateLoad:(form,name,data)=>{
                let input = form.querySelector(`[name=${name}]`);
                
                if(input) input.value = data[name];
            }
        }, settings);
        
        this.rows = [...document.querySelectorAll('table tbody tr')];
        this.initButtons();
        this.initForms();
    }
    initForms(){
        // verificar se form existe - possíveis erros em outras páginas
        if(this.formCreate){
            // selecionando formulário create
            this.formCreate = document.querySelector(this.options.formCreate);
                
            // salvando dados do formulário
            this.formCreate.save({
                success: () =>{
                    this.fireEvents('afterFormCreate');
                },
                failute: () =>{
                    this.fireEvents('afterFormCreateError');
                }
            });
        }
        if(this.formUpdate){
            // selecionando formulário update
            this.formUpdate = document.querySelector(this.options.formUpdate);
                    
            // atualizando dados do formulário
            this.formUpdate.save({
                success:()=>{
                    this.fireEvents('afterFormUpdate');
                },
                failure: () =>{
                    this.fireEvents('afterFormUpdateError');
                }
            });
        }
    }

    // chamador de eventos
    fireEvents(name, args){
        if(typeof this.options.listeners[name] === 'function') this.options.listeners[name].apply(this, args);
    }

    // return dados da tr
    trData(e){
        // recuperar tr da tabela com objeto json
        let tr = e.originalTarget.offsetParent.parentElement;
            
        // converte os dados em objeto
        let data = JSON.parse(tr.dataset.row);

        return data;
    }

    // button update
    btnUpdateClick(e){
        // adicionar evento de beforeUpdate
        //this.fireEvents('beforeUpdateClick',[e]);
            
        let data = this.trData(e);

        // percorrendo cada atributo e valor do objeto
        for(let name in data){
            this.options.onUpdateLoad(this.formUpdate,name,data);
        }

        this.fireEvents('afterUpdateClick',[e]);
    }

    // button delete
    btnDeleteClick(e){
        let data = this.trData(e);
        // eval para template string mais concatenação das cráses
        if(confirm(eval('`' + this.options.deleteMsg + '`'))){
            // remove item da lista
            fetch(eval('`' + this.options.deleteUrl + '`'), {
                method: 'DELETE'
            }).then(response => response.js()).then(json =>{
                this.fireEvents('afterDeleteClick');
            });
        }
    }

    // initialização dos eventos de botões
    initButtons(){
        // percorrendo todas as linha da tabela
        this.rows.forEach(row =>{
            // percorrendo todas os butões das linhas
            [...row.querySelectorAll('.btn')].forEach(btn =>{
                // adicinando evento de click em cada botão
                btn.addEventListener('click', e =>{
                    // verificando se existe class btn-update
                    if(e.target.classList.contains(this.options.btnUpdate)){
                        this.btnUpdateClick(e);
                    }else if(e.target.classList.contains(this.options.btnDelete)){
                        this.btnDeleteClick(e);
                    }else{
                        this.fireEvents('buttonClick',[e.target, this.trData(e), e]);
                    }
                });
            });
        });
    }
}