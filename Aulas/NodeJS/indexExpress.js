let express = require('express');
let routes = express.Router();

routes.get('/', (req, res) => {

	console.log('URL: ', req.url);
	console.log('METHOD', req.url);

		res.statusCode = 200;

		res.setHeader('content-Type', 'text/html');

		res.end('<h1>Olá este é um Servidor NodeJS</h1>');
});
module.exports = routes;
