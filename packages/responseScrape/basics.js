const request = require("request-promise");
// build in module to file safe
const fs = require("fs");
const cheerio = require("cheerio");


async function main() {

    const html = await request.get(
        "https://apemendelights.com"
    );

    fs.writeFileSync("./index.html", html);
    const $ = await cheerio.load(html);
    
    /* single element by emantic element
    const someHeader = $("h1").text();
    console.log(someHeader);
    */

    $("h2").each((index, element) => {
        console.log($(element).text());
    });

    /* single element by id
    const someHeader = $("#red").text();
    console.log(someHeader);
    */

   $("#red").each((index, element) => {
    console.log($(element).text());
    });
    
    /* single element by class
    const someHeader = $("#.red").text();
    console.log(someHeader);
    */
    
    $(".blue").each((index, element) => {
    console.log($(element).text());
    });


        /* single element by attribute
    const someHeader = $('[data-element]').text();
    console.log(someHeader);
    */

    $('[data-element]').each((index, element) => {
        console.log($(element).text());
        });
}

main(); 