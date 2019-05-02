/******************************************************
 * Author: O. Rey
 * email: rey.olivier@gmail.com
 * Date: March 14 2019
 * Main entry point
 * License: Apache 2
 ******************************************************/
'use strict';

const http = require('http');

var rdfjs = require('./rdfjs.js');
var fuzeki = require('./database/fuseki-wrapper');
var nb = require('./neighborhood.js');

/*--------------------------------------------------- 
 * Defining Fuseki server parameters
 --------------------------------------------------- */
const hostname = '127.0.0.1';
const port = 3000;

/*--------------------------------------------------- 
 * Utilities
 --------------------------------------------------- */
 /**
 * This functions turns URI into HTML URI
 * @param {*} str: the string to treat
 */
function htmlEscape(str) {
    return String(str)
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

/*--------------------------------------------------- 
 * HTTP server
 --------------------------------------------------- */
const test_query1 = 'PREFIX dc: <http://purl.org/dc/elements/1.1/>\nSELECT ?a ?b \n' +
              'WHERE { ?a dc:creator "J.K. Rowling" .\n?a dc:title ?b\n}'

 const server = http.createServer((req, res) => {
    // Init the server
    let fuz = new fuzeki.FusekiWrapper("http://localhost", 3030);

    // Test 1: console test
    // running the query
    var resp = fuz.query("books", test_query1);
    
    // getting the result
    console.log(resp);
    
    var arr = resp.results.bindings;
    var st = "";
    for (var e of arr)
        st += e;
    console.log(st);

    // Test 2
    var t1 = new nb.Neighborhood("books",
				 new rdfjs.Literal("J.K. Rowling",
						   new rdfjs.NamedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#langString")));
    t1.getNeighborhood(fuz);

    // Test 3
    var t2 = new nb.Neighborhood("books", new rdfjs.NamedNode("http://example.org/book/book2"));
    t2.getNeighborhood(fuz);
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    //res.end
    res.write("<html><title>Tests Ontovisu</title><body>" +
              "<h1>Test 1</h1><pre>" + st + "</pre>" +
              "<h1>Test 2</h1><pre>" +
	          htmlEscape(t1.to_str()) + "</pre>" +
	          "<h1>Test 3</h1><pre>" +
              htmlEscape(t2.to_str()) + "</pre>");

    res.end("<p>End</p></body></html>");
    });

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
});

