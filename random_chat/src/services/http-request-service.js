export default class HttpRequestService {
    constructor() {
        this.api = new XMLHttpRequest();
        this.host = 'http://localhost:9000';
    }

    get(path) {
        return new Promise((resolve, reject) => {
            this.api.open('GET', path);
            this.api.onload = () => {
                this.api.readyState == 4 && this.api.status == 200
                    ? resolve(this.api.response)
                    : reject({ error: true });
            };
            this.api.onerror = (err) => reject(err);
            this.api.send();
        });
    }
    post(payload, path) {
        return new Promise((resolve, reject) => {
            this.api.open('POST', path, true);
            // this.api.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            this.api.setRequestHeader('Content-type', 'application/json');
            this.api.onload = () => {
                this.api.DONE && this.api.status === 200
                    ? resolve(this.api.response)
                    : reject({ error: true });
            };
            // this.api.onloadend = e => console.log('end',e);
            // this.api.onloadstart = e => console.log('start',e);
            // this.api.onprogress = e => console.log('progress',e)
            this.api.onerror = (err) => console.error(err);
            // this.api.send("fname=Henry&lname=Ford"); //working
            // this.api.send(JSON.stringify({status:true})); //working
            this.api.send(payload);
        });
    }

    async getTeste() {
        return Promise.resolve(await this.get(this.host + '/api/v1/teste'));
    }
    async postTeste(payload) {
        return Promise.resolve(await this.post(payload, this.host + '/api/v1/teste2'));
    }
    async resetPasswordl(payload) {
        return Promise.resolve(await this.post(payload, this.host + '/api/v1/reset_password'));
    }
    async validateCode(payload) {
        return Promise.resolve(await this.post(payload, this.host + '/api/v1/validate_code'));
    }
}
