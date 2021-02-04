const path = require('path');
const bodyParser = require('body-parser');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SendEmail = require('./src/services/send-email-service');
const Code = require('./src/utils/code');
const Crypto = require('crypto-js');

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	"template": './public/index.html'
});

module.exports = {
	// entry: ['regenerator-runtime/runtime', './src/app.js'], // sem pdf
	"entry":{
		"pdf.worker":"pdfjs-dist/build/pdf.worker.entry.js",
		"runtime":"regenerator-runtime/runtime",
		"app":"./src/app.js",
	},
	"output": {
		"filename":'[name].bundle.js',
		// "path": path.resolve(__dirname, '/dist'), // não junta os path
		"path":path.join(__dirname, 'dist'), // join junta os paths
		"publicPath":'/'
	},
	"module":{
		"rules":[
			{
				"test":/\.js$/i,
				"exclude":/node_modules/,
				"loader":'babel-loader',
				"query":{
					"presets": ['es2015', 'stage-0'],
					"plugins": ['transform-custom-element-classes', 'transform-es2015-classes'],
					"compact" : true
				}
			},
			{
				"test":/\.html$/i,
				"exclude":/node_modules/,
				"loader":'html-loader',
			},
			{
				"test":/\.css$/i,
				"use":['style-loader', 'css-loader']
			}
		]
	},
	"devServer":{
		"compress":true,
		"port":9000,
		"historyApiFallback":true,
		"before":function(app) {
			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({extended: true}));
			
			app.post('/api/v1/teste2', function(req, res) {
				console.log(req.body);
				res.send({status:true});
			});

			app.get('/api/v1/teste', function(req, res) {
				// const email = 'kakashi.kisura7@gmail.com';

				// const cipher = Crypto.AES.encrypt(email,createCode).toString();
				// const decipher = Crypto.AES.decrypt(cipher, createCode);
				// const original = decipher.toString(Crypto.enc.Utf8);
				
				// const decipher = Crypto.AES.decrypt(hash, codes);
				// const t = decipher.toString(Crypto.enc.Utf8);
				
			});
			
			app.post('/api/v1/reset_password', async function(req, res){
				const createCode = Code[Math.round((Math.random() * Code.length))];

				const payload = { 
					req, 
					res, 
					from:req.body.email,
					subject:'Reset password',
					text:createCode
				}

				const cipher = Crypto.AES.encrypt(JSON.stringify({ email:req.body.email, code: createCode }), createCode).toString();
				try{
					await SendEmail.sendEmail(payload);
					res.json({ "cipher":cipher, "email": req.body.email});
				}catch(e){
					res.status(404).send({error: e});
				}
				// 	transporter.verify(function(error, success) {
				// 		if (error) {
				// 		  console.log(error);
				// 		} else {
				// 		  console.log("Server is ready to take our messages");
				// 		}
				// 	});
			});

			app.post('/api/v1/create_new_password', function(req, res){
				
			});

			app.post('/api/v1/validate_code', function(req, res){
				try{
					const { code, cipher, email } = req.body;

					const decipher = Crypto.AES.decrypt(cipher, code);
					const original = JSON.parse(decipher.toString(Crypto.enc.Utf8));
	
					if(original.email == email){
						res.status(200).send({code:'validado'});
					}else{
						res.status(200).send({code:'errado'});
					}
				}catch(e){
					res.status(401).send({status:false});
				}

				// const email = 'kakashi.kisura7@gmail.com';
				// const cipher = Crypto.AES.encrypt(email,createCode).toString();
				// const decipher = Crypto.AES.decrypt(cipher, createCode);
				// const original = decipher.toString(Crypto.enc.Utf8);

			});
		},
	},
	"plugins": [HTMLWebpackPluginConfig]
}
