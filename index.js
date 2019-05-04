//******************************************************
// Author: O. Rey
// email: rey.olivier@gmail.com
// Date: March 14 2019
// Main entry point
// License: Apache 2
// *****************************************************
'use strict';

const express = require('express');
const http    = require('http');

var rdfjs   = require('./rdfjs.js');
var fuzeki  = require('./database/fuseki-wrapper');
var nb      = require('./neighborhood.js');
var queries = require('./queries.js');

//--------------------------------------------------- 
// Defining Fuseki server parameters
//--------------------------------------------------- 
const DB_ADDRESS = '127.0.0.1';
const DB_PORT = 3030;

const SERVER_PORT = 3000;

//--------------------------------------------------- 
// Utilities
//--------------------------------------------------- 
 /**
 * This functions turns URI into HTML URI
 * @param {*} str: the string to treat
 */
function htmlEscape(str) {
    return String(str)
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}


//--------------------------------------------------- 
// Test a simple query on the database
//--------------------------------------------------- 
function test01(fuz){
    var resp = fuz.query(queries.HarryPotter01.dataset,
			 queries.HarryPotter01.query);
    
    // getting the result
    console.log('----------------test01 begin--------------------');
    console.log(new Date().toLocaleString());
    console.log(resp);
    console.log('----------------test01 end --------------------');
    var arr = resp.results.bindings;
    var st = "";
    for (var e of arr)
        st += e;
    console.log(st);

    return "<h1>Test1</h1><p>" + htmlEscape(st) + "</p>";
}

//--------------------------------------------------- 
// Test on neighborhood 1
//--------------------------------------------------- 
function test02(fuz){
    var t1 = new nb.Neighborhood(
	"books",
	new rdfjs.Literal(
	    "J.K. Rowling",
            new rdfjs.NamedNode(
		"http://www.w3.org/1999/02/22-rdf-syntax-ns#langString")));
    t1.getNeighborhood(fuz);
    return "<h1>Test 2</h1><pre>" + htmlEscape(t1.to_str()) + "</pre>";
}

//--------------------------------------------------- 
// Test on neighborhood 2
//--------------------------------------------------- 
function test03(fuz){
    var t2 = new nb.Neighborhood(
	"books",
	new rdfjs.NamedNode("http://example.org/book/book2"));
    t2.getNeighborhood(fuz);
    return "<h1>Test 3</h1><pre>" + htmlEscape(t2.to_str()) + "</pre>";
}

//--------------------------------------------------- 
// Test on neighborhood 3
//--------------------------------------------------- 
function test04(fuz){
    var t1 = new nb.Neighborhood(
	"CI_CATALOG",
	new rdfjs.NamedNode("https://www.airbus.com/h175/CI#A_M720A2202053"));
    t1.getNeighborhood(fuz);
    return "<h1>Test 4</h1><pre>" + htmlEscape(t1.to_str()) + "</pre>";
}




//--------------------------------------------------- 
// HTTP server
//--------------------------------------------------- 
function RequestHandler(req, res) {
    try {
	// Init the server
	let fuz = new fuzeki.FusekiWrapper("http://" + DB_ADDRESS, DB_PORT);

	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');

	var response = "<html><title>Tests Ontovisu</title><body>";

	response += "<p>" + new Date().toLocaleString() + "</p>";
	
	// Test1
	response += test01(fuz);

	// Test 2
	response += test02(fuz);

	// Test 3
	response += test03(fuz);

	// Test 4
	response += test04(fuz);

    	res.write(response);
	res.end("<p>End</p></body></html>");
    }
    catch(error) {
	console.log(error);
	res.write("<html><title>Tests Ontovisu</title><body>" +
		  "<h1>Failed test</h1><p>Sorry guy!</p>");

	res.end("</body></html>");
    }
}

var app = express();

app.use(RequestHandler);


const server = http.createServer(app);

server.listen(SERVER_PORT);
console.log('================ONTOVISU================');
console.log('Server running at http://127.0.0.1:' + SERVER_PORT);

