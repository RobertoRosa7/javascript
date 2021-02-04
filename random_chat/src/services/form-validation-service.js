import Format from "../utils/format";

export default class FormValidationService{
    constructor(form){
        this.validationsState = new Set();
        this.durty = {};
        this.form = form;
        this.el = {};

        this.form.querySelectorAll('[id]').forEach(element => {
            this.el[Format.formatToCamelCase(element.id)] = element;
        });
        
        this.fields = Object.keys(this.form.toJSON());

        this.fields.forEach(field => {
            this.form.querySelectorAll('input').forEach(input => {
                if(input.getAttribute('name') == field){
                    input.on('keyup', e => {
                        let value = e.target;
                        let nodename = e.target.nodeName;
                        if(nodename == 'INPUT') this.validate(value);
                        this.form.dispatchEvent(new CustomEvent('form', {detail:this.validationsState}));
                    });
                }
            });
        });
        this.rules = {
            code:input => {
            },
            name:input => {
                const name = /[A-Za-z0-9]{6,}/;
                const value = input.value;
                const inputname = input.name;
                const isValid = name.test(value);

                isValid ? this.manageState.removeFromState({input, inputname}) : this.manageState.addToState({input, inputname});
                return isValid;
            },
            email:input => {
                // const email = /@/;
                const email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                const value = input.value;
                const inputname = input.name;
                const isValid = email.test(value);
                const msg = 'Digite um e-mail válido.'
                
                isValid ? this.manageState.removeFromState({input, inputname}) : this.manageState.addToState({input, inputname, msg});
                return isValid;
            },
            password:input => {
                const password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/g;
                const value = input.value;
                const inputname = input.name;
                const isValid = password.test(value);
                // const msg = 'Senha deve conter uma caracter maiúsculo, um caracter especial'
                const msg = 'Senha obrigatória.'

                isValid ? this.manageState.removeFromState({input, inputname}) : this.manageState.addToState({input, inputname, msg});
                return isValid;
            },
            empty:(tab = 1) => {
                const fields = [...this.form.elements].filter(item => item.nodeName === 'INPUT');
                [...fields].forEach(field => {
                    const formActive = field.parentNode.parentNode.parentNode.parentNode;
                    if(formActive.getAttribute('tabindex') == tab){
                        formActive.querySelectorAll('[name]').forEach(input => {
                            let value = input.value;
                            let inputname = input.name;
                            let msg = 'Campo vazio';
                            (value) ? this.manageState.removeFromState({input, inputname}) : this.manageState.addToState({input, inputname, msg});
                        });
                    }
                });
            }
        }
        this.manageState = {
            addToState: inputData => {
                const action = 'show';
                const { input, inputname, msg } = inputData;

                this.validationsState.add(inputname);
                this.manipulateValidationMsg({input, action, msg});
            },
            removeFromState: inputData => {
                const action = 'hide';
                const { input, inputname } = inputData;

                this.validationsState.delete(inputname);
                this.manipulateValidationMsg({input, action});
            },
            validateState: (tab) => {
                if(this.validationsState.size > 0) return false;

                if(this.validationsState.size === 0){
                   this.rules.empty(tab);
                }
            }
        }
    }
    manipulateValidationMsg(validationData){
        const { input, action, msg } = validationData;
        const small = input.nextElementSibling;
        const parent = input.parentNode;
        if(action == 'hide'){
            parent.css({ background:'var(--color-dark-light)' });
        }else{
            parent.css({ background:'var(--color-form-invalid)' });
        }
    }
    validate(input){
        return this.rules[`${input.name}`](input);
    }
}
