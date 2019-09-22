// incluindo todos recursos do express de route
let express = require('express');

// chamando recursos de rotas
let routes  = express.Router();

routes.get('/', (req, res) => {

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

routes.get('/admin', (req,res)=>{

	res.statusCode = 200;
	res.setHeader('content-Type', 'application/json');
	res.json({
		user:[{
			name:'Sandra Rosa',
			profissão:'Farmacêutica',
			email:'sandra.rosa7@gmail.com',
			id:2
		}]
	})
})
// exportando route para outros script terem acesso
module.exports = routes;