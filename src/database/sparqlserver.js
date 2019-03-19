/******************************************************
 * Author: O. Rey
 * email: rey.olivier@gmail.com
 * Date: March 15 2019
 * Sparql server interface
 * License: Apache 2
 ******************************************************/

'use strict';

class NotImplemented extends Error {
    constructor(msg="") {
        super("Not implemented. ")
    }
}

/**
 * Main interface of the Sparql servers
 */
class SparqlServer {
    /**
     * Parameters of the server
     * @param {*} hostname 
     * @param {*} port 
     */
    constructor(hostname, port) {
        this.hostname = hostname;
        this.port     = port;
    }
    /**
     * Main API to send sparql queries
     * @param {*} dataset 
     * @param {*} query 
     * @returns response: JSON object
     */
    query (dataset, query) {
        throw new NotImplemented("This function should return a response.")
    }
}

module.exports = {
    NotImplemented : NotImplemented,
    SparqlServer : SparqlServer
}

