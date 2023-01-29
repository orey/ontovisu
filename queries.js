//*****************************************************
// Sparql queries and object construction
// Author: O. Rey
// Creation date: May 25 2019
// License: Apache 2
//*****************************************************
'use strict';

const rdfjs  = require('./rdfjs');
const fuseki = require('./database/fuseki-wrapper');


//-----------------------------------------------------
// Constants
//-----------------------------------------------------

const S_PREFIXES = {
    DC    : "PREFIX dc: <http://purl.org/dc/elements/1.1/>",
    NS    : "PREFIX ns: <http://example.org/ns#>",
    GA    : "PREFIX ga: <https://orey.github.io/graphapps-V1#>",
    RDF   : "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>",
    RDFS  : "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
    VCARD : "PREFIX vcard: <http://www.w3.org/2001/vcard-rdf/3.0#>",
    XML   : "PREFIX xml: <http://www.w3.org/XML/1998/namespace>",
    XSD   : "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>"
}


const URIS = {
    dc    : "http://purl.org/dc/elements/1.1/",
    ns    : "http://example.org/ns#",
    ga    : "https://orey.github.io/graphapps-V1#",
    rdf   : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs  : "http://www.w3.org/2000/01/rdf-schema#",
    vcard : "http://www.w3.org/2001/vcard-rdf/3.0#",
    xml   : "http://www.w3.org/XML/1998/namespace",
    xsd   : "http://www.w3.org/2001/XMLSchema#"
}

//-----------------------------------------------------
// Queries
//-----------------------------------------------------

const HarryPotter01 = {
    dataset : 'books',
    query   : `PREFIX dc: <http://purl.org/dc/elements/1.1/>
               SELECT ?a ?b
               WHERE {
                   ?a dc:creator "J.K. Rowling" .
                   ?a dc:title   ?b .
               }`
};

const HarryNodes = {
    dataset : 'books',
    query :
    `PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX ns: <http://example.org/ns#>
PREFIX ns1: <https://orey.github.io/graphapps-V1#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX vcard: <http://www.w3.org/2001/vcard-rdf/3.0#>
PREFIX xml: <http://www.w3.org/XML/1998/namespace>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?s
WHERE {
  ?s rdf:type ns1:Node
}
`};


const airbus01 = Object.create(HarryPotter01);

airbus01.dataset = 'CI_CATALOG';
airbus01.query   = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                    PREFIX airbus: <https://www.airbus.com/h175/CI#>
                    SELECT ?s ?p
                    WHERE {
                        ?s ?p airbus:A_PN .
                    }
                    LIMIT 25`;

module.exports = {
    HarryPotter01 : HarryPotter01,
    airbus01      : airbus01
}

//-----------------------------------------------------
// Functions
//-----------------------------------------------------

const query_get_nodeid =
`SELECT ?sub
WHERE {
  ?sub rdf:type  ga:NodeID ;
       rdf:value $term .
}`;

//-- Gets the NodeID attached to the term passed
function get_node_id(server, graph, term){
    var obj = term.get_rdf_object();
    var query = S_PREFIXES.RDF + '\n'
              + S_PREFIXES.GA + '\n'
              + query_get_nodeid.replace('$term', obj.to_str());
    var result = server.query(graph.to_str(), query);
    if (result == null)
        return null;
    var arr = result.results.bindings;
    if (arr.length == 0) {
        console.log("No result found");
        return null;
    }
    if (arr.length != 1) {
        console.log("ID should be unique...");
        throw new Error("ID should be unique: " + arr);
    }
    console.log("************************\n" + arr[0].sub.value);
    return new rdfjs.NamedNode(arr[0].sub.value);
}


const query_get_nodevalue =
`SELECT ?obj
WHERE {
  $node rdf:type ga:NodeID ;
        rdf:value ?obj .
}`;

const query_get_edgevalue =
`SELECT ?obj
WHERE {
  $edge rdf:type ga:EdgeID ;
        rdf:value ?obj .
}`;


**** Rependre ici

//-- Gets the NodeID value
function get_node_value(server, graph, node){
    var query = S_PREFIXES.RDF + '\n'
              + S_PREFIXES.GA + '\n'
              + query_get_nodevalue.replace('$node', node.to_str());
    var result = server.query(graph.to_str(), query);
    if (result == null)
        return null;
    var arr = result.results.bindings;
    if (arr.length == 0) {
        console.log("No result found");
        return null;
    }
    if (arr.length != 1) {
        console.log("Value should be unique...");
        throw new Error("Value should be unique: " + arr);
    }
    console.log("************************\n" + arr[0].sub.value);
    return new rdfjs.NamedNode(arr[0].sub.value);
}







function tests(){
    let server = new fuseki.FusekiWrapper("http://localhost","3030");
    let graph = new rdfjs.DefaultGraph("books");
    console.log('===');
    console.log(get_node_id(server, graph,
        new rdfjs.Term(rdfjs.NAMED_NODE,'http://example.org/book/book1')));
    console.log('===');
    console.log(get_node_id(server, graph,
        new rdfjs.Term(rdfjs.BLANK_NODE,'http://example.org/book/_')));
    console.log('===');
    console.log(get_node_id(server, graph,
        new rdfjs.Term(rdfjs.LITERAL,'Johnny be good')));
    console.log('===');
    console.log(get_node_id(server, graph,
        new rdfjs.Term(rdfjs.LITERAL,"J.K. Rowling")));
    console.log('===');
    console.log(get_node_id(server, graph,
        new rdfjs.Term(rdfjs.VARIABLE,'X')));
    console.log('===');
}


//tests();

/*=======================================
 * Exports
 *=======================================*/
module.exports = {
    HarryPotter01 : HarryPotter01,
    get_node_id : get_node_id
}
