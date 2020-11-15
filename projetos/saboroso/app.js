// include de módulos
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var formidable = require('formidable');
var http = require('http');
var socket = require('socket.io');

// instancia do express
var app = express();

// http server sobre app express para sobreescrever e usar socket.io
var http = http.Server(app);

// socket.io
var io = socket(http);

// quando houver uma nova conexão no socket
io.on('connection', function(socket){
  console.log('novo usuário conectado ao socket.io');
  // io para todos os usuários - socket somente para usuário conectado
  io.emit('reservation update',{
    date: new Date()
  });
});

// definição das rotas para roetamento
var indexRouter = require('./routes/index')(io);
var adminRouter = require('./routes/admin')(io);

// definição de middleware para formidable
app.use(function(req,res,next){

  req.body = {};
  //if(req.url == '/admin/login') req.method = 'post';
  // verificação se está requisição é post somente
  if(req.method === "POST"){
    var form = formidable.IncomingForm({
      // diretório para salvar arquivos
      uploadDir: path.join(__dirname, "/public/images"), 
      // mantendo a extensão dos arquivos binários
      keepExtensions: true 
    });
    // realizando o parse dos dados
    form.parse(req, function(err, fields, files){
       // acesso pelo req.??? como em qualquer middelware
      req.body = fields,
      req.fields = fields;
      req.files = files;
      // permite acessar próxima rota
      next();
    });
  }else{
    next();
  }
});

// configuração de renderização dos templates ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// definição da sessão 
app.use(session({
  store: new RedisStore({
    host:'localhost',
    port:6379
  }),
  secret:'password',
  resave: true,
  saveUninitialized:true
}));

// definição de configuração das requisições
app.use(logger('dev'));
//app.use(express.json());

//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// definição das rotas
app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// ouvindo na porta 3000 o servidor http com socket
http.listen(3000, function(){
  console.log('servidor em execução!');
});
// ao usar http listener não é mais necessário module exports
//module.exports = app;
