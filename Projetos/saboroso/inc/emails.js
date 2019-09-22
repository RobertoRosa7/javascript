var conn = require('./db');

module.exports = {

    read(){
        return new Promise((resolve, reject)=>{
            conn.query('SELECT * FROM tb_emails ORDER BY register DESC',(err, result)=>{
                (err) ? reject(err) : resolve(result);
            });
        });
    },

    create(req){
        return new Promise((resolve,reject)=>{
            if(!req.fields.email){
                reject('Preencha o campo E-mail');
            }else{
                conn.query('INSERT INTO tb_emails(email)VALUES(?)',[req.fields.email],(err, result)=>{
                    (err) ? reject(err.message) : resolve(result);
                });
            }
         });
    },

    delete(id){
        return new Promise((resolve,reject)=>{
            conn.query('DELETE FROM tb_emails WHERE id = ?',[id],(err, result)=>{
                (err) ? reject(err) : resolve(result);
            });
        });
    }
}