const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let url = 'https://www.comandotorrents.com/';

function getDetails(){
    return new Promise((resolve, reject)=>{
        let results = [];

        request(url, (err, res, body)=>{
            if(err) console.log({'error': err});
    
            let $ = cheerio.load(body);
    
            $('article').each(function(){
                let details = $(this).find('.entry-content p').text().trim();
                results.push(details);
            });
            resolve(results);
        });
    }).catch(err =>{
        reject(err);
    });
}
function getTitle(){
    return new Promise((resolve, reject)=>{
        let results = [];
        request(url, (err, res, body)=>{
            if(err) console.log({'error': err});
            let $ = cheerio.load(body);
            $('article header').each(function(){
                let title = $(this).find('h2 a').text().trim();
                let data = {'title': title};
                results.push(data);
            });
            resolve(results);
        });
    }).catch(err =>{
        reject(err);
    });
}

function getImage(){
    return new Promise((resolve, reject)=>{
        let results = [];

        request(url, (err, res, body)=>{
            if(err) console.log({'erro': err});
        
            let $ = cheerio.load(body);
            $('article').each(function(){
                let tags = ['div img' , 'p strong span img', 'h2 img', 'p span strong img'];
        
                if($(this).find(`.entry-content ${tags[0]}`).attr('src') != undefined){
                    let img = $(this).find(`.entry-content ${tags[0]}`).attr('src');
                    let width = $(this).find(`.entry-content ${tags[0]}`).attr('width');
                    let alt = $(this).find(`.entry-content ${tags[0]}`).attr('alt');
                    let height = $(this).find(`.entry-content ${tags[0]}`).attr('height');
        
                    let data = {'image': {'url': img,'width': width,'height': height,'alt':alt}}
                 
                    results.push(data);
                }else if($(this).find(`.entry-content ${tags[1]}`).attr('src') != undefined){
                    let img = $(this).find(`.entry-content ${tags[1]}`).attr('src');
                    let width = $(this).find(`.entry-content ${tags[1]}`).attr('width');
                    let alt = $(this).find(`.entry-content ${tags[1]}`).attr('alt');
                    let height = $(this).find(`.entry-content ${tags[1]}`).attr('height');
        
                    let data = {'image': {'url': img,'width': width,'height': height,'alt':alt}}
        
                    results.push(data);
                }else if($(this).find(`.entry-content ${tags[2]}`).attr('src') != undefined){
                    let img = $(this).find(`.entry-content ${tags[2]}`).attr('src');
                    let width = $(this).find(`.entry-content ${tags[2]}`).attr('width');
                    let alt = $(this).find(`.entry-content ${tags[2]}`).attr('alt');
                    let height = $(this).find(`.entry-content ${tags[2]}`).attr('height');
        
                    let data = {'image': {'url': img,'width': width,'height': height,'alt':alt}}
        
                    results.push(data);
                }else if($(this).find(`.entry-content ${tags[3]}`).attr('src') != undefined){
                    let img = $(this).find(`.entry-content ${tags[3]}`).attr('src');
                    let width = $(this).find(`.entry-content ${tags[3]}`).attr('width');
                    let alt = $(this).find(`.entry-content ${tags[3]}`).attr('alt');
                    let height = $(this).find(`.entry-content ${tags[3]}`).attr('height');
        
                    let data = {'image': {'url': img,'width': width,'height': height,'alt':alt}}
        
                    results.push(data);
                }
            });
            resolve(results);
        });
    }).catch(err =>{
        reject(err);
    });
}

getImage().then(res =>{
    console.log(res);
});