/******************************************************
 * Author: O. Rey
 * email: rey.olivier@gmail.com
 * Date: March 14 2019
 * Main entry point
 * License: Apache 2
 ******************************************************/
'use strict';

const http = require('http');
//const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var fuzeki = require('./fuseki-wrapper');
var rdfjs = require('./rdfjs.js');
var nb = require('./neighborhood.js');

function htmlEscape(str) {
    return String(str)
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

// Defining server parameters
const hostname = '127.0.0.1';
const port = 3000;


const server = http.createServer((req, res) => {
    var query = 'PREFIX dc: <http://purl.org/dc/elements/1.1/>\nSELECT ?a ?b \nWHERE { ?a dc:creator "J.K. Rowling" .\n?a dc:title ?b\n}'

    let fuz = new fuzeki.FusekiWrapper("http://localhost", 3030);
    fuz.query("books", query);
    var result = fuz.getResult();
    console.log(result);
    var arr = result.results.bindings;
    for (var e of arr) console.log(e);

    var t1 = new nb.Neighborhood("books",
				 new rdfjs.Literal("J.K. Rowling",
						   new rdfjs.NamedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#langString")));
    t1.getNeighborhood(fuz);

    var t2 = new nb.Neighborhood("books", new rdfjs.NamedNode("http://example.org/book/book2"));
    t2.getNeighborhood(fuz);
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    //res.end
    res.write("<html><title>Tests Ontovisu</title><body>" +
	      "<h1>Test 1</h1><pre>" +
	      htmlEscape(t1.to_str()) + "</pre>" +
	      "<h1>Test 2</h1><pre>" +
	      htmlEscape(t2.to_str()) + "</pre>");
    res.end("<p>End</p></body></html>");
    
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

