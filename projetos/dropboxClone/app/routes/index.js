// include module
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// Read the content file on browser
router.get('/file', (req, res)=>{
	let path = './' + req.query.path;
	if(fs.existsSync(path)){
		fs.readFile(path, (err, data)=>{
			if(err){
				console.error(err);
				res.status(400).json({
					error:err
				})
			}else{
				res.status(200).end(data);
			}
		});
	}else{
		res.status(404).json({
			Erro:'File not found.'
		})
	}
});
// DELETE file on /upload
router.delete('/file', (req, res) =>{
	let form = new formidable.IncomingForm({
		uploadDir: './upload',
		keepExtension: true
	});
	form.parse(req, (err, fields, files) =>{
		let path = './' + fields.path;
		if(fs.existsSync(path)){
			fs.unlink(path, err =>{
				if(err){
					res.status(400).json({
						err
					});
				}else{
					res.json({
						fields
					});
				}
			});
		}else{
			res.status(404).json({
				Erro:'File not found.'
			})
		}
	});
});

// POST dir upload
router.post('/upload', (req, res) =>{
	let form = new formidable.IncomingForm({
		uploadDir: './upload',
		keepExtension: true
	});
	form.parse(req, (err, fields, files) =>{
		res.json({
			files
		});
	});
});
// export to app.js
module.exports = router;
