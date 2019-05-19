# ontovisu

Visualization of RDF triples

## Done

  * Neighbourhood is OK (set of Quads)

## Ongoing

  * Query to get IDs of a triple in `request.sparql`

Temporary files:

  * `queries.js`: Not used yet
  * `representation.js`: The idea was to build a graph representation that can serialize in a graphical graph model (like in `rdfviz`).
  * `requests.sparql`: Some queries
  
Maybe the neighbourhood should just serialize in a set of nodes and edges:

  * With `ID` and `value` for nodes,
  * With `ID`, `value`, `source` and `target` for edges.
