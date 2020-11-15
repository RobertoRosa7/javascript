// importando classes 
import { Format } from '../utils/Format';
import { CameraController } from './CameraController';
import { DocumentPreviewController } from './DocumentPreviewController';
import { PhoneController } from './PhoneController';
import { Firebase } from '../utils/Firebase';
import { User } from '../model/User';
import { Chat } from '../model/Chat';
import { Messages } from '../model/Messages';
import { Base64 } from '../utils/Base64';
import { ContactsController } from './ContactsController';
import { Upload } from '../utils/Upload';

// exportando classe como modulo - default 
export class WhatsAppController{
	constructor(){
		// window open
		this._active = true;
		// instance firebase
		this._firebase = new Firebase();
		// prototype manipulation native elments
		this.elementsPrototype();
		// carregar na instancia do objeto todos os id's do documento
		this.loadElements();
		// start all events
		this.initEvents();
		// authentication with firebase provider Google
		this.initAuth();
		// verificar autorização de notificação
		this.checkNotification();
		
	}
	// notification
	checkNotification(){
		// verificar se browser tem API notification
		if(typeof Notification === 'function'){
			// verificar se já concedeu permissão
			if(Notification.permission !== 'granted'){
				// imprimir um alert de permissão
				this.el.alertNotificationPermission.show();
			}else{
				this.el.alertNotificationPermission.hide();
			}
			// evento sobre button de permissão
			this.el.alertNotificationPermission.on('click', e =>{
				// exibir um popup de permissão
				Notification.requestPermission(permission =>{
					// verificar se foi concedido permissão
					if(permission === 'granted'){
						this.el.alertNotificationPermission.hide();
						console.info('notificações web');
					}
				});
			});
		}
	}
	// notification
	notification(data){
		// verificar se usuário permitiu e se está com a brwser aberto
		if(Notification === 'granted' && !this._active){
			// nova instancia da classe Notification API Browser
			let n = new Notification(this._contactActive.name, {
				icon: this._contactActive.photo,
				body: data.content
			});
			let sound = new Audio('./audio/alert.mp3');
			sound.currentTime = 0;
			sound.play();
			// tempo de exibição da notificação
			setTimeout(()=>{
				if(n) n.close();
			}, 3000);
		}
	}
	// method auth
	initAuth(){
		// chamada initAuth do firebase
		this._firebase.googleAuth().then(response =>{
			this._user = new User(response.user.email);
			// listening events on firestore - new events created now
			this._user.on('dataChange', data =>{
				document.querySelector('title').innerHTML = data.name + ' - WhatsApp - Clone';
				// user name
				this.el.inputNamePanelEditProfile.innerHTML = data.name;
				// get photo user if existis
				if(data.photo){
					let photo = this.el.imgPanelEditProfile;
					photo.src = data.photo;
					photo.show();
					this.el.imgDefaultPanelEditProfile.hide();
					// photo main
					let photoMain = this.el.myPhoto.querySelector('img');
					photoMain.src = data.photo;
					photoMain.show();
				}
				this.initContacts();
			});
			this._user.name = response.user.displayName;
			this._user.email = response.user.email;
			this._user.photo = response.user.photoURL;
			this._user.save().then(()=>{
				// show whatsapp
				this.el.appContent.css({
					display:'flex'
				});
			});
		}).catch(err =>{
			console.error(err);
		});
	}
	
