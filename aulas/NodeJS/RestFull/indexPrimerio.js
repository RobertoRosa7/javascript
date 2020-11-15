// constante para encapuslar requisições HTTP - carregando o módulo
const http = require('http');

// criando um novo servidor recebendo um callback com parâmetros de requisição e resposta
// guardando o servidor criando dentro da variável server
let server = http.createServer((req, res) => {

	// verificando se a criação está responde as requisições
	console.log('URL: ', req.url);
	console.log('METHOD', req.url);

	// criando um switch para saber qual é a URL que foi requisitada pelo usuário
	switch(req.url){
		// se a requisição for raiz / então o que devo mostrar para usuário?
		case '/':
		// verificando o status code se é 200 ou não
		res.statusCode = 200;

		// indicando que será mostrado um documento HTML
		res.setHeader('content-Type', 'text/html');

		// resposta final o que será exibido
		res.end('<h1>Olá este é um Servidor NodeJS</h1>');

		break;

		case '/users':
		res.statusCode = 200;

		// indicando que será mostrado como aplicação
		res.setHeader('content-Type', 'application/json');
		res.end(JSON.stringify({

			users:[{
				name:'Roberto Rosa',
				profissao:'Desenvolvedor Web',
				email:'roberto.rosa7@gmail.com',
				id:1
			}]

		}));
		
		break;

	}
	// recuperando a respossta do servidor 
	//res.end('ok')

});

// modo listening para que o servidor fique atendo a toda requisição, com um callback recebendo
// parâmetros listen(porta, ip, function()), na função deve ser inserido o que deve fazer ao
// receber uma requisição nesta porta e com esse ip
server.listen(8080, '127.0.0.1', () => {

	// verificando se o servidor está em funcionamento
	console.log('está funcionando!');
});