var conn = require('./db');
var path = require('path');

module.exports = {
    read(){
        return new Promise((resolve, reject)=>{
            conn.query('SELECT * FROM tb_menus ORDER BY register DESC', (err, result) =>{
                (err) ? reject(err) : resolve(result)
            });
        });
    },
    create(fields, files){
        return new Promise((resolve, reject)=>{
            // path para converter o nome da imagen original
            fields.photo = `images/${path.parse(files.photo.path).base}`;
            // declaração dos parâmetros para query
            let query, queryPhoto = '', params = [fields.title,fields.description,fields.price];
            // verificação se há campo foto
            if(files.photo.name){
                // atributindo valor usado na query
                queryPhoto = ',photo = ?';
                // adicionando path da foto no array
                params.push(fields.photo);
            }
            // verificando id maior que zero para atualização
            if(parseInt(fields.id) > 0){
                // adicionando campo id no array de parâmetros
                params.push(fields.id);
                query = `UPDATE tb_menus SET title = ?, description = ?, price = ? ${queryPhoto} WHERE id = ?`;
            }else{
                // verificando se campo foto existe
                if(!files.photo.name){
                    reject('Envie a foto');
                }
                query = 'INSERT INTO tb_menus(title,description,price,photo)values(?,?,?,?)';
            }
            conn.query(query,params,(err, result)=>{
                (err) ? reject(err) : resolve(result);
            });
        });
    },
    delete(id){
        return new Promise((resolve,reject)=>{
            conn.query('delete from tb_menus where id = ?',[id],(err,result)=>{
                (err) ? reject(err) : resolve(result);
            });
        });
    }
}