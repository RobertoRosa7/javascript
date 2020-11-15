const form = document.querySelector('form');
// selecionando elemento formulário

const searchInput = document.querySelector('input');
// selecionando elemento de entrada de texto

const BASE_URL = 'http://localhost:3000';
// url do servidor API

const resultList = document.querySelector('#results');
// lista dos resultado da pesquisa

form.addEventListener('submit', function(event){
// adicionando evento de submit no formulário e executando callaback 

    event.preventDefault();
    // bloqueando evento padrão do submit

    let searchTerm = searchInput.value;
    // recuperando valor do campo de texto

    getSearchResults(searchTerm).then(showResults);
    // chamada da função para fazer pesquisa
});

function getSearchResults(searchTerm){
// função para pesquisar com base na entrada de texto

    return fetch(`${BASE_URL}/search/${searchTerm}`).then(res => res.json());
}

function showResults(results){
// função para mostrar os resultados da pesquisa

    results.forEach(movie =>{
        console.log(movie);
        let li = document.createElement('li');
        let img = document.createElement('img');
        let a = document.createElement('a');
        li.appendChild(img);
        img.src = movie.image;
        a.innerHTML = movie.title;
        a.href = '/movie.html?imdbID=' + movie.imdbID;
        li.appendChild(a);
        resultList.appendChild(li);
    });
}