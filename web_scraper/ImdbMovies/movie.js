const main = document.querySelector('main');
// selector do elemento main

const imdbID = window.location.search.match(/imdbID=(.*)/)[1];
// recuperando id quando for clicado no link

const BASE_URL = 'http://localhost:3000';
// endereço do servidor API

function getMovie(imdbID){
// função para pegar filme com id 

    return fetch(`${BASE_URL}/movie/${imdbID}`).then(res => res.json());
    // retorna um json
}
function showMovie(movie){
// imprime informações do filme com detalhes

    const section = document.createElement('section');
    // criando novo elemento no DOM

    main.appendChild(section);
    // adicionando elemento section como filho de main

    let properties = [
    // propriedades para renderização na página, mostrar texto dinamicamente

        { title: 'Avaliação',  property: 'rating' },
        { title: 'Duração', property:'runTime' }, 
        { title: 'Data da publicação', property: 'datePublished' },
        { title: 'Synopsis', property: 'summary' },
        { title: 'Descrição', property: 'storyLine' }
    ];

    let descriptionHtml = properties.reduce((html, property) =>{
    // fazendo html dinâmico para impressão dos textos

        html += `
            <dt class="col-sm-3">${property.title}</dt>
            <dd class="col-sm-9 text-justify">${movie[property.property]}</dd>
        `;
        // renderização dinâmica para página

        return html;
        // retorna html para impressão na página

    }, '');

    section.outerHTML = `
        <h1 class="">${movie.title}</h1>

        <section class="row">
            <div class="col-md-5">
                <img src="${movie.poster}" width="300" class="image-responsive" />
            </div>
            <div class="col-md-7">
                <dl class="row">
                    ${descriptionHtml}
                </dl>
            </div>
        </section>
    `;
}
getMovie(imdbID).then(showMovie);
// pega id retorna uma promesa com dados do filme