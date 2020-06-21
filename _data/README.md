# Fuseki configuration

## Installation

https://jena.apache.org/download/index.cgi

Install the Fuseki distribution.

## Environment variables

In `.bashrc`:

```
export JAVA=/usr/bin/java

export FUSEKI_HOME=/home/olivier/Software/apache-jena-fuseki
export FUSEKI_BASE=$FUSEKI_HOME/run
export FUSEKI_CONF=$FUSEKI_BASE/config.ttl

export PATH=$FUSEKI_HOME/bin:$PATH
```

## Configuration

Choose `$FUSEKI_BASE/templates/config-tdb2`, copy it into `$FUSEKI_BASE` and rename it `config.ttl`.

## Run the fuseki-server

Type: `./fuseki-server` in the `FUSEKI_HOME` folder.




