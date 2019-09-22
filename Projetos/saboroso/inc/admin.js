var conn = require('./db');
module.exports = {
    // conexão com banco de dados e consulta
    dashboard(){
      return new Promise((resolve, reject)=>{
        conn.query(`
            SELECT (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
            (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
            (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
            (SELECT COUNT(*) FROM tb_users) AS nrusers;
          `,(err,result) =>{
            (err) ? reject(err) : resolve(result[0]);
          });
      });
    },
    // concatenação de objetos para um novo objeto vazio
    getParams(req, params){
        return Object.assign({},{menus:req.menus, user:req.session.user},params);
    },
    // menu admin dinâmico
    getMenus(req){
        let menus = [
            {
                text:'Tela Inicial',
                href: '/admin/',
                icon:'home',
                active:false
            },
            {
                text:'Menus',
                href: '/admin/menus',
                icon:'cutlery',
                active:false
            },
            {
                text:'Reservas',
                href: '/admin/reservations',
                icon:'calendar-check-o',
                active:false
            },
            {
                text:'Contatos',
                href: '/admin/contacts',
                icon:'comments',
                active:false
            },
            {
                text:'Usuários',
                href: '/admin/users',
                icon:'comments',
                active:false
            },
            {
                text:'E-mails',
                href: '/admin/emails',
                icon:'envelope',
                active:false
            }
        ];
        // map() = mapea todo Array e substitui o valor na posição
        menus.map(menu =>{
            if(menu.href === `/admin${req.url}`) menu.active = true;
            //console.log(req.url,menu.href);
        });
        return menus;
    }
};
