//******************************************************
// This file enables to represent nodes
// Author: O. Rey
// email: rey.olivier@gmail.com
// Date: March 14 2019
// Main entry point
// License: Apache 2
// *****************************************************
// The objective is to get all triples from a certain
// origin, and to get them both ways.
// The originality of the approach is that it retrieves
// the graph of data in order to be displayed and not the data
// directly.
// *****************************************************
'use strict';

const rdfjs = require('./rdfjs');

const DOMAINS = {
    rdf   : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs  : 'http://www.w3.org/2000/01/rdf-schema#',
    vcard : 'http://www.w3.org/2001/vcard-rdf/3.0#',
    xml   : 'http://www.w3.org/XML/1998/namespace',
    xsd   : 'http://www.w3.org/2001/XMLSchema#',
    dc    : 'http://purl.org/dc/elements/1.1/',
    ga    : 'https://orey.github.io/graphapps-V1#'
}

function create_header(app_domains=null){
    var a = '';
    for (var property in DOMAINS) {
        if (DOMAINS.hasOwnProperty(property))
            a += 'PREFIX ' + property + ': <' + DOMAINS[property] + '>\n';
    }
    if (app_domains != null)
        for (var property in app_domains) {
            if (app_domains.hasOwnProperty(property))
                a += 'PREFIX ' + property + ': <' + app_domains[property] + '>\n';
    }
    return a;
}

function test(){
    console.log(create_header());
    console.log("================");
    console.log(create_header({ ns1 : 'http://example.org/book/',
                                ns2 : 'http://example.org/ns#'}));
    var n = new rdfjs.NamedNode("http://example.org/book/book2");
    console.log(get_neighbours(n));
}


;


function get_neighbours(node){
    var query = `SELECT ?n WHERE { ?n rdf:value ${node.to_str()} ; rdf:type ga:Node . }`;
    
    return query;

}


test();



