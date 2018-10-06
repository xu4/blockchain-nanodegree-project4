# Dependencies
This project uses Express, a Node.js Framework. 

```
"dependencies": {
    "body-parser": "^1.18.3",
    "crypto-js": "^3.1.9-1",
    "express": "^4.16.3",
    "level": "^4.0.0"
  }
```

# Local Deployment
1. Download or Clone the repo to project_dir locally
2. In project_dir, run npm install to install dependencies
3. Run node index.js
4. Server listens at port 8000.  http://localhost:8000

# REST API
Content-Type header for all requests is application/json.

### GET Block Endpoint: 
1. GET /block/:blockID
2. Path parameter: blockID is a number representing block height.
3. Request example:
```
curl -X GET http://localhost:8000/block/0
```
4. Response: a block object in JSON format.
```
{
"hash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3",
"height":0,
"body":"First block in the chain - Genesis block",
"time":"1530311457",
"previousBlockHash":""
}
```
5. Errors:
	When block height parameter from the request, is more than current Blockchain length or is not a number, then Bad Request error is returned.

	Status code is 400

	Response body has error: String property.
```
{"error": "Invalid block height."}
```


### POST Block Endpoint: 
1. POST /block
2. Request example:
```
curl -X POST \
  http://localhost:8000/block \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{"body": "Testing block with test string data"}'
```
3. Response: a block object in JSON format.
```
{
    "hash": "c20c4afbc53b8f4ea150163f30de2f6f476099cd20be6a1264c5b6e6ab41fa3a",
    "height": 5,
    "body": "Testing block with test string data",
    "time": "1538685493",
    "previousBlockHash": "058b1cd78d5d1f496da7150775ef07cb3c772bec08350aecfa12cd88496b227a"
}
```
4. Errors:
	For post without any content on the payload, Bad Request error is returned.

	Status code is 400

	Response body has error: String property.
```
{"error": "Invalid block body. Block is not created."}
```
