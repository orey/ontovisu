/*-----------------------------------------------------
Author: O. Rey
email: rey.olivier@gmail.com
Date: March 16 2019
Neighborhood request calculation
License: Apache 2
-------------------------------------------------------
Interesting pages:
* http://rdf.js.org/
------------------------------------------------------*/

'use strict';

//const N3 = require('n3');
//const { DataFactory } = N3;
//const { namedNode, blankNode, literal, defaultGraph, quad} = DataFactory;

const rdfjs = require('./rdfjs');

/*-----------------------------------------------------
Global variables
------------------------------------------------------*/

// Define a list of common prefixes
const REQ_PREFIXES = {
    rdf   : 'PREFIX rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
    rdfs  : 'PREFIX rdfs:   <http://www.w3.org/2000/01/rdf-schema#>',
    dc    : 'PREFIX dc:     <http://purl.org/dc/elements/1.1/>',
    vcard : 'PREFIX vcard:  <http://www.w3.org/2001/vcard-rdf/3.0#>'}


let PREFIXES = {
    rdf   : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs  : 'http://www.w3.org/2000/01/rdf-schema#',
    dc    : 'http://purl.org/dc/elements/1.1/',
    vcard : 'http://www.w3.org/2001/vcard-rdf/3.0#'}

function define_prefix(key, value) {
    PREFIXES[key] = value;
}

/*-----------------------------------------------------
Class Neighborhodd
------------------------------------------------------*/


/*
SELECT ?s ?p
WHERE { ?s ?p "J.K. Rowling" .}
*/

/*
This class supports the following types for the root node:
* Literal
* NamedNode
* BlankNode
* Members: node, graph, both, neighbors
*/
class Neighborhood {
    constructor(graph, node) {	
	this.graph = graph;
	this.node = node;
	this.neighbors = []; // List of quads
	if (node.constructor.name == "Literal") {
	    this.both = false;
	    return;
	}
	// This test is to be forced to manage progessively the variety of types
	if ((node.constructor.name != "NamedNode") &&
	    (node.constructor.name != "BlankNode"))
	    throw new Error("Unknown type of node: " + node.constructor.name)
	this.both = true;
    }

    queryTo() {
	return "SELECT ?s ?p  WHERE { ?s ?p " + this.node.to_str() + " .}";
    }

    /*{ head: { vars: [ 'a', 'b' ] },
      results: { bindings: [ [Object], [Object], [Object], [Object] ] } }*/
    parseQueryTo(result){
	//get the array of results
	if (result == null) return;
	var arr = result.results.bindings;
	for (var e of arr) {
	    // Build a quad from results
	    /*{ s: { type: 'uri', value: 'http://example.org/book/book7' },
	      p: { type: 'literal',  value: 'Harry' } }*/
	    var subject, predicate;
	    if (e.s.type == 'uri')
		subject = new rdfjs.NamedNode(e.s.value);
	    else if (e.s.type == 'bnode')
		subject = new rdfjs.BlankNode(e.s.value);
	    else
		throw new Error("Unknown type of subject: " + e.s.type);
	    if (e.p.type == 'uri')
		predicate  = new rdfjs.NamedNode(e.p.value);
	    else
		throw new Error("Unknown type of predicate: " + e.p.type);
	    this.neighbors.push(new rdfjs.Quad(subject,
				     predicate,
				     this.node,
				     new rdfjs.DefaultGraph(this.graph)));
	}
    }

    queryFrom(){
	return "SELECT ?p ?o  WHERE { " + this.node.to_str() + " ?p ?o .}";
    }

    parseQueryFrom(result) {
	if (result == null) return;
	var arr = result.results.bindings;
	for (var e of arr) {
	    var predicate, object;
	    if (e.p.type == 'uri')
		predicate = new rdfjs.NamedNode(e.p.value);
	    else
		throw new Error("Unknown type of predicate: " + e.p.type);
	    if (e.o.type == 'uri')
		object = new rdfjs.NamedNode(e.o.value);
	    else if (e.o.type == "literal")
		object = new rdfjs.Literal(e.o.value);
	    else if (e.o.type == 'bnode')
		object = new rdfjs.BlankNode(e.o.value);
	    else
		throw new Error("Unknown type of object: " + e.o.type);
	    this.neighbors.push(new rdfjs.Quad(this.node,
				     predicate,
				     object,
				     new rdfjs.DefaultGraph(this.graph)));
	}
    }
	
    // server is supposed to be a SPARQL endpoint implementing the "query" interface
    getNeighborhood(server) {
	// Run the queryTo
	server.query(this.graph, this.queryTo());
	var result_to = server.getResult();
	this.parseQueryTo(result_to);
	if (this.both == true) {
	    // Run the queryFrom
	    server.query(this.graph, this.queryFrom());
	    var result_from = server.getResult();
	    this.parseQueryFrom(result_from);
	}
    }

    getNeighbors() {
	return this.neighbors;
    }

    to_str() {
	var output = ""
	for (q of this.neighbors) output += q.to_str() + "\n";
	return output;
    }
}




/*=======================================
 * Tests
 *=======================================*/
function test1(){
    define_prefix('toto', 'tutu')
    console.log(PREFIXES);

    const myQuad = new rdfjs.Quad(
	new rdfjs.NamedNode('https://ruben.verborgh.org/profile/#me'),
	new rdfjs.NamedNode('http://xmlns.com/foaf/0.1/givenName'),
	new rdfjs.Literal('Ruben', 'en'),
	new rdfjs.DefaultGraph(),
    );
    console.log(myQuad.to_str());
}

test1();


/*=======================================
 * Exports
 *=======================================*/
module.exports = {
    define_prefix : define_prefix,
    Neighborhood : Neighborhood
}


