const request = require('request');
const cheerio = require('cheerio');
const urlParse = require('url-parse');
const fs = require('fs');

const START_URL = "https://g1.globo.com/";
const SEARCH_WORD = [
    'email',
    'noticia',
    'crimes',
    'sexo',
    'senha',
    'news'
];
const MAX_PAGE_VISITED = 500;

let pagesVisited = {};
let numPagesVisited = 0;
let pagesToVisit = [];

let url = new urlParse(START_URL);
let baseUrl = url.protocol + '//' + url.hostname;

pagesToVisit.push(START_URL);
crawl();

function crawl(){
    if(numPagesVisited >= MAX_PAGE_VISITED){
        console.log('limite de páginas alcançado!');
        return;
    }
    let nextPage = pagesToVisit.pop();
    if(nextPage in pagesVisited){
        console.log('nós já fizemos parse desta página, repetindo crawler...');
        crawl();
    }else{
        console.log('nova página para fazer parsing');
        visitedPage(nextPage, crawl);
    }
}
function visitedPage(url, callback){
    console.log('adicionando página para fazer parsing....');
    pagesVisited[url] = true;
    numPagesVisited++;

    console.log('fazendo requisição da página ' + url);
    request(url, function(err, res, body){
        console.log('verificando status code...' + res.statusCode);
        if(res.statusCode !== 200){
            console.log('status code inválido, encerrando o parsing....');
            callback();
            return;
        }
        console.log('fazendo parsing do (document body) na url: ' + url);
        let $ = cheerio.load(body);
        console.log('realizando sua pesquisa, procurando.....');
        let isWordFound = searchWords($, SEARCH_WORD);
        if(isWordFound){
            console.log('busca finalizada, ' + SEARCH_WORD + ' foi achada em ' + url);
            console.log('vamos trabalhar um pouco mais aqui');
            let range = [];
            range.push(SEARCH_WORD);
            deepSearch(range);
        }else{
            collectInternalLinks($);
            console.log('busca finalizada, não achamos sua pesquisa, fazendo uma tentativa');
            callback();
        }
    });
}
function searchWords($, word){
    let bodyText = $('html > body').text().toLowerCase();
    return (bodyText.indexOf(word) !== -1);
}
function collectInternalLinks($){
    let relativeLinks = $("a[href^='/']");
    console.log(relativeLinks.length + ' links na página');
    relativeLinks.each(function(){
        pagesToVisit.push(baseUrl + $(this).attr('href'));
    });
}
function deepSearch(url){
    let range = [];
    if(typeof url === 'object'  && url.length > 0){
        console.log(typeof url);
    }else{
        console.log('procurando dentro da pagina...')
        request(url, (err, res, body)=>{
            if(err) console.log(err);
            let $ = cheerio.load(body);
            let corpo = $('body').text().trim();
            console.log(corpo);
        });
    }
}