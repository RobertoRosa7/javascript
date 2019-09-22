var express = require('express');
var user = require('./../inc/users');
var menu= require('./../inc/menus');
var admin = require('./../inc/admin');
var contact = require('./../inc/contact');
var email = require('./../inc/emails');
var reservation = require('./../inc/reservations');
var moment = require('moment');
var router = express.Router();


module.exports = function(io){
    moment.locale('pt-BR');

    // middleware
    router.use(function(req,res,next){
        if(['/login'].indexOf(req.url) === -1 && !req.session.user){
            res.redirect('/admin/login');
        }else{
            next();
        }
    });

    // midlleware menu
    router.use(function(req,res,next){
        req.menus = admin.getMenus(req);
        next();
    });

    // admin
    router.get('/', function(req,res,next) {
    admin.dashboard().then(data =>{
        res.render('admin/index',admin.getParams(req,{
        data
        }));
    }).catch(err =>{
        console.error(err);
    });
    });

    // dashboard update data
    router.get('/dashboard', function(req,res,next){
        reservation.dashboard().then(data =>{
            res.send(data);
        });
    });

    // login
    router.get('/login', function(req,res,next) {
        user.render(req,res,null);
    });

    // post login
    router.post('/login', function(req,res,next) {
        if(!req.body.email){
            user.render(req,res,'Preencha o campo email!');
        }else if(!req.body.password){
            user.render(req,res,'Preencha o campo Senha!');
        }
        
        user.login(req.body.email, req.body.password).then(user =>{
            req.session.user = user;
            res.redirect('/admin');
        }).catch(err =>{
            user.render(req,res,err.message || err);
        });
    });

    // logout
    router.get('/logout', function(req,res,next){
        delete req.session.user;
        res.redirect('/admin/login');
    });

    // menus
    router.get('/menus', function(req,res,nex){
        menu.read().then(data =>{
            res.render('admin/menus',admin.getParams(req,{
                data
            }));
        });
    });

    // menu post
    router.post('/menus', function(req,res,next){
        menu.create(req.fields, req.files).then(result =>{
            io.emit('dashboard update');
            res.send(result);
        }).catch(err =>{
            res.send(err);
        });
    });

    // menu delete
    router.delete('/menus/:id', function(req,res,nex){
        menu.delete(req.params.id).then(result =>{
            io.emit('dashboard update');
            res.send(result);
        }).catch(err =>{
            res.send(err);
        });
    });

    // contacts
    router.get('/contacts', function(req,res,next) {
        contact.read().then(data =>{
            res.render('admin/contacts',admin.getParams(req,{
                data
            }));
        });
    });

    // contacts delete
    router.delete('/contacts/:id', function(req,res,next){
        contact.delete(req.params.id).then(result =>{
            io.emit('dashboard update');
            res.send(result);
        }).catch(err =>{
            res.send(err);
        });
    });

    // email
    router.get('/emails', function(req,res,next) {
        email.read().then(email =>{
            res.render('admin/emails',admin.getParams(req,{
                email
            }));
        });
    });

    // email delete
    router.delete('/emails/:id', function(req,res,next){
        email.delete(req.params.id).then(result =>{
            io.emit('dashboard update');
            res.send(result);
        }).catch(err =>{
            res.send(err);
        });
    });

    // users
    router.get('/users', function(req,res,next) {
        user.read().then(data =>{
            res.render('admin/users',admin.getParams(req, {
                data
            }));
        });
    });

    // users post
    router.post('/users', function(req,res,next){
        user.create(req.fields).then(result =>{
            io.emit('dashboard update');
            res.send(result);
        }).catch(err =>{
            res.send(err)
        });
    });

    // users delete
    router.delete('/users/:id', function(req,res,next){
        user.delete(req.params.id).then(result =>{
            io.emit('dashboard update');
            res.send(result);
        }).catch(err =>{
            res.send(err)
        });
    });

    // users update password
    router.post('/users/update-password', function(req,res,next){
        user.updatePassword(req).then(result =>{
            res.send(result);
        }).catch(err =>{
            res.send({error: err});
        });
    });

    // reservations
    router.get('/reservations', function(req,res,next) {
        let start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
        let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');
        
        reservation.read(req).then(pagination =>{
            res.render('admin/reservations',admin.getParams(req,{
                date:{start, end},
                data: pagination.data,
                links:pagination.links,
                moment
            }));
        });
    });

    // reservations post
    router.post('/reservations', function(req,res,next){
        reservation.create(req.fields).then(result =>{
            res.render(result);
            io.emit('dashboard update');
        }).catch(err =>{
            res.send(err);
        });
    });

    // reservations delete
    router.delete('/reservations/:id', function(req,res,next){
        reservation.delete(req.params.id).then(result =>{
            res.render(result);
            io.emit('dashboard update');
        }).catch(err =>{
            res.send(err);
        });
    });

    // chart reservations
    router.get('/reservations/chart', function(req,res,next){
        req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
        req.query.end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

        reservation.chart(req).then(chartData =>{
            res.send(chartData);
        });
    });

    return router;
}
