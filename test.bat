echo === Test rdfjs
node -e "var a = require('./rdfjs.js'); a.test1()"
echo === Test neighborhood
node -e "var a = require('./neighborhood.js'); a.test1()"
echo === Test crypto
node -e "var b = require('./neighborhood.js'); b.generateId()"

