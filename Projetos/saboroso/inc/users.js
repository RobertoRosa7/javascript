var conn = require('./db');
module.exports = {
    render(req,res,error){
        res.render('admin/login',{
            body:req.body,
            error
        });
    },

    login(email, password){
        return new Promise((resolve, reject) =>{
            conn.query('SELECT * FROM tb_users WHERE email = ?',[email],(err, result)=>{
                if(err){
                    reject(err);
                }else{
                    if(!result.length > 0){
                        reject('Usuário ou Senha incorretos!');
                    }else{
                        let row = result[0];
                        if(row.password !== password){
                            reject('Usuário ou Senha incorretos!');
                        }else{
                            resolve(row);
                        }
                    }
                }
            });
        });
    },

    read(){
        return new Promise((resolve, reject) =>{
            conn.query('SELECT * FROM tb_users ORDER BY name DESC',(err, result)=>{
                (err) ? reject(err) : resolve(result);
            });
        });
    },

    create(fields){
        return new Promise((resolve, reject)=>{
            let query, params = [fields.name,fields.email];
            
            if(parseInt(fields.id) > 0){
                params.push(fields.id);
                
                query = 'UPDATE tb_users SET name = ?, email = ? WHERE id = ?';
            }else{
                params.push(fields.password);
                
                query = 'INSERT INTO tb_users(name,email,password)VALUES(?,?,?)';
            }
            
            conn.query(query,params,(err, result)=>{
                (err) ? reject(err) : resolve(result);
            });
        });
    },

    delete(id){
        return new Promise((resolve, reject)=>{
            conn.query('DELETE FROM tb_users WHERE id = ?',[id],(err, result)=>{
                (err) ? reject(err) : resolve(result);
            });
        });
    },

    updatePassword(req){
        return new Promise((resolve, reject)=>{
          
            if(!req.fields.password){
                reject('Preencha o campo senha!');
            }else if(req.fields.password !== req.fields.passowordConfirm){
                reject('As senhas não são iguais.');
            }else{
                conn.query('UPDATE tb_users SET password = ? WHERE id = ?',
                [req.fields.passowrd, req.fields.id],(err, result)=>{
                    (err) ? reject(err.message) : resolve(result);
                });
            }
        });
    }
};