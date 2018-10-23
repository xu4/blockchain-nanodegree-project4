const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const MemoryPool = require('../MemoryPool');
const RegistrationRequest = require('../model/RegistrationRequest');
const RequestValidationResponse = require('../model/RequestValidationResponse');
const SignatureValidationResponse = require('../model/SignatureValidationResponse');
const Star = require('../model/Star');
const Blockchain = require('../simpleChain');

const constants = require('../Constants');



let memPool = new MemoryPool();
let blockChain = new Blockchain();


class RegistrationController{

  constructor(){
 
  }

  errorHandle(req, res, errMsg) {
    res.status(400).send('{"error": "'+errMsg+'"}');
  }

  requestValidationAddress(req, res) {
   
   let address = req.body.address;
   
   if(address != undefined && address.length == constants.ADDRESS_LENGTH){
      
    let registrationRequest = memPool.processNewRequest(address);

    res.status(200).send(new RequestValidationResponse(registrationRequest));
    
   }else{
      this.errorHandle(req, res, "Invalid  Address");

    
  }
}  
   


validateMessageSignature(req, res) {

 let address = req.body.address;
 let messageSignature = req.body.signature;

  if(address != undefined && address.length == constants.ADDRESS_LENGTH && messageSignature != undefined && messageSignature.length == constants.SIGNATURE_LENGTH){
 
    let registrationRequest = memPool.retrieveRequest(address);
 
    if(registrationRequest != undefined && registrationRequest != null)
    {
 
     let timePassed = Math.floor((Date.now()-registrationRequest.requestTimeStamp)/1000);
      
      let isValid = false;
      let isExpired = false;

      registrationRequest.validationWindow = constants.VALIDATION_WINDOW_MINUTES*60 -timePassed;

      if(registrationRequest.validationWindow < 0){
        registrationRequest.validationWindow =0;
        isExpired = true;
      }


      try {
        isValid = bitcoinMessage.verify(registrationRequest.message, registrationRequest.address, messageSignature);
      } catch (error) {
        isValid = false;
      }

 
    registrationRequest.messageSignature = isValid ? 'valid' : 'invalid';
    registrationRequest.registerStar = !isExpired && isValid;

    res.status(200).send(new SignatureValidationResponse(registrationRequest));
 
    }else{
       this.errorHandle(req, res, "Invalid Request, your address can't be found or your request may have expired.");     
    }
 
  }else{
    this.errorHandle(req, res, "Empty/Invalid Address or Signature");
  }

}
  
registerStar(req, res){
  var address = req.body.address;
  var star = req.body.star;
  
   if(address != undefined && address.length == constants.ADDRESS_LENGTH){
    
    let registrationRequest = memPool.retrieveRequest(address);
    if(registrationRequest == undefined  ){
        this.errorHandle(req, res, "Your request needs to be validated first.");

    }else if(!registrationRequest.registerStar || registrationRequest.validationWindow == 0){
        this.errorHandle(req, res, "Your request was expired or signature was invalid.");

    }else{

       let timePassed = Math.floor((Date.now()-registrationRequest.requestTimeStamp)/1000);
      
       registrationRequest.validationWindow = constants.VALIDATION_WINDOW_MINUTES*60-timePassed;

       if(registrationRequest.validationWindow < 0){
        registrationRequest.validationWindow =0;
        this.errorHandle(req, res, "Your request was expired");
        return ;
      }

      let newStar = new Star(star);

      try{
        newStar.isValid();
      }catch(e){
        this.errorHandle(req, res, e.message);
        return ;
      }

      var body = { address, star };
      
      body.star.story  = new Buffer(star.story).toString('hex');;
  
      blockChain.addBlock(Blockchain.createBlock(body)).then((block)=>{
        block.body.star.story = new Buffer(block.body.star.story, 'hex').toString();
        res.status(200).send(block);
        
      }).catch((error)=>{
        this.errorHandle(req, res, "Error while registering the star: "+ error );
      });

    }
  }else{

    this.errorHandle(req, res, "Empty Address");
  }

}



findStarByAddress(req, res) {
   
   let address = req.params.address.slice(1);

   if(address != undefined && address.length == constants.ADDRESS_LENGTH){
    blockChain.findStarsByQuery("Address", address).then((blocks)=>{

      if(blocks.length==0){
          res.status(200).send("{'message', 'No star is found.'}");
      }else{
        res.status(200).send(JSON.stringify(blocks));
      }
    }).catch((error)=>{
      this.errorHandle(req, res, error.message);
      return;
    }); 
    
   }else{
      this.errorHandle(req, res, "Invalid Address");
    
  }
}


findStarByHash(req, res) {
   
   let hash = req.params.hash.slice(1);

   if(hash != undefined && hash.length == constants.HASH_LENGTH){
      
    blockChain.findStarsByQuery("Hash", hash).then((blocks)=>{

      if(blocks.length==0){
          res.status(200).send("{'message', 'No star is found.'}");
      }else if(blocks.length==1){

        res.status(200).send(JSON.stringify(blocks[0]));
      }
      
    }).catch((error)=>{
      this.errorHandle(req, res, error.message);
      return;
    });
  
   }else{
      this.errorHandle(req, res, "Invalid Hash value");
    
  }
}

findStarByBlockHeight(req, res) {
   
   var blockHeight = req.params.height;

   if(isNaN(blockHeight) || parseInt(blockHeight) < 0){
      this.errorHandle(req, res, "Invalid block height.");
   }else{

    blockChain.getBlock(blockHeight).then((block)=>{

      if(block == null){
          res.status(200).send('{"message", "No star is found."}');
      }else{
        res.status(200).send(JSON.stringify(block));
      }
    }).catch((error)=>{
      this.errorHandle(req, res, "No star is found."+error.message);
    }); 
   }   
}


} //end of class

module.exports = RegistrationController;