	// init contacts
	initContacts(){
		// listening any change on contacts
		this._user.on('contactsChange', docs =>{
			// clear contacts list
			this.el.contactsMessagesList.innerHTML = '';
			// run docs to get document
			docs.forEach(doc =>{
				// extract data from document
				let contact = doc.data();
				// show contact list to user
				let div = document.createElement('div');
				div.className = 'contact-item';
				div.innerHTML = `
					<div class="dIyEr">
						<div class="_1WliW" style="height: 49px; width: 49px;">
							<img src="#" class="Qgzj8 gqwaM photo" style="display:none;">
							<div class="_3ZW2E">
								<span data-icon="default-user" class="">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
										<path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
										<g fill="#FFF">
											<path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
										</g>
									</svg>
								</span>
							</div>
						</div>
					</div>
					<div class="_3j7s9">
						<div class="_2FBdJ">
							<div class="_25Ooe">
								<span dir="auto" title="${contact.name}" class="_1wjpf">${contact.name}</span>
							</div>
							<div class="_3Bxar">
								<span class="_3T2VG">${Format.timeStampToTime(contact.lastMessageTime)}</span>
							</div>
						</div>
						<div class="_1AwDx">
							<div class="_itDl">
								<span title="digitando…" class="vdXUe _1wjpf typing" style="display:none">digitando…</span>
		
								<span class="_2_LEW last-message">
									<div class="_1VfKB">
										<span data-icon="status-dblcheck" class="">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
												<path fill="#263238" fill-opacity=".4" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
											</svg>
										</span>
									</div>
									<span dir="ltr" class="_1wjpf _3NFp9">${contact.lastMessage}</span>
									<div class="_3Bxar">
										<span>
											<div class="_15G96">
												<span class="OUeyt messages-count-new" style="display:none;">1</span>
											</div>
									</span></div>
									</span>
							</div>
						</div>
					</div>
				`;
				// add photo if exists
				if(contact.photo){
					let img = div.querySelector('.photo');
					img.src = contact.photo;
					img.show();
				}
				// open contact panel when clicked
				div.on('click', e =>{
					// call method activeContact
					this.activeContact(contact);
				});
				this.el.contactsMessagesList.appendChild(div);
			});
		});
		this._user.getContacts();
	}
	
	// active contact - responsable to enable panel with messages
	activeContact(contact){
		// verify if exists contact active because can problem
		if(this._contactAtive){
			// get referense and snapshot off - para outros chat não ficar ativos
			Messages.getRef(this._contactActive.chatId).onSnapshot(()=>{});
		}
		// keep contact active
		this._contactActive = contact;
		// show contact name on panel
		this.el.activeName.innerHTML = contact.name;
		// show contact status on panel
		this.el.activeStatus.innerHTML = contact.status;
		// show photo if exists
		if(contact.photo){
			let img = this.el.activePhoto;
			img.src = contact.photo;
			img.show();
		}
		this.el.home.hide();
		this.el.main.css({
			display:'flex'
		});
		// clear panel messages
		this.el.panelMessagesContainer.innerHTML = '';
		// array de id com todas as mensagens notificadas
		this._messagesReceived = [];
		// load message referense
		Messages.getRef(this._contactActive.chatId).orderBy('timeStamp').onSnapshot(docs =>{
			// scroll verify if is on top - get your position
			let scrollTop = this.el.panelMessagesContainer.scrollTop;
			// scrollMax = scrollHeight - scrollOffsetHeight
			let scrollTopMax = (this.el.panelMessagesContainer.scrollHeight - this.el.panelMessagesContainer.offsetHeight);
			// autoScroll
			let autoScroll = (scrollTop >= scrollTopMax);
			// run docs to get doc
			docs.forEach(doc =>{
				// getting information
				let data = doc.data();
				// add id dinamic to data
				data.id = doc.id;
				let message = new Messages();
				// convert message
				message.fromJSON(data);
				// verify who send messages
				let me = (data.from === this._user.email);
				// verificar se a mensagem não é minha
				if(!me && this._messagesReceived.filter(id =>{return (id === data.id)}).length === 0){
					// fazendo a notificação
					this.notification(data);
					// adicionar a nova notificação no array de notificação
					this._messagesReceived.push(data.id);
				}
				// recebendo imagens com a visualização de envio
				let view = message.getViewElement(me);
				// verify message id
				// add message on panel if not exist
				if(!this.el.panelMessagesContainer.querySelector(`#_${data.id}`)){
					// verificação se leu ou não a mensagem outro usuário
					if(!me){
						doc.ref.set({
							status:'read'
						},{
							merge:true
						});
					}
					//show message to user add message into panel like appendChild
					this.el.panelMessagesContainer.appendChild(view);
				}else{
					// parentNode - indica o elmento pai imediato de um elemento
					let parent = this.el.panelMessagesContainer.querySelector(`#_${data.id}`).parentNode;
					// trocar o elemento filho
					parent.replaceChild(view, this.el.panelMessagesContainer.querySelector(`#_${data.id}`));
				}
				if(this.el.panelMessagesContainer.querySelector(`#_${data.id}`) && me){
					// select message id
					let msg = this.el.panelMessagesContainer.querySelector(`#_${data.id}`);
					// change status message - outerHTML pegar conteúdo HTML
					msg.querySelector('.message-status').innerHTML = message.getStatusViewElement().outerHTML;
				}
				// adicionar evento na mensagem de contato após enviada
				if(message.type === 'contact'){
					// recuperar a mensagem e adicionar evento click
					view.querySelector('.btn-message-send').on('click', e =>{
						// criar um novo chat 
						Chat.createChatIfNotExists(this._user.email, message.content.email).then(chat =>{
							// instancia de novo usuário
							let contact = new User(message.content.email);
							// adicionando evento e aplicando informações do contanto
							contact.on('dataChange', data =>{
								// recuperando chat id
								contact.chatId = chat.id;
								// adicionando novo contanto
								this._user.addContact(contact);
								// passando chat id para user id
								this._user.chatId = chat.id;
								// adicionando contato para outro usuario
								contact.addContact(this._user);
								// ativando panel de chat
								this.activeContact(contact);
							});
						});
					});
				}
			});
			// verify scroll
			if(autoScroll){
				// scroll recebe o tamanho máximo de scroll menos o limite de scroll
				this.el.panelMessagesContainer.scrollTop = 	(this.el.panelMessagesContainer.scrollHeight - this.el.panelMessagesContainer.offsetHeight);
			}else{
				// scroll deve ficar onde o usuário subiu e permanecer
				this.el.panelMessagesContainer.scrollTop = scrollTop;
			}
		});
	}

