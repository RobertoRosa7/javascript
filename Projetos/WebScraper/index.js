const fs = require('fs');

const fetch = require('node-fetch');

const cheerio = require('cheerio');

const db = require('./db');

const restaurants = [];

let delay = milliseconds =>{
// function para criar um tempo de espera para cada inserção de documento

    return new Promise( ( resolve, reject ) =>{
    // retorna uma promessa se der certo a inserção do timeout

        setTimeout( resolve, milliseconds);

    });
}

let getResutaurants = async (state, city) =>{
// método para pegar a lista de restaurante de forma assincrona
    
    let promises = [];

    let url = `https://www.allmenus.com/${state.toLowerCase()}/${city.toLowerCase()}/-/`;
    // endereço web para busa de restaurantes 

    let response = await fetch(url);
    // receber dados quando estiver pronto

    let body = await response.text();
    // receber os dados 

    let $ = cheerio.load(body);
    // passando todo documento para cheerio

    // let restaurants = [];
    // armazenar lista de restaurantes

    $('.restaurant-list-item').each((i, el) =>{
    // percorrer a lsta de resutaurante

        let header = $(el).find('h4.name');
        // extract title

        let name = header.text();
        // extract name 
        
        let anchor = $(header).find('a');
        // extraindo link

        let link = anchor.attr('href');
        // extract link

        let id = anchor.attr('data-masterlist-id');
        // extraindo id

        let address = [];
        // armazenar lista de endereços

        $(el).find('div.address-container .address').each((i, part) =>{
        // percorrer cada endereço

            address.push($(part).text().trim());
            // adicionar cada endereço na lista
        });

        let cousines = $(el).find('p.cousine-list').text().trim().split( ', ' );
        // extraindo categorias de restaurantes

        let grubhub = $( el ).find( 'div.grubhub-button a' ).attr( 'href' );
        // extraindo grubhub para redirecionameto dos restaurantes

        let restaurant = {
        // criando objeto literal para os resultados extraídos

            id, name, address: address.join( '\n' ), cousines, link, city, state
        }

        if( grubhub ){ restaurant.grubhub = grubhub; }
        // extraindo links para resutaurante se existir

        // restaurants.push(restaurant);
        // adicionar cada nome na lista

        const newRestaurantRef = db.collection( 'restaurants' ).doc( id) ;
        // recebendo a referência para salvar itens no documento - caminho

        promises.push( newRestaurantRef.set( restaurant ) );
        // salvando dados no firestore

        restaurants.push( restaurant );
        // adicionando os restaurante em uma lista

    });

    for( let item of restaurants ){
    // percorrer cada restaurant na lista

        await getMenu( item.id, item.link );
        // executando função para acessar menu

        await delay( 1000 );
        // esperar 3min para repetir o laço 
    }
    await Promise.all( promises );
    // esperando a promessa armazenar registros no firebase

    console.log( 'Done .:)' );
};

getResutaurants('ny', 'new-york');

let getMenu = async ( id, link ) =>{
// pegar restaurante do bando de dados firebase

    // let docRef = db.collection('restaurants').doc(id);
    // // recuperar o caminho para documento

    // let doc = await docRef.get();
    // // trazer o documento

    // let restaurant = doc.data();
    // recebendo os dados

    let url = `https://allmenus.com${ link }`;

    let response = await fetch( url );

    let body = await response.text();

    let $ = cheerio.load( body, { decodeEntities: true, xmlMode: false } );

    let rawJSON = $( $( 'script[ type="application/ld+json" ]' )[0] ).html().replace(/\n/g, '');
    // selecionando javascript para extração de dados e removendo breakline
    
    // fs.appendFile('./menu.json', rawJSON, err =>{ if(err) throw err; });
    // criar um arquivo json para debug

    let data = JSON.parse( rawJSON );

    if( data.hasMenu && data.hasMenu.length > 0 ){
    // se achar menu para site e se for maior que zero

        let promises = [];

        data.hasMenu.forEach( menu => {
        // percorrer cada menu encontrado para extrair os restaurante do menu

            if( menu.hasMenuSection && menu.hasMenuSection.length > 0 ){
            // percorrer cada sesssão encontrada no menu de sessão para extrair sessões

                menu.hasMenuSection.forEach( section => {
                // percorrecer cada sessão encontrada no menu

                    if( section.hasMenuItem && section.hasMenuItem.length > 0 ){
                    // percorrer cada item da sessão de menu

                        section.hasMenuItem.forEach( item => {
                        // percoorer cada item
                            
                            item.restaurant_id = id;

                            item.menu_name = item.name;

                            item.menu_section_name = section.name;

                            item.geo = data.geo;

                            promises.push( db.collection( 'menu_items' ).add( item ) );
                            // adicionando menu no banco de dados 

                            // console.log(item);
                            // debug
                        });
                    }
                });
            }        
        });

        await Promise.all( promises );
        // resolvendo a promessa adicionando objeto no bando de dados

        console.log( 'done :) menu foi adicionado!!', id, link );

    } else {
    // se não achar nehum menu para site

        console.log( 'Nenhum menu encontrado: ', id, link );
    }

    // console.log( data );
    // debug
}

// getMenu( '141126' , '/ny/new-york/141126-cc-s-cafe/menu/' );