export default class Errors {
    constructor(){
        this.errors = [];
        console.log(this.errors);
    }
    static throwErrors(error){
        const fetch = [];
        fetch.push(error);

        this.errors = fetch;
    }
}