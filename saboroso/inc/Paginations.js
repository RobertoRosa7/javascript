let conn = require('./db');

class Pagination{
    // contrutor com parâmetro SQL e número de página padrão
    constructor(query, params = [], itemsPage = 10){
        // executar query do SQL
        this.query = query;
       
        // executar parâmetros para execução das queries
        this.params = params;
       
        // define número de páginas padrão
        this.itemsPage = itemsPage;
        
        // define a página atual como base para calculo
        this.currentPage = 1;

    }
   
    // método para visualização de páginas
    viewPage(page){
        // página atual menos 1 devido ao banco de dados iniciar em zero
        this.currentPage = page - 1;
        
        // adicionar resulta do calculo como parâmetro para query e definir limite
        this.params.push(this.currentPage * this.itemsPage, this.itemsPage);
       
        // retonar promessa
        return new Promise((resolve, reject)=>{
            // multi query no comando SQL com coluna virtual como Alias
            conn.query([this.query, 'SELECT FOUND_ROWS() AS FOUND_ROWS'].join(';'),this.params,(err, result)=>{
                if(err){
                    reject(err)
                }else{
                    // primeiro dados da consulta
                    this.data = result[0];
                  
                    // total de registro da segunda consulta 
                    this.total = result[1][0].FOUND_ROWS;
                  
                    // total de páginas 
                    this.totalPages = this.total / this.itemsPage;
                  
                    // atualizando a página atual
                    this.currentPage++;
                  
                    // resolvendo a promessa
                    resolve(this.data);
                } 
            });
        });
    }

    // total de registros
    getTotal(){
        return this.total;
    }

    // página atual
    getCurrentPage(){
        return this.currentPage;
    }

    // total de páginas
    getTotalPages(){
        return this.totalPages;
    }

    // navegação das páginas de acordo com a página atual
    getNavigation(params){
        // define o limite de página na visualização
        let limitPagesNav = 5;
       
        // define os links para navegação
        let links = [];
       
        // define o início 
        let nrstart = 0;
       
        // define o fim
        let nrend = 0;
      
        // verifica se o total de páginas é menor que o limite de página
        if(this.getTotalPages() < limitPagesNav) limitPagesNav = this.getTotalPages();

        // se estivermos nas primeiras páginas
        if((this.getCurrentPage() - parseInt(limitPagesNav / 2)) < 1 ){
            nrstart = 1;
            nrend = limitPagesNav;
        }
        // Estamos chegando nas últimas páginas
        else if((this.getCurrentPage() + parseInt(limitPagesNav / 2 )) > this.getTotalPages){
            nrstart = this.getTotalPages() - limitPagesNav;
            nrend = this.getTotalPages();
        }else{
            nrstart = this.getCurrentPage() - parseInt(limitPagesNav / 2);
            nrend = this.getCurrentPage() + parseInt(limitPagesNav / 2);
        }
        // página anterior
        if(this.getCurrentPage() > 1){
            links.push({
                text: '<<',
                href: '?' + this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage() - 1}))
            });
        }
        // percorrendo cada resulta e adicionando links mais páginas
        for(let x = nrstart; x <= nrend; x++){
            links.push({
                text: x,
                href: '?' + this.getQueryString(Object.assign({}, params, {page:x})),
                active: (x === this.getCurrentPage())
            });
        }

        // página seguinte
        if(this.getCurrentPage() < this.getTotalPages()){
            links.push({
                text:'>>',
                href: '?' + this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage() + 1}))
            });
        }

        // retorna os links
        return links;
    }
    getQueryString(params){
        let queryString = [];
        for(let name in params){
            queryString.push(`${name}=${params[name]}`);
        }
        return queryString.join('&');
    }
}
module.exports = Pagination;