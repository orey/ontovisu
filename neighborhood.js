/*-----------------------------------------------------
Author: O. Rey
email: rey.olivier@gmail.com
Date: March 16 2019
Neighborhood request calculation
License: Apache 2
------------------------------------------------------
The 'N3' js library was removed as a dependency because
it did not allow accesses to the internal classes.
Instead a customized version of the standard was used.
------------------------------------------------------*/

'use strict';

// Customized version of http://rdf.js.org/
const rdfjs = require('./rdfjs');

const crypto = require('crypto');

function generateId() {
    crypto.randomBytes(256, (err, buf) => {
        if (err) throw err;
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
      });      
}

/*-----------------------------------------------------
Global variables
------------------------------------------------------*/

// Define a list of common prefixes
// Not used currently
const REQ_PREFIXES = {
    rdf   : 'PREFIX rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
    rdfs  : 'PREFIX rdfs:   <http://www.w3.org/2000/01/rdf-schema#>',
    dc    : 'PREFIX dc:     <http://purl.org/dc/elements/1.1/>',
    vcard : 'PREFIX vcard:  <http://www.w3.org/2001/vcard-rdf/3.0#>'}


// Not used currently following a redesign
let PREFIXES = {
    rdf   : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs  : 'http://www.w3.org/2000/01/rdf-schema#',
    dc    : 'http://purl.org/dc/elements/1.1/',
    vcard : 'http://www.w3.org/2001/vcard-rdf/3.0#'}

function define_prefix(key, value) {
    PREFIXES[key] = value;
}

/*-----------------------------------------------------
Class Neighborhood
------------------------------------------------------
This class supports the following types for the root node:
* Literal
* NamedNode
* BlankNode
* Members: node (root node), graph, neighbors, both
The 'both' attribute is here to indicate that the
neighborhood should be addressed or not both ways:
* From the root node to the exterior
  => root-node ?p ?o .
* From the exterior to the root node
  => ?s ?p root-node .
For sure, if the root node is a Literal, then both = false
and only the second request will be executed.
------------------------------------------------------*/
class Neighborhood {
    /**
     * node is the rootnode and graph its attachment graph.
     * @param {*} graph: DefaultGraph
     * @param {*} node: Literal, NamedNode, BlankNode
     */constructor(graph, node) {	
        this.graph = graph;
        this.node = node;
        this.neighbors = []; // List of quads
        if (node.constructor.name == "Literal") {
            this.both = false;
            return;
        }
        if ((node.constructor.name != "NamedNode") &&
            (node.constructor.name != "Variable")  &&
            (node.constructor.name != "BlankNode"))
            throw new Error("Unknown type of node: " + node.constructor.name)
        this.both = true; // Not sure it means something with a Variable
    }

    /**
     * Builds the query that matches the root node as an object
     *  */
    queryTo() {
    	return "SELECT ?s ?p  WHERE { ?s ?p " + this.node.to_str() + " .}";
    }

    /**
     * Parse the query for the root node considered as an object
     * JSON received from Fuseki:
     *   { head: { vars: [ 'a', 'b' ] },
     *   results: { bindings: [ [Object], [Object], [Object], [Object] ] } }
     * @param {*} result: structure got from the query to a SPARQL engine
     */
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

    /**
     * Builds the query where the root node is a subject
     */
    queryFrom(){
	    return "SELECT ?p ?o  WHERE { " + this.node.to_str() + " ?p ?o .}";
    }

    /**
     * Parse the query for the root node considered as a subject
     * @param {*} result: structure got from the query to a SPARQL engine
     */
    parseQueryFrom(result) {
        if (result == null) return;
        var arr = result.results.bindings;
        for (var e of arr) {
            var predicate, object;
            // Predicate should be a URI
            if (e.p.type == 'uri')
                predicate = new rdfjs.NamedNode(e.p.value);
            else
                throw new Error("Unknown type of predicate: " + e.p.type);
            // Object can be a URI, a blank node or a literal
            if (e.o.type == 'uri')
                object = new rdfjs.NamedNode(e.o.value);
            else if (e.o.type == "literal")
                object = new rdfjs.Literal(e.o.value);
            else if (e.o.type == 'bnode')
                object = new rdfjs.BlankNode(e.o.value);
            else
                throw new Error("Unknown type of object: " + e.o.type);
            // The quad must be recorded
            this.neighbors.push(new rdfjs.Quad(this.node,
                                predicate,
                                object,
                                new rdfjs.DefaultGraph(this.graph)));
        }
    }
	
    /**
     * Once the object is created, this method is supposed to build the
     * neighborhood while querying the Sparql endpoint
     * @param {*} server: supposed to be a SPARQL server 
     */
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
    
    /**
     * Simple get method
     */
    getNeighbors() {
    	return this.neighbors;
    }

    /**
     * Serializes the Neighborhood to string
     */
    to_str() {
        var output = "";
        for (var q of this.neighbors) output += q.to_str() + "\n";
        return output;
        }
}

/*=======================================
 * Tests
 * To run on the console:
 * $ node -e "var a = require('./neighborhood.js'); a.test1()"
 *=======================================*/
function test1(){
    define_prefix('toto', 'tutu')
    console.log(PREFIXES);

    const myQuad = new rdfjs.Quad(
	                        new rdfjs.NamedNode('https://ruben.verborgh.org/profile/#me'),
	                        new rdfjs.NamedNode('http://xmlns.com/foaf/0.1/givenName'),
	                        new rdfjs.Literal('Johnny Go', 'en'),
	                        new rdfjs.DefaultGraph());
    console.log(myQuad.to_str());
}

/*=======================================
 * Exports
 *=======================================*/
module.exports = {
    define_prefix : define_prefix,
    Neighborhood : Neighborhood,
    test1 : test1,
    generateId : generateId
}



