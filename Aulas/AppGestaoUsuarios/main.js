
let user = new UserController("form-user-create", "form-user-update", "table-users")

/*
let name = document.querySelector('#exampleInputName')
let gender = document.querySelectorAll('#form-user-create [name=gender]:checked')
let birth = document.querySelector('#exampleInputBirth')
let country = document.querySelector('#exampleInputCountry')
let email = document.querySelector('#exampleInputEmail')
let pass = document.querySelector('#exampleInputPassword')
let photo = document.querySelector('#exampleInputFile')
let admin = document.querySelector('#exampleInputAdmin')
*/
/*

let fields = document.querySelectorAll('#form-user-create [name]')
var user = {}
*/
/*
function addUser(dataUser){

	document.querySelector('#table-users').innerHTML = `
		<tr>
	        <td>
	          <img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm">
	        </td>

	        <td>${dataUser.name}</td>
	        <td>${dataUser.email}</td>
	        <td>${dataUser.admin}</td>
	        <td>${dataUser.birth}</td>

	        <td>
	          <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
	          <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
	        </td>
	    </tr>
	`

	//console.log('addLine', dataUser)
}
*/
/*
fields.forEach((field, index) => {
	
	if(field.name == 'gender'){

		if(field.checked){ //console.log('SIM', field)
			
			user.gender
		}

	}else {

		user[field.name] = field.value
	}

	//console.log(field.id,field.value,field.checked,field.name)
})
*/
/*
document.querySelector('#form-user-create').addEventListener('submit', e => {
	e.preventDefault()
	fields.forEach((field, index) => {
		if(field.name == 'gender'){
			if(field.checked){
				user[field.name] = field.value
			}
		}else{
			user[field.name] = field.value
		}
	})
	var objUser = new User(
		user.name, 
		user.gender, 
		user.birth, 
		user.country, 
		user.email, 
		user.password, 
		user.phpto, 
		user.admin)

	addUser(objUser)
})
*/
/*
document.querySelectorAll('button').forEach(() => {

	this.addEventListener('click', () => {

		console.log('clicou')
	})
})
*/
//console.log(user)
