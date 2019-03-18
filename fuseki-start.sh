#!bin/bash
echo "Use: source this file."
echo "source fuseki-start.sh"
FUSEKIPATH=/home/olivier/Software/jena-fuseki1-1.6.0/
cd $FUSEKIPATH
./fuseki-server --config=config.ttl
