var conn = require('./db');
var Pagination = require('./../inc/Paginations');
var moment = require('moment');

module.exports = {
    render(req,res,error,success){
        res.render('reservation',{
            title: 'Reserva - Restaurante Saboroso!',
            background:'images/img_bg_2.jpg',
            isHome: false,
            h1:'Reserva uma Mesa!',
            body:req.body,
            success,
            error
          });
    },

    create(fields){
        return new Promise((resolve, reject) =>{
            // verificar se existe uma / dentro do array date
            if(fields.date.indexOf('/') > -1){
                // format date to mysql
                let date = fields.date.split('/');
                fields.date = `${date[2]}-${date[1]}-${date[0]}`;
            }
            let query,params = [fields.name,fields.email,fields.people,fields.date,fields.time];
            if(parseInt(fields.id) > 0){
                query = 'UPDATE tb_reservations SET name = ?, email = ?, people = ?, date = ?, time = ? WHERE id = ?';
                params.push(fields.id);
            }else{
                query = 'INSERT INTO tb_reservations(name,email,people,date,time)values(?,?,?,?,?)'
            }
            // insert data 
            conn.query(query,params,(err, result) =>{
                (err) ? reject(err) : resolve(result);
            });
        });
    },

    read(req){
        // retorna um promessa caso tenha problemas
        return new Promise((resolve, reject)=>{ 

            let page = req.query.page;
            let dtstart = req.query.start;
            let dtend = req.query.end;
            
            // define valor padrão se a página não existir
            if(!page) page = 1;
            
            // define os parâmetros para exibição das páginas
            let params = [];
    
            // verificar se existe filtro de datas
            if(dtstart && dtend) params.push(dtstart,dtend);
    
            // SQL_CALC_FOUND_ROWS = armazena total de registro de cada consulta
            // SELECT FOUND_ROWS(); executa a query com dados
            let pag = new Pagination(`SELECT SQL_CALC_FOUND_ROWS * FROM tb_reservations ${(dtstart && dtend) ? 'WHERE date BETWEEN ? AND ?' : ''} ORDER BY date DESC LIMIT ?, ?`, params);
            
            // retorna uma promessa da Pagination com um objeto da página
            pag.viewPage(page).then(data =>{
                resolve({
                    data,
                    links: pag.getNavigation(req.query)
                });
            });
        });
    },

    delete(id){
        return new Promise((resolve, reject)=>{
            conn.query('DELETE FROM tb_reservations WHERE id = ?', [id], (err, result)=>{
                (err) ? reject(err) : resolve(result);
            });
        });
    },

    chart(req){
        return new Promise((resolve,reject)=>{
            conn.query(`
            SELECT CONCAT(YEAR(date), '-', MONTH(date)) AS date, 
            COUNT(*) AS total, SUM(people) / COUNT(*) AS avg_people 
            FROM tb_reservations WHERE date BETWEEN ? AND ? 
            GROUP BY date DESC, MONTH(date) DESC 
            ORDER BY date DESC, MONTH(date) DESC;`,
            [req.query.start, req.query.end], (err, result) =>{
                if(err){
                    reject(err);
                }else{
                    let months = [];
                    let values = [];

                    result.forEach(row =>{
                        months.push(moment(row.date).format('MMM YYYY'));
                        values.push(row.total);
                    });

                    resolve({
                        months,
                        values
                    });
                }
            });
        });
    },

    dashboard(){
        return new Promise((resolve, reject) =>{
            conn.query(`
                SELECT
                 (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
                 (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
                 (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
                 (SELECT COUNT(*) FROM tb_users) AS nrusers;
            `,(err, result) =>{
                (err) ? reject(err) : resolve(result[0]);
            });
        });
    }
}