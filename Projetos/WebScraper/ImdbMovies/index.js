const express = require('express');
// importação do módulo express

const scraper = require('./scraper');
// importação do script scraper

const cors = require('cors');
// importação do cors - Access-Control-Allow-Origin

const app = express();
// execusão do express encapsulado na variável app

const port = process.env.PORT || 3000;
// declaração de porta

app.use(cors());
// middleware - Access-Control-Allow-Origin

app.get('/', (req, res)=>{
// rota para raiz da pagina
    res.json({
        message:'Scraping is fun!'
    });
});

app.get('/search/:title', (req, res)=>{
// rota para procurar filmes

    scraper.searchMovies(req.params.title).then(movies =>{
    // recupera uma lista com base na pesquisa informada
    
        res.json(movies);
    });
});

app.get('/movie/:imdbID', (req, res)=>{
// rota para procurar filmes

    scraper.getMovie(req.params.imdbID).then(movie =>{
    // recupera uma lista com base na pesquisa informada

        res.json(movie);
        // retorna json para front end
    });
});

app.listen(port, () =>{
// servidor ouvindo a porta 

    console.log(`Listening on ${port}`);
    // imprimindo mensagem de listening 
});
