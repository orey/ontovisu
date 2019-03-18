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

//const N3 = require('n3');
//const { DataFactory } = N3;
//const { namedNode, blankNode, literal, defaultGraph, quad } = DataFactory;


var fuzeki = require('./fuseki-wrapper');
var rdfjs = require('./rdfjs.js');
var nb = require('./neighborhood.js');


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
    res.setHeader('Content-Type', 'text/plain');
    //res.end
    res.write("======\nTest 1\n======\n" +
	      t1.to_str() +
	      "======\nTest 2\n======\n" +
	      t2.to_str() +
	      "======================");
	      
    res.end("End");
    
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

