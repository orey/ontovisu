/******************************************************
 * Author: O. Rey
 * email: rey.olivier@gmail.com
 * Date: March 15 2019
 * Fuseki wrapper
 * License: Apache 2
 ******************************************************/

'use strict';

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

/**
 * Warning : this class is not thread safe because the result is get inside the server
 */
class FusekiWrapper {
    constructor(hostname, port){
        this.hostname = hostname;
        this.port     = port;
        // Those members enable to remember the last query
        this.dataset = "";
        this.url = "";
        this.response = "";
    }

    buildSelectQuery(query) {
        return this.hostname + ":" + this.port + "/"
                 + this.dataset + "/query?query=" + encodeURIComponent(query);
    }

    query(dataset, query){
        // Defining the URL to query
        this.dataset = dataset;
        this.url = this.buildSelectQuery(query);
        console.log(this.url);
        
        // Creating the http object for the request response
        var http = new XMLHttpRequest();
        http.responseType = 'json';

        //	http.open("POST",
        http.open("GET", this.url, false); // third param is async or not

        // Creating a listener
        http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {
                console.log("HTTP Response: " + http.responseText);
            }
        }
        http.send(null);
        var response;
        // Parse the response
        try {
            console.log("HTTP Response: " + http.responseText);    
            response = JSON.parse(http.responseText);
            console.log(response);
        }
        catch(e){
            console.log("Error caught during parsing");
            console.log(e);
        }
        this.response = response;
        return response;
        
    }

}


/*=======================================
 * Exports
 *=======================================*/
module.exports = {
    FusekiWrapper : FusekiWrapper
}


