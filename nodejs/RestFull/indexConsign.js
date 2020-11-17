// constante para encapuslar requisições HTTP - carregando o módulo do Express
const express = require('express');

/*
* incluindo as rotas de cada arquivo aqui usando um require esses arquivos estão em diretório
* esses arquivos estão em diretórios separados para serem reutilizados e feito manutenção sempre
* que for necessário. 
*
*/
let routesIndex = require('./routes/index.js');
let routesUsers = require('./routes/users.js');

// criando uma variável app para encapsular o express
let app = express();

/*
* indica qual rota usar
*/
app.use(routesIndex);

/*
* para indicar uma rota mais específica para cada diretório podemos
* definir como padrão, assim sempre que se tratar de usuários iremos
* chamar a rota de usuários
*/
app.use('/users', routesUsers);
















/*
app.get('/', (req, res) => {

	console.log('URL: ', req.url);
	console.log('METHOD', req.url);

		res.statusCode = 200;

		res.setHeader('content-Type', 'text/html');

		res.end('<h1>Olá este é um Servidor NodeJS</h1>');
});
*/
/*
app.get('/users', (req, res) => {

		res.statusCode = 200;

		res.setHeader('content-Type', 'application/json');

		res.json({

			users:[{
				name:'Roberto Rosa',
				profissao:'Desenvolvedor Web',
				email:'roberto.rosa7@gmail.com',
				id:1
		}]

	});
});
*/
app.listen(8080, '127.0.0.1', () => {

	console.log('está funcionando!');
});