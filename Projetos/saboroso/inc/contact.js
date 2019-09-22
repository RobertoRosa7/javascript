var conn = require('./db');
module.exports = {

    render(req,res,error,success){
        res.render('contact',{
            title:'Contatos - Restaurante Saboroso!',
            background:'images/img_bg_3.jpg',
            isHome: false,
            body:req.body,
            error,
            success,
            h1:'Diga oi!'
        });
    },

    create(fields){
        return new Promise((resolve, reject) =>{
            conn.query('INSERT INTO tb_contacts(name,email,message)values(?,?,?)',
            [fields.name,fields.email,fields.message],(err, result) =>{
                (err) ? reject(err) : resolve(result);
            });
        });
    },
    
    read(){
        return new Promise((resolve, reject)=>{
            conn.query('SELECT * FROM tb_contacts ORDER BY register DESC',(err, result)=>{
                (err) ? reject(err) : resolve(result);
            });
        });
    },

    delete(id){
        return new Promise((resolve, reject)=>{
            conn.query('DELETE FROM tb_contacts WHERE id = ?',[id], (err, result)=>{
                (err) ? reject(err) : resolve(result);
            });
        });
    }
};