class UserController{
	constructor(formCreate, formUpdate, tableId){
		this.formEl = document.getElementById(formCreate);
		this.formUpdateEl = document.getElementById(formUpdate);
		this.tableEl = document.getElementById(tableId);
		this.onSubmit();
		this.onEdit();
		this.selectAll();
	}
	onEdit(){
		document.querySelector('#form-user-update .btn-cancel').addEventListener('click', e =>{
			this.showPainelCreate();
		});
		this.formUpdateEl.addEventListener('submit', e => {
			e.preventDefault();
			let btn = this.formUpdateEl.querySelector('[type=submit]');
			btn.disabled = true;
			let values = this.getValues(this.formUpdateEl);
			let index = this.formUpdateEl.dataset.trIndex;
			let tr = this.tableEl.rows[index];
			let userOld = JSON.parse(tr.dataset.user);
			let result = Object.assign({}, userOld, values);
			this.getPhoto(this.formUpdateEl).then(
				(content) =>{
					if(!values.photo) {
						result._photo = userOld._photo;
					}else{
						result._photo = content;
					}
					let user = new Users();
					user.loadFromJSON(result);
					user.save().then(user =>{
						this.getTr(user, tr);
						this.updateCount();
						this.formUpdateEl.reset();
						btn.disabled = false;
						this.showPainelCreate();
					});
				},
				e =>{
					console.error(e);
				}
			);
		});
	}
	onSubmit(){
		this.formEl.addEventListener('submit', e => {
		e.preventDefault();
		let btn = this.formEl.querySelector('[type=submit]');
		btn.disabled = true;
		let values = this.getValues(this.formEl);
		if(!values) return false;
		this.getPhoto(this.formEl).then(
				(content) =>{
					values.photo = content;
					values.save().then(user => {
						this.addUser(user);
						this.formEl.reset();
						btn.disabled = false;
					});
				},
				e =>{
					console.error(e);
				}
			);
		});
	}
	getPhoto(form){
		return new Promise((resolve, reject) =>{
			let fileReader = new FileReader();
			let elements = [...form.elements].filter(item => {
				if(item.name === 'photo'){
					return item;
				}
			});
			let file = elements[0].files[0];
			fileReader.onload = () =>{
				resolve(fileReader.result);
			}
			fileReader.onerror = e =>{
				reject(e);
			}
			if(file) {
				fileReader.readAsDataURL(file);
			}else{
				resolve('dist/img/avatar5.png');
			}
		});
	}
	getValues(formEl){
		let user = {};
		let isvalid = true;
		[...formEl.elements].forEach(function (field, index) {
			if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
				field.parentElement.classList.add('has-error');
				isvalid = false;
			}
			if(field.name == 'gender'){
				if(field.checked){
					user[field.name] = field.value;
				}
			}else if(field.name == 'admin'){
				user[field.name] = field.checked;
			}else{
				user[field.name] = field.value;
			}
		});
		if(!isvalid) return false;
		return new Users(
			user.name,
			user.gender,
			user.birth,
			user.country,
			user.email,
			user.password,
			user.photo,
			user.admin);
	}
	selectAll(){
		Users.getUserSession().then(data =>{
			data.users.forEach(dataUser => {
				let user = new Users();
				user.loadFromJSON(dataUser);
				this.addUser(user);
			});
		});
	}
	addUser(dataUser){
		let tr = this.getTr(dataUser);
		this.tableEl.appendChild(tr);
		this.updateCount();
	}
	getTr(dataUser, tr = null){
		if(tr === null) tr = document.createElement('tr');
		tr.dataset.user = JSON.stringify(dataUser);
		tr.innerHTML = `
	        <td>
	          <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm">
	        </td>
	        <td>${dataUser.name}</td>
	        <td>${dataUser.email}</td>
	        <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
	        <td>${Utils.dateFormat(dataUser.register)}</td>
	        <td>
	          <button type="button" class="btn btn-primary btn-update btn-xs btn-flat">Editar</button>
	          <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
	        </td>
		`;
		this.addEventsTR(tr);
		return tr;
	}
	addEventsTR(tr){
		tr.querySelector('.btn-delete').addEventListener('click', e => {
			if(confirm('Confirma a remoção deste item?')) {
				let user = new Users();
				user.loadFromJSON(JSON.parse(tr.dataset.user));
				user.remove().then(data =>{
					tr.remove();
					this.updateCount();
				});
			}
		});
		tr.querySelector('.btn-update').addEventListener('click', e => {
			let json = JSON.parse(tr.dataset.user);
			this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
			for(let name in json){
				let field = this.formUpdateEl.querySelector("[name=" + name.replace("_","") + "]");
				if(field){
					switch(field.type){
						case 'file':
							continue;
							break;
						case 'radio':
						field = this.formUpdateEl.querySelector("[name="+name.replace("_","")+"][value="+json[name]+"]");
						field.checked = true;
							break;
						case 'checkbox':
						field.checked = json[name];
							break;
						default:
						field.value = json[name];
					}
				}
			}
			this.formUpdateEl.querySelector('.photo').src = json._photo;
			this.showPainelUpdate();
		});
	}
	showPainelUpdate(){
		document.querySelector('#box-user-create').style.display = 'none';
		document.querySelector('#box-user-update').style.display = 'block';
	}
	showPainelCreate(){
		document.querySelector('#box-user-create').style.display = 'block';
		document.querySelector('#box-user-update').style.display = 'none';
	}
	updateCount(){
		let numberUser = 0;
		let numberAdmin = 0;
		[...this.tableEl.children].forEach(tr => {
			numberUser++;
			let user = JSON.parse(tr.dataset.user);
			if(user._admin) numberAdmin++;
		});
		document.querySelector('#numberUser').innerHTML = numberUser;
		document.querySelector('#numberAdmin').innerHTML = numberAdmin;
	}
}
