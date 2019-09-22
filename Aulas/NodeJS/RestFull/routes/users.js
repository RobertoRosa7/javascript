// antes do módule devemos colocar NeDB - um banco de dados para JavaScript
let NeDB = require('nedb');
/*
* na instancia da classe devemos passar alguns parâmetros que serão configurados
* nome do arquivo, e se não existir crie um automáticamente com autoload
*/
let db = new NeDB({

	filename:'users.db',
	autoload: true
});
// exportando route para outros script terem acesso o arquivo raiz que está no index
module.exports = app => {

	let route = app.route('/users');

	route.get((req, res) => {

		// listando usuários 
		db.find({}).sort({name:1}).exec((err, users) => {

			if(err){

				app.utils.error.send(err,req,res);

			} else{
				res.statusCode = 200;
				res.setHeader('content-Type', 'application/json');
				res.json({
					users
				});
			}
		});
	});

	route.post((req,res) => {

		// os campos que serão enviados ficaram no body
		//res.json(req.body);

		// validação dos dados de usuários
		if(!app.utils.validator.user(app, req,res)) return false;

		//passando os arquivo com insert({objeto json} (erro, success) =>)
		db.insert(req.body, (err, users) => {
			// se existir algum erro então imprima
			if(err){

				app.utils.error.send(err,req,res);

			} else{

				res.status(200).json(users);
			}
		});
	});

	let routeId = app.route('/users/:id');

	routeId.get((req,res)=>{

		db.findOne({_id:req.params.id}).exec((err, user) =>{

			if(err){

				app.utils.error.send(err,req,res);

			} else{

				res.status(200).json(users);
			}

		});
	});
	routeId.put((req,res)=>{
		
		if(!app.utils.validator.user(app, req,res)) return false;

		db.update({_id:req.params.id}, req.body, err =>{

			if(err){

				app.utils.error.send(err,req,res);

			} else{

				res.status(200).json(Object.assign(req.params, req.body));
			}

		});
	});
	routeId.delete((req,res)=>{

		db.remove({_id:req.params.id}, {}, err =>{

			if(err){

				app.utils.error.send(err,req,res);

			} else{

				res.status(200).json(req.params);
			}

		});
	});
};