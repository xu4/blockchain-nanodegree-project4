const Blockchain = require('./simpleChain');


class BlockController{

  constructor(){
  this.blockChain = new Blockchain();
  }
  errorHandle(req, res, errMsg) {
    res.status(400).send('{"error": "'+errMsg+'"}');
  }

  getBlock(req, res) {
   
   var blockHeight = req.params.num;

   if(isNaN(blockHeight) || parseInt(blockHeight) < 0){
      this.errorHandle(req, res, "Invalid block height.");
   }else{
  
    this.blockChain.getBlock(blockHeight).then((block)=>{
          res.status(200).send(block);
    }).catch((error)=>{
          this.errorHandle(req, res, "Error while getting block "+ blockHeight + '. ' +error);
      });
  }
}//end of getBlock  
   

  addBlock(req, res) {
   
   var bodyText = req.body.body;
  
   if(bodyText!= undefined){

      this.blockChain.addBlock(Blockchain.createBlock(bodyText)).then((block)=>{
        res.status(200).send(block);
        
      }).catch((error)=>{
        this.errorHandle(req, res, "Error while creating block: "+ error );
      });
      
    
   } else {
     this.errorHandle(req, res, "Invalid block body. Block is not created.");
   }
 }//end of addBlock

} //end of class

module.exports = BlockController;

