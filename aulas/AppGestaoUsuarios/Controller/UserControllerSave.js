class UserController{

	constructor(formCreate, formUpdate, tableId){
		this.formEl = document.getElementById(formCreate)
		this.formUpdateEl = document.getElementById(formUpdate)
		this.tableEl = document.getElementById(tableId)
		this.onSubmit()
		this.onEdit()
		this.selectAll()

	}
	onEdit(){
		// botão cancelar:
		// Ao editar as informações do usuários podemos cancelar caso ocorra algum erro de dados
		// selecionar o botão responsável pelo cancelamento dos dados
		document.querySelector('#form-user-update .btn-cancel').addEventListener('click', e =>{
			
			// show painel create
			this.showPainelCreate()
		})
		// botão editar:
		// recuperando o id do formulário de atualização e adicionando evento de clique retornando
		// uma função para receber instruções de atualização
		this.formUpdateEl.addEventListener('submit', e => {

			e.preventDefault()

			let btn = this.formUpdateEl.querySelector('[type=submit]')
			
			btn.disabled = true

			let values = this.getValues(this.formUpdateEl)

			// recuperar o dataset criando dinamicamente pelo método addUser para ser acessado aqui
			// indica a linha dos registros - isto é, os índices criado conforme a inserção de novos daods
			let index = this.formUpdateEl.dataset.trIndex

			// encapsulando os valores em variável porque será usado mais de uma vez, aquí é acessado
			// a linha da tabela a qual os valores serão atualizados
			let tr = this.tableEl.rows[index]

			// (bug da foto) - para atualizar a foto é necessário recuperar a foto do objeto antigo
			// para se caso não for selecionado nenhuma incluir a foto padrão, mas se caso for incluído
			// será sobreescrita - então devemos encapsular o objeto antigo em um novo JSON
			let userOld = JSON.parse(tr.dataset.user)

			// juntando os dois objetos antigo com o novo usando um objeto nativo do JavaScript para
			// fazer a concatenação de dois objetos usa-se Object.assign() encapsulando na variável de
			// resultado para manipulação de ambos objetos já concatenados, é necessário passar dois
			// parâmetros em forma de objeto literal, sendo que o segundo parâmetro irá substituir o primeiro
			// é necessário ter um vazio para não perder os dados antigos
			let result = Object.assign({}, userOld, values)

			this.getPhoto(this.formUpdateEl).then(

				content =>{
					// verificação se o campo foto está vazio e se estiver recuperar o valor antigo
					if(!values.photo) {
						
						result._photo = userOld._photo
					
					}else{
						// recuperar a foto que está no conteúdo do promise que faz a encriptogria
						// e passa a inserção da foto se for passado uma nova foto
						result._photo = content
					}

					// acessar a linha específica da tabela e passar o index recuperado pelo dataset.trIndex
					// mas para atualizar é preciso recuperar o objeto que está em dataset.user que receberar um
					// novo valor vindo do formulário, é preciso que esses novos valores seja convertidos para o
					// JSON, aqui será sobreescrito novos valores
					//tr.dataset.user = JSON.stringify(result)
					let user = new Users()

					user.loadFromJSON(result)

					user.save()
					
					this.getTr(user, tr)
			
					this.updateCount()
					
					this.formUpdateEl.reset()

					btn.disabled = false

					this.showPainelCreate()

					/*
					// exibindo novos registros atualizados
					tr.innerHTML = `
				        <td>
				          <img src="${result._photo}" alt="User Image" class="img-circle img-sm">
				        </td>

				        <td>${result._name}</td>
				        <td>${result._email}</td>
				        <td>${(result._admin) ? 'Sim' : 'Não'}</td>
				        <td>${Utils.dateFormat(result._register)}</td>

				        <td>
				          <button type="button" class="btn btn-primary btn-update btn-xs btn-flat">Editar</button>
				          <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
				        </td>
					`
					// chamada do método addEventsTR
					this.addEventsTR(tr)

					// chamada do método de estatisticas
					this.updateCount(tr.dataset.user)
					*/
				},
				// caso ocorra algum tipo de erro será recuperado pelo parâmetro 
				e =>{
					console.error(e)
				}
			)
		})
	}
	onSubmit(){
		// recuperando this fora para ser chamado dentro do escopo da função
		//let _this = this
		this.formEl.addEventListener('submit', e => {
		
		// evitar comportamento padrão do botão de enviar
		e.preventDefault()

		let btn = this.formEl.querySelector('[type=submit]')

		// habilitar o butão de enviar dados porque apos o primeiro envio este ficará
		// desabilitado para envitar duplicidade de envios
		btn.disabled = true
		
		// encapsula a chamada do método pegar dados do formulário e faz a chamada
		let values = this.getValues(this.formEl)

		// correção de bugs porque quando envia a foto a verificação trata como objeto
		// e neste caso deve ser tratado como boolean
		if(!values) return false

		// chamada do método com promise, para toma de decisão em relação ao objeto
		// é passado, necessário dois parâmetros como função no primeiro parâmetro é para aceitar
		// a URL que objeto fileReader passa e no segundo é em caso de rejeição ou erros
		this.getPhoto(this.formEl).then(

				content =>{

					// recuperar os valores da foto em criptogria pelo fileReader
					values.photo = content

					// recuperando a instancia em value e chamando o método save porque values já
					// faz a instancia da class
					values.save()

					// adicionar os valores do usuário no banco de dados
					this.addUser(values)

					// desabilitar butão de enviar para não hover repetições ou duplicidade de
					// possiveis envios.
					//btn.disabled = false

					// limpar os campos do formulário para novo registro
					this.formEl.reset()

					btn.disabled = false
				},
				// caso ocorra algum tipo de erro será recuperado pelo parâmetro 
				e =>{

					console.error(e)

				}
			)
		})
	}
	getPhoto(form){

		// retorna a instancia de um objeto para fazer um tratamento de possíveis erros
		// este objeto promise funciona como um try catch - nessário passar esses dois
		// parâmetros para tomada de decisão, aceita ou rejeita
		return new Promise((resolve, reject) =>{
			
			// tratamento de fotos ou arquivo de mídia
			let fileReader = new FileReader()
			
			// percorre totos os campos do formulário como objeto e faz um filtro que 
			// retorna somente os itens que forem identicos a string photo que é recuperada
			// pelo filtro.
			let elements = [...form.elements].filter(item => {
		
				if(item.name === 'photo'){
			
					return item
			
				}
		
			})
			// recupera as mídias encapsulando na vaviável
			let file = elements[0].files[0]
			
			// realiza o carregamento da foto 
			fileReader.onload = () =>{
				
				// se caso a URL vinda de DataURL for verdadeira então deve resolver
				// após o carregamento retornar como resultado
				resolve(fileReader.result)
			
			}
			// recuperar possíveis erros de envios
			fileReader.onerror = e =>{
				// recupera e reijetar
				reject(e)

			}
			// uma simples verificação se o arquivo enviado existe e fazer a sua encriptograifa
			if(file) {
				// adicionando encriptogria do arquivo e enserir uma URL
				fileReader.readAsDataURL(file)

			}else{
				// carregamento de arquivo padrão 
				resolve('dist/img/avatar5.png')
			}
		
		})
		
	}
	getValues(formEl){
		/*
		* forEach é para percorrer array - aqui abaixo se trata de um objeto - significa que forEach
		* não existe dentro do elements, sempre use console.log() e também typeof para saber que tipo
		* de dados está sendo tratado.
		* deve converter para array - com operador spread
		*/
		let user = {}
		let isvalid = true
		/*
		//console.log([...this.formEl.elements])
		for(let i in formEl.elements){

			// realiza um busca por cada índice, que neste caso é um objeto, assim pode ser
			// recuperado dos dados que estão dentro do formulário de forma dinâmica e passar
			// fazendo a comparação dos valores que estão no array, e se o retorno dessa busca
			// for -1 indica que o indexOf não encontrou nenhum campo com os mesmo indicados então
			// devmos considerar que este campo não foi preenchido
			if(['name', 'email','password'].indexOf(formEl.elements[i].name) > -1 && !formEl.elements[i].value){
				
				// apenas selecionandos todos os elementos encontrado na busa e caso alguns
				// não foi preenchidos será inseridos a classe ao elemento pai do input
				formEl.elements[i].parentElement.classList.add('has-error')

				// retorna false se nenhum ou campo não for preenchido e parando a execusão do script
				isvalid = false
				//console.log(formEl.elements[i].name)
			}

			// recuperar somento os chebox que for maracado 
			if(formEl.elements[i].name == 'gender'){

				if(formEl.elements[i].checked){

					user[formEl.elements[i].name] = formEl.elements[i].value 

				}
			}else if(formEl.elements[i].name == 'admin'){

				user[formEl.elements[i].name] = formEl.elements[i].checked

			}else{

				user[formEl.elements[i].name] = formEl.elements[i].value

			}
		}
		*/
		[...formEl.elements].forEach(function (field, index) {

			if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){

				field.parentElement.classList.add('has-error')
				isvalid = false
			}
			if(field.checked){

				user[field.name] = field.value

			}else if(field.name == 'admin'){

				user[field.name] = field.checked

			}else{

				user[field.name] = field.value
			}
		})

		if(!isvalid) return false
		
		/*
		this.formEl.elements.forEach(function(field, index){
			if(field.name == 'gender'){
				if(field.checked){
					user[field.name] = field.value

				}
			}else{
				user[field.name] = field.value

			}
		})
		*/
		return new Users(user.name,user.gender,user.birth,user.country,user.email,user.password,user.phpto,user.admin)
	}
	// método para listar dados do sessio storage
	selectAll(){

		let users = Users.getUserSession()

		users.forEach(dataUser => {

			let user = new Users()

			user.loadFromJSON(dataUser)

			this.addUser(user)

		})
	}
	/*
	insert(data){

		let users = this.getUserSession()

		// adiciona o novo objeto literal
		users.push(data)

		// receber pelo parâmetro string JSON e percorrer cada campo extrainda seus valores
		// o primeiro parâmetro do sessionStorage.setItem('param1', 'param2') indica a chave
		// e o segundo deve ser JSON que indica o valor
		//sessionStorage.setItem('users', JSON.stringify(users))
		localStorage.setItem('users', JSON.stringify(users))
	}
	*/
	addUser(dataUser){
		
		let tr = this.getTr(dataUser)
		//console.log(tr.dataset.user)

		//console.log('addLine', dataUser)
		this.tableEl.appendChild(tr)

		// atualização do número de usuaŕios
		this.updateCount()

	}
	getTr(dataUser, tr = null){

		if(tr === null) tr = document.createElement('tr')

		// criando um dataset para recuperar valores do admin e separar os registro na estatísticas
		// deve ser criando aqui porque os registro são inseridos aqui de forma dinâmica
		// dataset funciona como uma variável porém só armazenda strings
		tr.dataset.user = JSON.stringify(dataUser)

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
		`
		// chamada do método addEventsTR
		this.addEventsTR(tr)

		return tr

	}
	// adicionando eventos na tr
	addEventsTR(tr){
		// adicionando evento de excluir registros
		tr.querySelector('.btn-delete').addEventListener('click', e => {

			// confirm abre uma janela de opções para usuario - seu retorno é true or false
			// se for true recuperar o método tr passado pelo parâmetro e remove - este tr refere-se
			// ao botão que foi clicado os demais não serão afetados
			if(confirm('Confirma a remoção deste item?')) {
				
				// remoção do localstorage é necessário recuperar os dados que estão no json e passar
				// para um novo objeto usando a conversão de carregamento json aqui o json ou mehor
				// tr.dataset.user é uma string precisa ser convertido
				let user = new Users()
				user.loadFromJSON(JSON.parse(tr.dataset.user))

				// para remoção propriamente deve usar a remove que deve ser criada na classe Users
				// instancia do objeto no localstorage
				user.remove()

				// remoção da linha de registro - este remove é um comando do JavaScript
				tr.remove()

				this.updateCount()
			}

		})

		// atualização dos dados de registro - quando hover um clique sobre um botão da lista
		// deverá recuperar exatamente os dados deste registro de forma dinâmica, para fazer
		// isso deverá fazer a seleção de diferenciação pela classe, excluir ou editar
		tr.querySelector('.btn-update').addEventListener('click', e => {
			
			// atualização dos dados de registros é preciso percorrer o JSON e em cada valor
			// fazer as alterações - fazendo a conversão de JSON para objeto literal
			//console.log(JSON.parse(tr.dataset.user))
			let json = JSON.parse(tr.dataset.user)

			// selecionar o formulário e encapsular em uma var form
			//let form = document.querySelector('#form-user-update')

			// recuperando o index da linha de registro criado para poder substituir os dados por
			// novos dados, para fazer isso vamos passar um dataset com nome de trIndex e receberar o
			// valor sectionRowIndex que significa o índice 0 do array, esta sendo criando aqui porque
			// será adicionado no registro dinamicamente
			this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex

			// percorrendo dados do objeto literal usando for in
			for(let name in json){

				// percorrer todos os campos do formulário onde o atributo name se encontra
				// e adicionar um underline devido ao encapsulamento dos atributos private na class User
				// para fazer a substituição do underline por vazio
				let field = this.formUpdateEl.querySelector("[name=" + name.replace("_","") + "]")

				// atribuição o valor da propriedade name do JSON para o valor do campo como se fosse
				// uma substituição dos valores já existentes, também deve verificar se este campo
				// existe porque na declaração dos atributos existe campo que não requer formulário
				// como no caso do date
				if(field){

					// se o tipo for file então pula
					// se o campo for do tipo de mídia então deve continuar a percorrer e vamos
					// usar switch porque já sabemos o que pode acontecer
					switch(field.type){
						case 'file':
							continue
							break
						case 'radio':
						// sobreescrever o mesmo valores recuperado no field e colocar na campo de
						// value o valor vindo do json - caso esteja seleciona masculino então deve
						// sobreescrever também para feminino se for selecionado
						field = this.formUpdateEl.querySelector("[name="+name.replace("_","")+"][value="+json[name]+"]")
						
						// após localizar o campo e passar o valor M ou F deve configurar para true
						field.checked = true
							break
						case 'checkbox':
						// aqui vamos achar o admin e também fazer a verificação dos valores - como
						// este valor já configurado para true ou false basta passar o valor vindo do json
						field.checked = json[name]
							break
						default:
						// aqui é onde acontece a substiuição dos dados e também a inserção no campo do
						// formulário os valores já registrado considerando as condições acima
						field.value = json[name]

					}
				}
			}
			// selecionar o elemento pela classe photo do formulário update e acessar o atributo 
			// src e atribuir o valor que vier pelo json
			this.formUpdateEl.querySelector('.photo').src = json._photo
			
			// mostrar painel de atualização
			this.showPainelUpdate()
			
		})
	}
	// show painel update
	showPainelUpdate(){
		// seleção dos formulários para esconder e exibir
		document.querySelector('#box-user-create').style.display = 'none'
		document.querySelector('#box-user-update').style.display = 'block'
	}

	// show painel create
	showPainelCreate(){
		// seleção dos formulários para criação
		document.querySelector('#box-user-create').style.display = 'block'
		document.querySelector('#box-user-update').style.display = 'none'
	}
	/*
	// método para atualização de quantos usuários existem no banco de dados
	updateCount(){
		// Serialização:
		// converter um objeto para string sem perder seus dados e valores
		// JSON.stringfy() - assim podemos converter qualquer objeto para string
		// JSON.parse() - assim podemos converter qualquer string para objeto
		
		let numberUser = 0
		let numberAdmin = 0
		
		// verificando se user é igual a admin depois de fazer a reconversão
		//let users = JSON.stringify(tr.dataset.user)
		
		// console para verificar qual elemento possui a informação de que a tabela
		// possui a quantidade de linhas registrada que por usa vez indica a quantidade de usuarios
		// assim como para achar o elemento pai, parentElement também é possível achar o elemento
		// filho, pelo childElementCount - neste caso deve usar children e não é um array e sim
		// uma coleção - definir duas variáveis para mostrar nos seus lugares na página

		//let fields = this.tableEl.children
		//console.log(this.tableEl.children)
		
		for(let i in this.tableEl.children){

			//let rows = this.tableEl.children[i]
			//console.log(this.tableEl.children[i])
			
			// usando operador de incremento dentro do laço de repetição para sempre
			// que for passado incrementar mostrando como se fosse novo usuário
			// usando DataSet para recuperar dentro da tabela qual é usuário e admin
			// assim podemos separar os dois e fazer as distinções
			//numberUser = this.tableEl.children[i]
			//numberUser++

			// O JSON retorna um objeto comum, que não foi criado por uma classe por isso não pode
			// acessar este atributo, devemos colocar underline para acessar diretamento, caso contrário
			// teriamos que fazer uma nova classe com os valores vindo do JSON
			//if(users._admin){numberAdmin = this.tableEl.children[i]}

		}

		let users = Users.getUserSession()

		users.forEach(dataUser => {

			let user = new Users()

			user.loadFromJSON(dataUser)
			
			numberUser++

			if(user.admin) numberAdmin++
		// fazendo atualização dos valores na tela
		document.querySelector('#numberUser').innerHTML = numberUser
		document.querySelector('#numberAdmin').innerHTML = numberAdmin

		})

		
	}
	*/
	updateCount(){
		let numberUser = 0;
		let numberAdmin = 0;



		[...this.tableEl.children].forEach(tr => {

			numberUser++

			let user = JSON.parse(tr.dataset.user)

			if(user._admin) numberAdmin++
		})
		document.querySelector('#numberUser').innerHTML = numberUser
		document.querySelector('#numberAdmin').innerHTML = numberAdmin

	}

}
