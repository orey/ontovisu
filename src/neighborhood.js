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
* Members: node, graph, both
*/
class Neighborhood {
    constructor(graph, node, verbose=false) {	
	this.verbose = verbose;
	this.graph = graph;
	this.node = node;
	this.neighbors = []; // List of quads
	if (this.verbose) {
	    console.log("Graph = " + graph);
	    console.log("Node =" + node);
	}
	if (node instanceof literal) {
	    if (this.verbose) console.log("Found literal");
	    this.both = false;
	    return;
	}
	if (!(node instanceof namedNode) && !(node instanceof blankNode))
	    throw new Error("Unknown type of node: " + node.constructor.name)
	this.both = true;
    }

    queryTo() {
	return "SELECT ?s ?p  WHERE { ?s ?p " + this.getNodeString() + " .}";
    }

    /*{ head: { vars: [ 'a', 'b' ] },
      results: { bindings: [ [Object], [Object], [Object], [Object] ] } }*/
    parseQueryTo(result){
	//get the array of results
	arr = result.results.bindings;
	for (var e of arr) {
	    // Build a quad from results
	    /*{ s: { type: 'uri', value: 'http://example.org/book/book7' },
	      p: { type: 'literal',  value: 'Harry' } }*/
	    var subject, predicate;
	    if (e.s.type == 'uri')
		subject = namedNode(e.s.value);
	    else
		throw new Error("Unknown type of subject: " + e.s.type);
	    if (e.p.type == 'uri')
		predicate  = namedNode(e.p.value);
	    else
		throw new Error("Unknown type of predicate: " + e.p.type);
	    this.neighbors.push(quad(subject,
				     predicate,
				     this.node,
				     defaultGraph(this.graph)));
	}
    }

    queryFrom(){
	return "SELECT ?p ?o  WHERE { " + this.getNodeString() + " ?p ?o .}";
    }

    parseQueryFrom(result) {
	arr = result.results.bindings;
	for (var e of arr) {
	    var predicate, object;
	    if (e.p.type == 'uri')
		predicate  = namedNode(e.p.value);
	    else
		throw new Error("Unknown type of predicate: " + e.p.type);
	    if (e.o.type == 'uri')
		object = namedNode(e.o.value);
	    else if (e.o.type == "literal")
		object = Literal(e.o.value);
	    else
		throw new Error("Unknown type of object: " + e.o.type);
	    this.neighbors.push(quad(this.node,
				     predicate,
				     object,
				     defaultGraph(this.graph)));
	}
    }
	
    getNodeString(rough=false){
	if (rough) return this.node.value;
	else return "<" + this.node.value + ">";
    }

    // server is supposed to be a SPARQL endpoint
    getNeighborhood(server) {
	// Run the queryTo
	var result_to = server.query(this.graph, this.queryTo());
	this.parseQueryTo(result_to);
	if (this.both == true) {
	    // Run the queryFrom
	    var result_from = server.query(this.graph, this.queryFrom());
	    this.parseQueryFrom(result_from);
	}
    }

    getNeighbors() {
	return this.neighbors;
    }

    printNeighbors() {
	for (q of this.neighbors) printQuad(q);
    }
}




/*=======================================
 * Tests
 *=======================================*/
function test1(){
    define_prefix('toto', 'tutu')
    console.log(PREFIXES);

    const myQuad = quad(
	namedNode('https://ruben.verborgh.org/profile/#me'),
	namedNode('http://xmlns.com/foaf/0.1/givenName'),
	literal('Ruben', 'en'),
	defaultGraph(),
    );
    console.log(myQuad.subject.value);         // https://ruben.verborgh.org/profile/#me
    console.log("Type of subject: " + myQuad.subject.constructor.name);
    console.log(myQuad.predicate.value);
    console.log("Type of predicate: " + myQuad.predicate.constructor.name);
    console.log(myQuad.object.value);          // Ruben
    console.log(myQuad.object.datatype.value); // http://www.w3.org/1999/02/22-rdf-syntax-ns#langString
    console.log("Type of object: " + myQuad.object.constructor.name);
    console.log(myQuad.object.language);       // en
}




test1();


/*=======================================
 * Exports
 *=======================================*/
module.exports = {
    define_prefix : define_prefix,
    neighborhood : neighborhood
}


