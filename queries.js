//*****************************************************
// Sparql queries
// Author: O. Rey
// Creation date: May 04 2019
// License: Apache 2
//*****************************************************

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

