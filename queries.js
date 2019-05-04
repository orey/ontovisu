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

