var menus = require('./../inc/menus');
var express = require('express');
var reservation = require('./../inc/reservations');
var contact = require('./../inc/contact');
var email = require('./../inc/emails');
var router = express.Router();


module.exports = function(io){
  /* GET home page. */
  router.get('/', function(req, res, next) {
    menus.read().then(result =>{
      res.render('index', {
        title:'Restaurante Saboroso!',
        isHome: true,
        menu: result
      });
    });
  });

  // router to contact
  router.get('/contact', function(req, res, next){
    contact.render(req,res,null);
  });

  router.post('/contact',function(req,res,next){
    if(!req.body.name){
      contact.render(req,res,'Digite seu nome!');
    }else if(!req.body.email){
      contact.render(req,res,'Digite seu email!');
    }else if(!req.body.message){
      contact.render(req,res,'Digite sua mensagem!');
    }
    
    contact.create(req.body).then(result =>{
      req.body = {};
      io.emit('dashboard update');
      contact.render(req,res,null,'Mensagem enviado com successo!');
    }).catch(err =>{  
      contact.render(req,res,err.message || err);
    });
  });

  // router to menu
  router.get('/menu', function(req, res, next){
    menus.read().then(result =>{
      res.render('menu', {
        title:'Restaurante Saboroso!',
        background:'images/img_bg_1.jpg',
        h1:'Saboreie nosso menu',
      isHome: false,
        menu: result
      });
    });
  });

  // router to reservation
  router.get('/reservation', function(req, res, next){
    reservation.render(req,res);
  });

  router.post('/reservation', function(req, res, next){
    if(!req.body.name){
      reservations.render(req,res,'digite seu nome');
    }else if(!req.body.people){
      reservations.render(req,res,'digie quantoas pessoas');
    }else if(!req.body.email){
      reservations.render(req,res,'digite seu email');
    }else if(!req.body.date){
      reservations.render(req,res,'escolha uma data');
    }else if(!req.body.time){
      reservations.render(req,res,'escolha um horário');
    }
    
    reservation.create(req.body).then(result =>{
      req.body = {};
      io.emit('dashboard update');
      reservation.render(req,res,null, 'Reserva feita com sucesso!');
    }).catch(err =>{
      reservation.render(req,res,err.message);
    });
  });

  // router to services
  router.get('/services', function(req, res, next){
    res.render('services',{
      title: 'Serviços - Restaurante Saboroso!',
      background:'images/img_bg_1.jpg',
      isHome: false,
      h1:'É um prazer em servir!'
    });
  });

  // emails subscribe
  router.post('/subscribe', function(req,res,next){
    email.create(req).then(result =>{
      res.send(result);
    }).catch(err =>{
      res.send(err);
    });
  });

  return router;
};
