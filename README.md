
# Dependencies
This project uses Express, a Node.js Framework. 

```
"dependencies": {
    "bitcoinjs-lib": "^4.0.2",
    "bitcoinjs-message": "^2.0.0",
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

### Blockchain ID validation request 
1. POST http://localhost:8000/requestValidation
2. Request Body parameter: 
```
  address: String (34 chars). Required.
  This is wallet address, that Client wants to use to register the Star.
```

3. Request example:
```
curl -X "POST" "http://localhost:8000/requestValidation" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
}'
```

4. Successful Response: a block object in JSON format.
```
{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "requestTimeStamp": "1532296090",
  "message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry",
  "validationWindow": 300
}
```
5. Errors example:
When address is invalid,  Bad Request error is returned.
```
{"error": "Invalid address."}
```


### Blockchain ID message signature validation
1. POST  http://localhost:8000/message-signature/validate

2. Request Body parameter: 
```
  address: String (34 chars). Required.
  This is wallet address, that Client wants to use to register the Star.

  signature: String with  88 chars length. Required.
  This is signature of the message received in response to POST /requestValidation. Client must produce this signature for the message using his Bitcoin Wallet address.
```
3. Request example:
```
curl -X "POST" "http://localhost:8000/message-signature/validate" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "signature": "H6ZrGrF0Y4rMGBMRT2+hHWGbThTIyhBS0dNKQRov9Yg6GgXcHxtO9GJN4nwD2yNXpnXHTWU9i+qdw5vpsooryLU="
}'
```

4. Successful Response: a block object in JSON format.
```
{
  "registerStar": true,
  "status": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "requestTimeStamp": "1532296090",
    "message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry",
    "validationWindow": 193,
    "messageSignature": "valid"
  }
}
```

4. Errors example:
Status code is 400
```
{"error": "Empty/Invalid Address or Signature"}
```

### Star registration Endpoint
1. POST http://localhost:8000/block

2. Request Body parameter: 
```
  address: String (34 chars). Required.
  This is wallet address, that Client wants to use to register the Star.

  Star: Object. Required.
  star is Object with three required properties: ra, dec and story.

  ra: string describing Right Ascend of the Star. Required.
  dec: String describing Declination of the Star. Required.
  story: String describing any arbitrary information about the Star, max 500 bytes or 250 words length. Required.
```

3. Request example:
```
curl -X "POST" "http://localhost:8000/block" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "star": {
    "dec": "-26° 29'\'' 24.9",
    "ra": "16h 29m 1.0s",
    "story": "Found star using https://www.google.com/sky/"
  }
}'
```

4. Successful Response: a block object in JSON format.
```
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```
5. Errors example:
```
{"error": "Your request was expired."}
```

### Star Lookup By Hash Endpoint
1. Get http://localhost:8000/stars/hash:[HASH]

2. Request Body parameter: 
```
  hash: the hash of the block to be read (64 chars). Required.
```

3. Request example:
```
curl "http://localhost:8000/stars/hash:a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
```

4. Successful Response: a block object in JSON format.
```
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```
5. Errors example:
```
{"error": "Invalid Hash value."}
```

### Star Lookup By Wallet Address Endpoint
1. Get http://localhost:8000/stars/address:[ADDRESS]

2. Request Body parameter: 
```
  address: String (34 chars). Required.
```

3. Request example:
```
curl "http://localhost:8000/stars/address:142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
```

4. Successful Response: multiple block objects in JSON format.
```
[
  {
    "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
    "height": 1,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
  },
  {
    "hash": "6ef99fc533b9725bf194c18bdf79065d64a971fa41b25f098ff4dff29ee531d0",
    "height": 2,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "17h 22m 13.1s",
        "dec": "-27° 14' 8.2",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532330848",
    "previousBlockHash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
  }
]
```
5. Errors example:
```
{"error": "Invalid Address."}
```

### Star Lookup By Height Endpoint
1. Get http://localhost:8000/block/[HEIGHT]

2. Request Body parameter: 
```
  height: block height. Required.
```

3. Request example:
```
curl "http://localhost:8000/block/1"
```

4. Successful Response: a block object in JSON format.
```
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```
5. Errors example:
```
{"error": "No star is found."}
```
