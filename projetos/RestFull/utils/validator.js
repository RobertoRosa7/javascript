module.exports = {
	user:(app, req, res) =>{
		req.assert('_name', 'O nome é obrigatório').notEmpty();
		req.assert('_email', 'O email não é válido').notEmpty().isEmail();
		req.assert('_password', 'Senha Obrigatória').notEmpty();
		let errors = req.validationErrors();
		if(errors){
			app.utils.error.send(errors, req, res);
			return false;
		}else{
			return true;
		}
	}
};