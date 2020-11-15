// declara of const to include files
const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// declare app 
let app = express();

app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false, limit:'50mb' }));
app.use(bodyParser.json({ limit:'50mb' }));

// include file autoload
consign().include('routes').include('utils').into(app);

// server listening
app.listen(4000, '127.0.0.1', ()=>{
	console.log('está funcionando!');
});