/******************************************************
 * Author: O. Rey
 * email: rey.olivier@gmail.com
 * Date: March 14 2019
 * Main entry point
 * License: Apache 2
 ******************************************************/
'use strict';
const http = require('http');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var fuzeki = require('./fuseki-wrapper');

// Defining server parameters
const hostname = '127.0.0.1';
const port = 3000;


const server = http.createServer((req, res) => {
    var query = 'PREFIX dc: <http://purl.org/dc/elements/1.1/>\nSELECT ?a ?b \nWHERE { ?a dc:creator "J.K. Rowling" .\n?a dc:title ?b\n}'

    let fuz = new fuzeki.FusekiWrapper("http://localhost", 3030);
    var result = fuz.query("books", query);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Look at the logs\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

