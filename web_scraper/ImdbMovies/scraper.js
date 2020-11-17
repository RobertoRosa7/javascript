const fetch = require('node-fetch');
// importação do módulo fetch para requisições http

const cheerio = require('cheerio');
// importação do módulo cheerio para scraping html

const baseUrl = 'https://www.imdb.com';
// url padrão official

const searchUrl = 'https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=';
// searchUrl que será alvo de requisições de busca dos filmes

const movieUrl = 'https://www.imdb.com/title/';
// movieURL que será alvo de requisição de busca por id

const searchCache = {};
// cache de pesquisa

const movieCache = {};
// cache de filmes

function searchMovies(searchTerms){
// função para buscar filmes

    if(searchCache[searchTerms]){
    // se existir cache da busca
    
        console.log('Serving from cache: ', searchTerms);
        return Promise.resolve(searchCache[searchTerms]);
        // retorna o resulta na promesa para poder sair deste escopo
    }

    return fetch(`${searchUrl}${searchTerms}`)
    // faz a requisição e retorna os dados encontrados

        .then(response => response.text())
        // envia os dados para texto

        .then(body => {
            // recebe os dados no body
        
                let movies = [];
                // array para armazenar a lista recuperada do site
        
                const $ = cheerio.load(body);
                // como se fosse uma instancia de toda a página dentro do cifrão
        
                $('.findResult').each(function(i, element){
                // percorrer todos os elementos encontrados nesta classe 
                    
                    let $element = $(element);
                    // recuperando cada elemento dentro da lista que contem a classe
        
                    let $image = $($element.find('td a img'));
                    // recupera a imagem 
        
                    let $title = $($element.find('td.result_text a'));
                    // recupera o titulo da imagem
                    
                    let imdbID = $title.attr('href').match(/title\/(.*)\//)[1];
                    // recuperando id de cada elemento

                    let movie = {
                    // criando um novo objeto com os dados recebidos
        
                        image: $image.attr('src'),
                        title: $title.text(),
                        imdbID
                    }
                    movies.push(movie);
                    // adicionando cada novo objeto no array de movies
        
                   searchCache[searchTerms] = movies;
                   // cache para busca de filmes

                });
                return movies;
            });
}

function getMovie(imdbID){
// função para recuperar um filme pelo id e trazer detalhes

    if(movieCache[imdbID]){
    // se existir filmes em case

        console.log('Serving from cache: ', imdbID);
        return Promise.resolve(movieCache[imdbID]);
        // resolve a promessa trazendo os dados em case
    }
    return fetch(`${movieUrl}${imdbID}`)
    // faz a requisição e retorna os dados encontrados

        .then(response => response.text())
        // recupera dados vindo da requisição

        .then(body =>{
        // recupera dados do documento da página

            let $ = cheerio.load(body);
            // recebe o documento para cifrão

            let $title = $('.title_wrapper h1');
            // traz o titulo da página principal

            let title = $title.first().contents().filter(function(){ return this.type === 'text';}).text().trim();
            // realiza um filtro para trazer somente o primeiro texto

            let rating = $('div.ratingValue strong span').text().trim();
            // traz o raking

            let runTime = $('div.subtext time[datetime="PT135M"]').text().trim();
            // traz o tempo de duração do filme

            let genres = [];
            // guarda o genero dos filmes

            $('div.subtext a').each(function(i, element){
            // percorre os genero para coloar em uma lista

                let genre = $(element).text().trim();
                // recupera somente textos

                genres.push(genre);
                // adiciona cada texto em um array
            });

            let datePublished = $('div.subtext a[title="See more release dates"]').text().trim();
            // extraindo data da publicação

            let poster = $('div.poster a img').attr('src');
            // extraindo link do poster imagem miniatura

            let summary = $('.summary_text').text().trim();
            // extraindo resumo

            let directors = $('.credit_summary_item').first().text().trim().replace('Director:\n', '').replace('    ','');
            // filtro para extrair dados do diretores

            let writers = $('.credit_summary_item').eq(1).text().trim().replace('Writers:\n', '').replace(' ','');
            // filtro para extrair dados de escritores

            let stars = $('.credit_summary_item').last().text().trim().replace('Stars:\n', '').replace('    ','');
            // filtro para extrair dados de atores

            let storyLine = $('.inline p span').text().trim();
            // extraindo descrição básica do filme

            let links = [];
            // var para guarda lista de links para companhia

            $('#titleDetails div.txt-block a').each(function(i, element){
            // selecionando todos os links

                let item = $(element).text().trim();
                // recebendo cada link

                links.push(item);
                // adicionando em uma liista
            });

            let companies = [
            // filtrando somente os links da companhia

                links[7], links[8], links[9]
            ]

            let trailer = $('.slate a').attr('href');
            // link para trailer
           
            movie = {
            // retorna um objeto literal

                imdbID, title, rating, runTime, genres, datePublished, poster, summary, directors,
                writers, stars, storyLine, companies, trailer: `${baseUrl}${trailer}`, baseUrl,
                // variáveis para construção de um objeot literal que será enviado na promessa
            };

            movieCache[imdbID] = movie;
            // recebendo objeto com dados prontos para cache

            return movie;
            // retorna um objeto literal pronto

        });
}

module.exports = {
// exportando como módulo

    searchMovies,
    // exportando método para ser carregado no index como módulo

    getMovie,
    // exportando método para ser carregado no index como módulo
};