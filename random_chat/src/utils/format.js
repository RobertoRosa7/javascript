export default class Format {
    constructor(){
        this.interval;
    }
    static formatToCamelCase(text){
        let div = document.createElement('div');
        div.innerHTML = `<div data-${text}="id"></div>`;
        return Object.keys(div.firstChild.dataset)[0];
    }
    static formatDateToBrazilian(date){
        return new Intl.DateTimeFormat('pt-BR').format(date);
    }
    static formatHourToBrazilian(hour){
        const options = {
            // year: 'numeric', 
            // month: 'numeric', 
            // day: 'numeric',
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric',
            hour12: false,
            timeZone: 'America/Sao_Paulo'
        };
        return new Intl.DateTimeFormat('pt-BR', options).format(hour);
    }
    static timeStampToTime(timestamp){
        return (timestamp && typeof timestamp.toDate === 'function') ? Format.dateToTime(timestamp.toDate()) : '';
    }
    static toTime(duration){
        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if(hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        else return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    static dateToTime(isoDate, locale = 'pt-BR'){
        return isoDate.toLocaleTimeString(locale, { hour:'2-digit', minute:'2-digit'});
        // return new Date(isoDate).toLocaleTimeString('pt-BR', {hours:'2-digits', minutes:'2-digits'});
    }
    static formatNameFromImage(filetype){
        return filetype.split('/')[1].toUpperCase();
    }
    
    static abrevName(string){
        const result = (string.match(/ d./i)) ? string.match(/ d./i)[0] : ' ';
        const novaString = String.raw`${string}`.replace(result, ' ').split(/[_. ,@$^*/\\-]/).filter(char => char != '');
        return (novaString[0][0] + novaString[1][0]).toUpperCase();
    }
    static formatBytes(b){
        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB','YB'];
        let l = 0;
        let n = parseInt(b, 10) || 0;

        while(n >= 1024 && ++l){
            n = n / 1024;
        }
        return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
    }
    static createUid(){
        let timestamp = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
            let r = (timestamp + Math.random() * 16) % 16 | 0;
            timestamp = Math.floor(timestamp/16);
            return (char === 'x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    }
    timerRegressive(duration, display){
        var timer = duration, minutes, seconds, hours;

        this.interval = setInterval(() => {
            hours = parseInt((timer / 3600) % 24, 10);
            minutes = parseInt((timer / 60) % 60, 10);
            seconds = parseInt(timer % 60, 10);

            hours   = (hours < 10) ?    "0" + hours   : hours;
            minutes = (minutes < 10) ?  '0' + minutes : minutes;
            seconds = (seconds < 10) ?  '0' + seconds : seconds;
            
            display.innerHTML = hours + ':' + minutes + ':' + seconds;

            if(--timer < 0){
                this.clearInterval(this.interval);
                display.dispatchEvent(new Event('timeout'));
                display.innerHTML = '<span style="color:var(--color-red); font-size:12px;">Time out</span>';
            }
        },1000);
    }

    clearInterval(){
        clearInterval(this.interval);
    }

    static inputMask(element, mask){
        const optionsMask = {
            leech:value => value.replace(/o/gi,'0').replace(/i/gi,"1").replace(/z/gi,"2").replace(/e/gi,"3").replace(/a/gi,"4").replace(/s/gi,"5").replace(/t/gi,"7").replace(/o/gi,'0'),
            cpf:value =>{
                element.setAttribute('maxLength', '14');
                return value.replace(/\D/g,'').replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2")
            },
            code:value => {
                element.setAttribute('maxLength', '6');
                return value.replace(/(\w{1})(\w)$/, "$1-$2");
            },
            phone:value => value.replace(/\D/g,'').replace(/^(\d\d)(\d)/g,"($1) $2").replace(/(\d{4})(\d)/,"$1-$2"),
            cep:value => value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, "$1-$2"),
            numbers:value => value.replace(/\D/g, ''),
            date:value => value.replace(/\D/, '').replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/,"$1/$2").replace(/(\d{2})(\d{2})$/, "$1$2")
        }
        return optionsMask[mask](element.value);
    }
    static removeMask(value, mask){
        const optionsMask = {
            code:value => value.replace(/-/g,'')
        }
        return optionsMask[mask](value);
    }
}