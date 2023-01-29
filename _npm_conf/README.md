# Configuration

## npm configuration behind a corporate firewall

This file has to be put in the home user (in `C:\users\TOTO` for Windows).

A setenv file must be done to point to `Node` and `npm` folder.

## Fuseki configuration

Prefer downloading a complete distribution:

  * Link: http://archive.apache.org/dist/jena/binaries/
  * Name like `jena-fuseki1-1.6.0-distribution.zip`
  * Documentation page: https://jena.apache.org/documentation/fuseki2/index.html
  
### Sparql test query

Simple startup: 'fuseki-server --config=config.ttl'

```
PREFIX dc: <http://purl.org/dc/elements/1.1/>

SELECT ?a ?b
WHERE { ?a dc:creator "J.K. Rowling" . 
        ?a dc:title ?b}
```

