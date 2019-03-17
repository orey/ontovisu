/******************************************************
 * Author: O. Rey
 * email: rey.olivier@gmail.com
 * Date: March 15 2019
 * Fuseki wrapper
 * License: Apache 2
 ******************************************************/

'use strict';

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class FusekiWrapper {
    constructor(hostname, port){
	this.hostname = hostname;
	this.port     = port;
	// Those members enable to remember the last query
	this.dataset = "";
	this.url = "";
	this.response = "";
	this.result ="";
    }
    query(dataset, query){
	// Defining the URL to query
	this.dataset = dataset;
	this.url = this.hostname + ":" + this.port + "/"
	    + this.dataset + "/query?query=" + encodeURIComponent(query)
	console.log(this.url);
	
	// Creating the http object for the request response
	var http = new XMLHttpRequest();
	http.responseType = 'json';
	//	http.open("POST",
	http.open("GET",
		  this.url,
		  false); // third param is async or not
	// Creating a listener
	var result;
	http.onreadystatechange = function() {
	    if(http.readyState == 4 && http.status == 200) {
		this.response = http.responseText;
		console.log(this.response);
		// Parse the response
		try {
		    result = JSON.parse(this.response);
		}
		catch(e){
		    console.log("Error caught during parsing");
		    console.log(e);
		}
	    }
	}
        http.send(null);
	this.result = result;
    }
    getResult(){return this.result;}
}


/*=======================================
 * Exports
 *=======================================*/
module.exports = {
    FusekiWrapper : FusekiWrapper
}