	// selecionar todos os id's
	loadElements(){
		// objeto vazio para receber os id's
		this.el = {};
		// selecionados todos os id's
		document.querySelectorAll('[id]').forEach(element => {
			// convertendo id's em camelcase
			this.el[Format.getCamelCase(element.id)] = element;
		});
	}

	// prototype
	elementsPrototype(){
		// indicar uma classe para os objetos nativa do javascript
		Element.prototype.hide = function(){
			this.style.display = 'none';
			// return this para concatenar outros métodos sendo aplicado somente em um elemento
			return this;
		}
		// show element
		Element.prototype.show = function(){
			this.style.display = 'block';
			return this;
		}
		// show/hide element
		Element.prototype.toggle = function(){
			this.style.display = (this.style.display === 'none') ? 'block' : 'none';
			return this;
		}
		// listening events
		Element.prototype.on = function(events, fn){
			events.split(' ').forEach(event =>{
				this.addEventListener(event, fn);
			});
			return this;
		}
		// manipulation CSS
		Element.prototype.css = function(styles){
			for(let name in styles){
				this.style[name] = styles[name];
			}
			return this;
		}
		// add class
		Element.prototype.addClass = function(name){
			this.classList.add(name);
			return this;
		}
		// delete class
		Element.prototype.removeClass = function(name){
			this.classList.remove(name);
			return this;
		}
		// add/delete class
		Element.prototype.toggleClass = function(name){
			this.classList.toggle(name);
			return this;
		}
		// verify if class exisits
		Element.prototype.hasClass = function(name){
			return this.classList.contains(name);
		}
		// prototype for Form
		HTMLFormElement.prototype.getForm = function() {
			return new FormData(this);
		}
		// prototype for JSON - return one form in JSON format
		HTMLFormElement.prototype.toJSON = function(){
			let json = {};
			this.getForm().forEach((value, key) =>{
				json[key] = value
			});
			return json;
		}
	}

