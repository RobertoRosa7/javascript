export class Format{
	// método estático para converte id em camelcase
	static getCamelCase(text){
		// criação de um elemento HTML para o dataset
		let div = document.createElement('div');

		// elemento filho que conterá o dataset
		div.innerHTML = `<div data-${text}="id"></div>`;

		// Object.keys() retorna todas as chaves do array encontrada
		return Object.keys(div.firstChild.dataset)[0];
	}
	// format date time 
	static toTime(duration){
		let seconds = parseInt((duration / 1000) % 60);
		let minutes = parseInt((duration / (1000 * 60)) % 60);
		let hours = parseInt((duration /(1000 * 60 * 60)) % 24);

		if(hours > 0){
			return `${hours}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
		}else{
			return `${minutes}:${seconds.toString().padStart(2,'0')}`;
		}
	}
	// date to time
	static dateToTime(date, locale = 'pt-BR'){
		// return native method toLocaleTimeString
		return date.toLocaleTimeString(locale, {
			hour:'2-digit',
			minute: '2-digit'
		});
	}
	// convert timeStamp firebase to time
	static timeStampToTime(timeStamp){
		// verify if exists timeStamp and typeof is method
		return (timeStamp && typeof timeStamp.toDate === 'function') ? Format.dateToTime(timeStamp.toDate()) : '';
	}
}