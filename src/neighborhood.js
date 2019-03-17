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

const N3 = require('n3');

const { DataFactory } = N3;
const { namedNode, blankNode, literal, defaultGraph, quad } = DataFactory;

// Define a list of common prefixes
let REQ_PREFIXES = {
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

/*
SELECT ?s ?p
WHERE { ?s ?p "J.K. Rowling" .}
*/

class neighborhood {
    constructor(graph, node, prefix="") {
	this.both = true;
	//we have to determine if the node is a NamedNode of a Literal
	if (node instanceof Literal) {
	    this.both = false;
	}
	else if (!(node instanceof NamedNode) && !(node instance BlankNode)) {
	    throw new Error("Unknown type of node: " + node.constructor.name)
	}
	
	if (prefix != ""){
	    temp = PREFIXES[prefix]
	    if (temp == undefined)
		throw new Error("Unknown prefix: " + temp)
	    else {
		this.prefix = temp;
		this.node = "<" + this.prefix + node + ">";
	    }
	}
	else {
	    this.prefix = "";
	    this.node = node;
	}
	this.graph = graph;
    }
    
    get() {
	if (this.both == true) {
	    request1 = "SELECT ?p ?o  WHERE { " + node.value + " .}"
	}
    }
}




/*=======================================
 * Tests
 *=======================================*/
function test(){
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

test();


/*=======================================
 * Exports
 *=======================================*/
module.exports = {
    define_prefix : define_prefix
}


