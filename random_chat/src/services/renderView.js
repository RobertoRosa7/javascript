import Format from "../utils/format";
import CreateEvent from "../utils/createEvents";

export default class RenderView extends CreateEvent{
	constructor(){
		super();
	}
	static messageText(msg){
		return `
			<div id="_${msg.id}">
				<div class="container-cb">
					<div class="cb">
						<span class="name">
							${msg.name}
							<i class="tiny material-icons">arrow_drop_down</i>
						</span>
						<span class="content">${msg.content}</span>
						<time class="time">
							<i style="font-size:10px" class="double-checked tiny material-icons">${msg.icon}</i>
							&nbsp;
							${Format.timeStampToTime(msg.timestamp)}
						</time>
					</div>
				</div>
			</div>
		`;
	}
	static messageAudio(msg){
		return `
			<div id="_${msg.id}">
				<div class="container-cb">
					<div class="cb">
						<span class="name">${msg.name}</span>
						<div class="audio-play">
							<span id="play-audio-receive">
									<i class="play tiny material-icons">play_arrow</i>
									<i class="pause tiny material-icons">pause</i>
							</span>
							<progress max="100" value="50"><progress>
						</div>
						<time class="time">
							<i style="font-size:10px" class="double-checked tiny material-icons">${mgs.icon}</i>
							&nbsp;
							${Format.timeStampToTime(msg.timestamp)}
						</time>
					</div>
				</div>
			</div>
		`;
	}
	static messageVideo(msg){
		return `
			<div id="_${msg.id}">
				<div class="container-cb">
					<div class="cb">
						<span class="name">${msg.name}</span>
						<span>${msg.message}</span>
						<time style="color: var(--color-light); display:flex;" class="time">
							<i style="font-size:10px" class="double-checked tiny material-icons">${msg.icon}</i>
							&nbsp;
							${Format.timeStampToTime(msg.timestamp)}
						</time>
					</div>
				</div>
			</div>
		`;
	}
	static messageDocument(msg){
		return `
			<div id="_${msg.id}">
				<div class="container-cb">
					<div class="cb">
						<span class="name">${msg.name}</span>
						<span>${msg.message}</span>
						<time style="color: var(--color-light); display:flex;" class="time">
							<i style="font-size:10px" class="double-checked tiny material-icons">${msg.icon}</i>
							&nbsp;
							${Format.timeStampToTime(msg.timestamp)}
						</time>
					</div>
				</div>
			</div>
		`;
	}
	static messageContact(msg){
		return `
			<div id="_${msg.id}">
				<div class="container-cb">
					<div class="cb">
						<span style="color: var(--color-orange-lighter); font-weight:bold;">${msg.name}</span>
						<span class="card-contact send">
							<i class="large material-icons">contact_phone</i>
							<span>send</span>
						</span>
						<time style="color: var(--color-light); display:flex;" class="time">
							<i style="font-size:10px" class="double-checked tiny material-icons">${msg.icon}</i>
							&nbsp;
							${Format.timeStampToTime(msg.timestamp)}
						</time>
					</div>
				</div>
			</div>
		`;
	}
	static messageImage(msg){
		return `
			<div id="_${msg.id}">
				<div class="container-cb">
					<div class="cb">
						<span class="name">${msg.name}</span>
						<figure class="image">
							<img src="${msg.content}">
							<div class="refresh">
									<span class="btn-download-image-from-contact"><i class="small material-icons">refresh</i></span>
							</div>
						</figure>
						<time style="color: var(--color-white); display:flex;" class="time">
							<i style="font-size:10px" class="double-checked tiny material-icons">${msg.icon}</i>
							&nbsp;
							${Format.timeStampToTime(msg.timestamp)}
						</time>
					</div>
				</div>
			</div>
		`;
	}
	noContactSelected(){
			return `
					<div class="no-contact-selected">
							<div class="container">
									<!-- <svg fill="#9c9696" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M16 22.621l-3.521-6.795c-.007.004-1.974.97-2.064 1.011-2.24 1.086-6.799-7.82-4.609-8.994l2.082-1.026-3.492-6.817-2.106 1.039c-1.639.855-2.313 2.666-2.289 4.916.075 6.948 6.809 18.071 12.309 18.045.541-.003 1.07-.113 1.58-.346.121-.055 2.102-1.029 2.11-1.033zm-2.5-13.621c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm9 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm-4.5 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z"/></svg> -->
									<img width="100" src="/assets/icons/iconmonstr-phone-10.svg" />
									<span>Selecione um contato</span>
							</div>
					</div>        
			`;
	}
	renderListContact(contact){
			return `
					<button type="button">
							<div class="img">
									<i class="contact-image large material-icons">person</i>
									<img src="${contact.photo}"/>
							</div>
							<div class="text">
									<span class="name">${contact.name}</span>
									<span class="message">${contact.lastMessage}</span>
									<time class="time" style="display:flex; justify-content:flex-end; width:100%; font-size:11px; align-items:center">
											<i style="font-size:12px" class="tiny material-icons">${contact.icon}</i>
											&nbsp;
											${Format.formatHourToBrazilian(contact.time)}
									</time>
							</div>
					</button>
			`;
	}
	renderContactFromAttach(contact, index){
			return `
					<input id="checkbox-attach-contact-index${index}" type="checkbox">
					<label for="checkbox-attach-contact-index${index}">
							<div style="margin-left:16px;" class="img">
									<span class="btn-default" style="background: rgba(51,51,51,1)" ><i class="large material-icons">person</i></span>
									<img src="${contact.photo}" />
							</div>
							<div class="text">
									<span class="name">${contact.name}</span>
									<!-- <span class="message">${contact.message}</span> -->
									<!-- <time class="time">${Format.formatHourToBrazilian(contact.time)}</time> -->
							</div>
					</label>
			`;
	}
	renderingIconDefault(file, icon){
			return `
					<span style="color:var(--color-white);">
							<i class="close small material-icons">close</i>
							<i style="font-size:40px" class="large material-icons">${icon}</i>
							${Format.formatNameFromImage(file.info.type)}
					</span>
			`;
	}
	renderingPdf(file, self){
			return `
					<span id="show-total" class="slide-length">1/${self.el['containerDocumentPreview'].childElementCount + 1}</span>
					<span id="close-slide" class="close-slide"><i data-images="${file.id}" class="small material-icons">close</i></span>
					<img src="${file.src}">
					<div class="caption">Arquivo em formato de ${Format.formatNameFromImage(file.info.type)} - páginas ${file.pages}</div>                
			`;
	}
	renderingImages(file, self){
			return `
					<span id="show-total" class="slide-length">1/${self.el['containerDocumentPreview'].childElementCount + 1}</span>
					<span id="close-slide" class="close-slide"><i data-images="${file.info.name}" class="small material-icons">close</i></span>
					<img src="${file.src}">
					<!-- <div class="caption">${file.info.name}</div> -->
			`;
	}
	static messageTimeLeft(){
			return `
					<span style="color:var(--color-white)">Atingiu número máximo de tentativas - tempo restante:
							<span id="time-left"></span>
					</span>
			`;
	}
	static messageCodeInvalid(time){
			return `
					<span style="color:var(--color-red); font-size: 14px;">Código invalido - 
							<span style="color:var(--color-white)">tentativas ${time}/3</span>
					</span>
			`;
	}
	static messageCodeSending(email){
			return `
					Enviando código de acesso para <span style="font-size:14px; color:var(--color-white);">${email}...</span>
			`;
	}
	static messageCodeSent(){
			return `
					<span style="color:var(--color-white);">Código enviado com sucesso</span>
			`;
	}
	static messageCreatingAccount(){
			return `
					<span style="color:var(--color-white);">Criando uma nova conta...</span>
			`;
	}
	static messageUserExists(){
			return `
					<span style="color:var(--color-white);">E-mail já cadastrado...</span>
			`;
	}
	static messageCreateUserSuccess(){
			return `
					<span style="color:var(--color-white);">Usuário cadastrado com sucesso.</span>
			`;
	}
	static messageCreateUserError(msg){
			(msg) ? msg : 'Não foi possível cadastrar sua conta.';
			return `
					<span style="color:var(--color-white);">${msg}</span>
			`;
	}
	static messageUserNotExists(){
			return `
					<span style="color:var(--color-white);">E-mail não cadastrado.</span>
			`;
	}
	static messageUserInvalid(){
			return `
					<span style="color:var(--color-white);">E-mail ou senha invalidos.</span>
			`;
	}
}