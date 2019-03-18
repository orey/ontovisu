/*-----------------------------------------------------
Author: O. Rey
email: rey.olivier@gmail.com
Date: March 18 2019
Neighborhood request calculation
License: Apache 2
-------------------------------------------------------
This section is an implementation of the standard
http://rdf.js.org/
Some liberty was taken with the standard that is pushing
for the use of the DataFactory, making it difficult to use
directly the various class structures.
Our interpretation of the standard makes it possible to
use the classes inside the standard, not only through
the factory, and so to have libraries, manipulating those
objects.
In order to represent them, we have also the obligation of
making them unique, which implies a subclassing.
------------------------------------------------------*/

const DEFAULT_GRAPH = "ds";

class Term {
    constructor(termType, value) {
	if (termType.constructor.name != "String")
	    throw new TypeError("termType should be a String. Provided type: " +
				termType.constructor.name);
	this.termType = termType;
	console.log(value);
	console.log(value.constructor.name);
	if (value.constructor.name != "String")
	    throw new TypeError("value should be a String. Provided type: " +
				value.constructor.name);
	this.value = value;
    }
    equals(t){
	if ((t.termType == this.termType) && (t.value == this.value))
	    return true;
	else
	    return false;
    }
}

// Liberty with the standard, the object is directly buildable
// because I need it.
class NamedNode extends Term{
    constructor(value){
	super("NamedNode", value);
    }
}

// Liberty with the standard, the object is directly buildable
// because I need it.
class BlankNode extends Term{
    constructor(value){
	super("BlankNode", value);
    }
}

// Interpretation of the standard
class Literal extends Term{
    constructor(value, languageOrDatatype){
	super("Literal", value);
	let ltype = languageOrDatatype.constructor.name;
	if (ltype == "String") {
	    this.language = languageOrDatatype;
	    this.datatype = null;
	}
	else if (ltype == "NamedNode"){
	    this.language = "";
	    this.datatype = languageOrDatatype;
	}
	else {
	    throw new TypeError(
		"languageOrDataType should be a String or a NamedNode. Provided: "
		    + ltype);
	}
    }
    equals(t){
	// Interpretation of the standard
	if ((t.termType == this.termType) && (t.value == this.value) &&
	    (t.language == this.language) && this.datatype.equals(t.datatype))
	    return true;
	else
	    return false;
    }
}

class Variable extends Term{
    constructor(value){
	super("Variable", value);
    }
}

class DefaultGraph extends Term{
    constructor(value){
	super("DefaultGraph", value);
    }
}

class Quad{
    constructor(subject, predicate, object, graph){
	if ((!subject typeof "Term") ||

//reprendre ici

	    
	    (predicate.constructor.name != "Term") ||
	    (object.constructor.name != "Term") ||
	    (graph.constructor.name != "Term"))
	    throw new TypeError("Arguments of Quad constructor must all be of type Term");
	this.subject = subject;
	this.predicate = predicate;
	this.object = object;
	this.graph = graph;
    }
    equals(q){
	if (this.subject.equals(q.subject) && this.predicate.equals(q.predicate) &&
	    this.object.equals(q.object) && this.graph.equals(q.graph))
	    return true;
	else
	    return false;
    }
}

// Standard interpretation
class DataFactory{
    namedNode(value){
	return new NamedNode(value);
    }
    blankNode(value = ""){
	return new BlankNode(value);
    }
    literal(value, languageOrDatatype){
	return new Literal(value, languageOrDataType);
    }
    //Optional method
    variable(value){
	return new Variable(value);
    }
    // The standard method has no parameter, which is weird. Taking
    // liberty with the standard.
    defaultGraph(value = ""){
	return new DefaultGraph(value);
    }
    quad(subject, predicate, object, graph=null){
	if (graph == null)
	    return new Quad(subject, predicate, object, new DefaultGraph("DEFAULT"));
	else
	    return new Quad(subject, predicate, object, graph);
    }
}


/*----------------------------------------------------------
Utilities
----------------------------------------------------------*/
function printQuad(q){
    console.log("Graph: "+ q.graph.value + " | Triple: " +
		q.subject.value + " " + q.predicate + " " +
		q.object.value);
}


/*-----------------------------------------------------
Tests
------------------------------------------------------*/
function test1(){
    q = new Quad(new NamedNode("dc:toto"), new NamedNode("a"),
	     new Literal("a", "en"), new DefaultGraph("books"));
    printQuad(q);
}

test1();

/*----------------------------------------------------------
Exports
----------------------------------------------------------*/
module.exports = {
    Term : Term,
    NamedNode : NamedNode,
    BlankNode : BlankNode,
    Literal : Literal,
    Variable : Variable,
    DefaultGraph : DefaultGraph,
    Quad : Quad,
    DataFactory : DataFactory,
    printQuad : printQuad
}