	// initialize all events
	initEvents(){
		// browser está aberto
		window.addEventListener('focus', e =>{
			// atributo para validação
			this._active = true;
		});
		// browser está minimizado ou background
		window.addEventListener('blur', e =>{
			this._active = false;
		});
		// event on input search
		this.el.inputSearchContacts.on('keyup', e =>{
			// verify if value > 0
			if(this.el.inputSearchContacts.value.length > 0){
				this.el.inputSearchContactPlaceholder.hide();
			}else{
				this.el.inputSearchContactPlaceholder.show();
			}
			// passing get contact to search
			this._user.getContacts(this.el.inputSearchContacts.value);
		});
		//event on button my photo show profile
		this.el.myPhoto.on('click', e =>{
			this.closeAllLeftPanel();
			this.el.panelEditProfile.show();
			// bug of panel 
			setTimeout(()=>{
				this.el.panelEditProfile.addClass('open');
			},300);
		});
		// event on button new contact show contact
		this.el.btnNewContact.on('click', e =>{
			this.closeAllLeftPanel();
			this.el.panelAddContact.show();
			setTimeout(()=>{
				this.el.panelAddContact.addClass('open');
			},300);
		});
		// event on button to close my photo profile
		this.el.btnClosePanelEditProfile.on('click', e =>{
			this.el.panelEditProfile.removeClass('open');
		});
		// event on button to close add contact
		this.el.btnClosePanelAddContact.on('click', e =>{
			this.el.panelAddContact.removeClass('open');
		});
		// event on photo profile container
		this.el.photoContainerEditProfile.on('click', e =>{
			this.el.inputProfilePhoto.click();
		});
		// event update photo profile
		this.el.inputProfilePhoto.on('change', e =>{
			if(this.el.inputProfilePhoto.files.length > 0){
				let file = this.el.inputProfilePhoto.files[0];
				Upload.send(file, this._user.email).then(snapshot =>{
					this._user.photo = snapshot.downloadURL;
					this._user.save().then(()=>{
						this.el.btnClosePanelEditProfile.click();
					});
				});
			}
		});
		// event to get name profile
		this.el.inputNamePanelEditProfile.on('keypress', e =>{
			if(e.key === 'Enter'){
				e.preventDefault();
				this.el.btnSavePanelEditProfile.click();
			}
		});
		// event on button save name profile
		this.el.btnSavePanelEditProfile.on('click', e =>{
			this.el.btnSavePanelEditProfile.disabled = true
			this._user.name = this.el.inputNamePanelEditProfile.innerHTML;
			this._user.save().then(()=>{
				this.el.btnSavePanelEditProfile.disabled = false;
			});
			//console.log(this.el.inputNamePanelEditProfile.inneHTML);
		});
		// event when form submit
		this.el.formPanelAddContact.on('submit', e =>{
			e.preventDefault();
			let formData = new FormData(this.el.formPanelAddContact);
			let contact = new User(formData.get('email'));
			// get event change
			contact.on('dataChange', data =>{
				// verfify user exists on database
				if(data.name){
					// create chat if not exists
					Chat.createChatIfNotExists(this._user.email, contact.email).then(chat =>{
						// get id chat
						contact.chatId = chat.id;
						// chat exists for both users
						this._user.chatId = chat.id;
						// add my contact to chat
						contact.addContact(this._user);
						// adding contact
						this._user.addContact(contact).then(()=>{
							this.el.btnClosePanelAddContact.click();
							console.info('contato foi adicionado');
						});
					});
					
				}else{
					console.log('usuário não encontrado');
				}
			});
		});
		
		// event to open panel message when click on contact
		this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach( item => {
			item.on('click', e =>{
				this.el.home.hide();
				this.el.main.css({
					display:'flex'
				});
			});
		});
		// event to open menu attach
		this.el.btnAttach.on('click', e =>{
			// evita que eventos propague para outros elementos
			e.stopPropagation();
			this.el.menuAttach.addClass('open');
			// remover classe open quando clicar em qualquer lugar do documento
			// bind(this) indica que o escopo continua sendo este objeto
			// o this representa a class WhatsAppController
			document.addEventListener('click',this.closeMenuAttach.bind(this));
		});

		/*  events to add mídia */
		// event button add photo
		this.el.btnAttachPhoto.on('click', e =>{
			this.el.inputPhoto.click();
		});
		// event choose photo
		this.el.inputPhoto.on('change', e =>{
			[...this.el.inputPhoto.files].forEach(file => {
				// send file on message
				Messages.sendImage(this._contactActive.chatId, this._user.email,file);
			});
		});
		// event button active panel camera
		this.el.btnAttachCamera.on('click', e =>{
			this.closeAllPanel();
			this.el.panelCamera.addClass('open');
			this.el.panelCamera.css({
				'height':'calc(100% - 120px)'
			});
			// nova instancia do objeto camera
			this._camera = new CameraController(this.el.videoCamera);
		});
		// event button close panel camera
		this.el.btnClosePanelCamera.on('click', e =>{
			this.closeAllPanel();
			this.el.panelMessagesContainer.show();
			this._camera.stop();
		});
		// event button take picture
		this.el.btnTakePicture.on('click', e =>{
			let dataURL = this._camera.takePicture();
			this.el.pictureCamera.src = dataURL;
			this.el.pictureCamera.show();
			this.el.videoCamera.hide();
			this.el.btnReshootPanelCamera.show();
			this.el.containerTakePicture.hide();
			this.el.containerSendPicture.show();
		});
		// event button reshoot picture
		this.el.btnReshootPanelCamera.on('click', e =>{
			this.el.pictureCamera.hide();
			this.el.videoCamera.show();
			this.el.btnReshootPanelCamera.hide();
			this.el.containerTakePicture.show();
			this.el.containerSendPicture.hide();
		});
		// event button send picture
		this.el.btnSendPicture.on('click', e =>{
			this.el.btnSendPicture.disabled = true;
			/**
			 * procurar mimetype dentro de um link base64 usando expressão regular
			 * ^ indica o inicio
			 * $ indica o fim
			 * . indica qualquer caracter na posição
			 * * indica um conjunto de caracter
			 * // indica uma expressão regular
			 * new ReGex indica nova instancia
			 * @returns String:
			 */
			let regex = /^data:(.+);base64,(.*)$/;
			// match() encontra padrões dentro de uma expressão regular
			let result = this.el.pictureCamera.src.match(regex);
			//  extract mimetype
			let mimeType = result[1];
			// convert mimetype in array to extrat extension
			let ext = mimeType.split('/')[1];
			// rename file with date and ext
			let filename = `camera${Date.now()}.${ext}`;
			//new Image - para poder editar imagens no canvas
			// deve ser feito antes de enviar imagens na instrução abaixo
			let picture = new Image();
			picture.src = this.el.pictureCamera.src;
			picture.onload = e =>{
				// create canvas after load image
				let canvas = document.createElement('canvas');
				let context = canvas.getContext('2d');
				// define height and width 
				canvas.width = picture.width;
				canvas.height = picture.height;
				// translate - desloca da tela a mesma largura da imagem
				context.translate(picture.width, 0);
				context.scale(-1, 1);
				// turn around an image
				context.drawImage(picture, 0, 0, canvas.width, canvas.height);
				// back to base64 to use on fetch()
				// fetch().then().catch - converter base64 
				// arrayBuffer().then() - pega dados e converte em arquivo
				fetch(canvas.toDataURL(mimeType))
				.then(res =>{return res.arrayBuffer();})
				.then(buffer =>{return new File([buffer], filename,{type:mimeType}); })
				.then(file =>{
					Messages.sendImage(this._contactActive.chatId, this._user.email,file);
					this.el.btnSendPicture.disabled = false;
					this.closeAllPanel();
					this._camera.stop();
					this.el.btnReshootPanelCamera.hide();
					this.el.pictureCamera.hide();
					this.el.videoCamera.show();
					this.el.containerSendPicture.hide();
					this.el.containerTakePicture.show();
					this.el.panelMessagesContainer.show();					
				});
			}
		});

		// event button add document
		this.el.btnAttachDocument.on('click', e =>{
			this.closeAllPanel();
			this.el.panelDocumentPreview.addClass('open');
			this.el.panelDocumentPreview.css({
				'height':'calc(100% - 120px)'
			});
			this.el.inputDocument.click();
		});

		// event get document local
		this.el.inputDocument.on('change', e =>{
			if(this.el.inputDocument.files.length){
				// fix bug on panel when show document
				this.el.panelDocumentPreview.css({
					'height':'1%'
				});
				let file = this.el.inputDocument.files[0];
				// pre-view of documents
				this._documentPreviewController = new DocumentPreviewController(file);
				this._documentPreviewController.getPreviewData().then(result =>{
					// get src from image
					this.el.imgPanelDocumentPreview.src = result.src;
					// show info on panel preview
					this.el.infoPanelDocumentPreview.innerHTML = result.info;
					// show on panel preview of image
					this.el.imagePanelDocumentPreview.show();
					// fix image on panel
					this.el.imgPanelDocumentPreview.css({
						width:'100%',
						height:'77%'
					});
					// hide panel file document
					this.el.filePanelDocumentPreview.hide();
					// show the document
					this.el.panelDocumentPreview.css({
						height:'calc(100% - 120px)'
					});
				}).catch(err =>{
					this.el.panelDocumentPreview.css({
						height:'calc(100% - 120px)'
					});
					// fix possible type file
					switch(file.type){
						case 'application/vnd.oasis.opendocument.text':
						case 'application/msword':
						case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
							this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
							break;

						case 'application/vnd.oasis.opendocument.spreadsheet':
						case 'application/vnd.ms-excel':
						case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
							this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
							break;

						case 'application/vnd.ms-powerpoint':
						case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
							this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
							break;

						default:
							this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
							break;
					}
					// show icon and info from file on panel
					this.el.filenamePanelDocumentPreview.innerHTML = file.name;
					this.el.imagePanelDocumentPreview.hide();
					this.el.filePanelDocumentPreview.show();
				});
			}
		});

		// event button close panel document
		this.el.btnClosePanelDocumentPreview.on('click', e =>{
			this.closeAllPanel();
			this.el.panelMessagesContainer.show();
		});

		// event button send document
		this.el.btnSendDocument.on('click', e =>{
			// recuperar a preview do documento
			let file = this.el.inputDocument.files[0];
			let base64 = this.el.imgPanelDocumentPreview.src;
			// verificar se é pdf
			if(file.type === 'application/pdf'){
				Base64.toFile(base64).then(filePreview =>{
					// enviar documentos
					Messages.sendDocument(this._contactActive.chatId, this._user.email, file, filePreview, this.el.infoPanelDocumentPreview.innerHTML);
				});
			}else{
				Messages.sendDocument(this._contactActive.chatId, this._user.email, file);
			}
			this.el.btnClosePanelDocumentPreview.click();
		});
		// event button add contact
		this.el.btnAttachContact.on('click', e =>{
			// show modal contact
			//this.el.modalContacts.show();
			// class contact controller
			this._contactsController = new ContactsController(this.el.modalContacts,this._user);
			// event to click to select and add contact to send
			this._contactsController.on('select', contact =>{
				Messages.sendContact(this._contactActive.chatId,this._user.email,contact);
			});
			// open modal
			this._contactsController.open();
		});
		// event button close modal contact
		this.el.btnCloseModalContacts.on('click', e =>{
			// close modal controller
			this._contactsController.close();
			// hide modal contronller
			//this.el.modalContacts.hide();
		});
		// event button record microfone
		this.el.btnSendMicrophone.on('click', e =>{
			// MircrophoneController teve conflito de nome teve que usar Phone
			this._microphoneController = new PhoneController();
			this.el.recordMicrophone.show();
			this.el.btnSendMicrophone.hide();
			// ficar atento nos evento que ocorrem no microphone - porque irá
			// ocorrer dois eventos diferentes no mesmo elemento
			this._microphoneController.on('ready', audio =>{
				// iniciando a gravação
				this._microphoneController.startRecorder();
			});
			// iniciando o tempo de duração
			this._microphoneController.on('recordTimer', time =>{
				// formatando o tempo para o padrão
				this.el.recordMicrophoneTimer.innerHTML = Format.toTime(time);
			});
		});

		// event stop record
		this.el.btnCancelMicrophone.on('click', e =>{
			// parando a gravação
			this._microphoneController.stopRecorder();
			//this._microphoneController.stop();
			this.closeRecordMicrophone();
		});

		// event finish record
		this.el.btnFinishMicrophone.on('click', e =>{
			// adicionando evento e recuperar metadata
			this._microphoneController.on('recorded', (file, metadata)=>{
				Messages.sendAudio(this._contactActive.chatId,this._user.email,file,metadata,this._user.photo);
			});
			this._microphoneController.stopRecorder();
			//this._microphoneController.stop();
			this.closeRecordMicrophone();
		});

		// event send message with Enter
		this.el.inputText.on('keypress', e =>{
			if(e.key === 'Enter' && !e.ctrlKey){
				e.preventDefault();
				this.el.btnSend.click();
			}
		});

		// event get text from message
		this.el.inputText.on('keyup', e =>{
			if(this.el.inputText.innerHTML.length){
				this.el.inputPlaceholder.hide();
				this.el.btnSendMicrophone.hide();
				this.el.btnSend.show();
			}else{
				this.el.inputPlaceholder.show();
				this.el.btnSendMicrophone.show();
				this.el.btnSend.hide();
			}
		});

		// event button send message
		this.el.btnSend.on('click', e =>{
			// get contact active chatId, get message.send(), get text
			Messages.send(
				this._contactActive.chatId,
				this._user.email,
				'text', 
				this.el.inputText.innerHTML
				);
			// clear input text and panel emojis
			this.el.inputText.innerHTML = '';
			this.el.panelEmojis.removeClass('open');
			//console.log(this.el.inputText.innerHTML);
		});
		
		// event button emoji
		this.el.btnEmojis.on('click', e =>{
			this.el.panelEmojis.toggleClass('open');
		});

		// event get emojis
		this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji =>{
			// event click on emoji
			emoji.on('click', e =>{
				console.log(emoji.dataset.unicode);
				// clone the img of emoji
				let img = this.el.imgEmojiDefault.cloneNode();
				// define the text to emoji
				img.style.cssText = emoji.style.cssText;
				// img receive the unicode dataset
				img.dataset.unicode = emoji.dataset.unicode;
				// define emoji for alt
				img.alt = emoji.dataset.unicode;
				// look for class list add class to emojis
				emoji.classList.forEach(name =>{
					img.classList.add(name);
				});
				// metodo para curso pegar seleção
				let cursor = window.getSelection();
				// focusNode - sabe onde cursor está focado
				if(!cursor.focusNode || !cursor.focusNode.id === 'input-text'){
					this.el.inputText.focus();
					cursor = window.getSelection();
				}
				// criar um rage de caracteres para seleção
				let range = document.createRange();
				// ponto de inicio do range
				range = cursor.getRangeAt(0);
				// delete range selecionado
				range.deleteContents();
				// frag - para inserção exatamente onde existe a seleção do range
				let frag = document.createDocumentFragment();
				// inserir img dentro fragment
				frag.appendChild(img);
				// inserir o fragment dentro do range selecionado
				range.insertNode(frag);
				// colocando curso no final do range
				range.setStartAfter(img);
				// dispatchEvent - força um evento acontecer sobre outros
				this.el.inputText.dispatchEvent(new Event('keyup'));
			});
		});
	}
	// set active chat
	setActiveChat(){

	}
	// close recorde microphone
	closeRecordMicrophone(){
		this.el.recordMicrophone.hide();
		this.el.btnSendMicrophone.show();
	}

	// close all panel
	closeAllPanel(){
		this.el.panelMessagesContainer.hide();
		this.el.panelDocumentPreview.removeClass('open');
		this.el.panelCamera.removeClass('open');
	}

	// close menu attach when click anywhere
	closeMenuAttach(e){
		document.removeEventListener('click', this.closeMenuAttach);
		this.el.menuAttach.removeClass('open');
	}

	// close panel left
	closeAllLeftPanel(){
		this.el.panelAddContact.hide();
		this.el.panelEditProfile.hide();
	}

}