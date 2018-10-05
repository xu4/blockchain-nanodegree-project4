/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const db = require('./levelSandbox');



/* ===== Block Class ==============================
|  Class with a constructor for block          |
|  ===============================================*/

class Block{
  constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain    |
|  ================================================*/

class Blockchain{
  
  
constructor(){
        this.getBlockHeight().then((h) => {
            if (h < 0) {
                // create Genesis block
                let genesisBlock = Blockchain.createBlock("First block in the chain - Genesis block");
                genesisBlock.previousBlockHash = "";
                genesisBlock.height = 0;
                genesisBlock.time = new Date().getTime().toString().slice(0, -3);
                genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();

                // add Genesis block to chain
                db.addLevelDBData(0, JSON.stringify(genesisBlock))
                    .then((block) => {
                        console.log('Added Genesis Block.\n'+ JSON.stringify(block));
                      
                    }).catch((err) => {
                        console.log('Unable to add Genesis block!', err);
                });
            }
        }).catch((err) => {
            console.log('Unable to get Block Height!', err);
        });
    }



  addBlock(newblock){
    
    return new Promise((resolve, reject) =>{

      this.getBlockHeight().then((height) =>{

        newblock.height = height+1;
        newblock.time = new Date().getTime().toString().slice(0, -3);
        
        this.getBlock(height).then((block)=>{
          newblock.previousBlockHash = block.hash;
          newblock.hash = SHA256(JSON.stringify(newblock)).toString();

          db.addLevelDBData(newblock.height, JSON.stringify(newblock)).then((block)=>{
            resolve(JSON.parse(block));
          }).catch((error)=>{
            reject("Unable to save block to db, block not added."+error, error);

          });
        }).catch((error)=>{
          reject("Unable to get block "+height+", block not added." + error, error);
        });
       
      }).catch((error)=>{
        reject("Unable to get block height, block not added."+error, error);
      });

    });
  }

  getBlock(blockHeight){
    return new Promise((resolve, reject)=>{
     db.getLevelDBData(blockHeight).then((value)=>{
        resolve(JSON.parse(value));
      }).catch((error)=>{
        reject(error);
      });
    });
}


  // Get block height, height starts from 0, size starts from 1
    getBlockHeight(){
      return new Promise((resolve, reject)=>{
        db.getNumberOfEntries().then(function(size){
          resolve(size -1);
        }).catch(function(error){
          reject(error);
        });
    });
      
  }

  // validate block
    validateBlock(blockHeight){

      return new Promise((resolve, reject)=>{
        this.getBlock(blockHeight).then((block)=>{
        // get block hash
        let blockHash = block.hash;

         // remove block hash to test block integrity
        block.hash ='';

      // generate block hash
          let validBlockHash = SHA256(JSON.stringify(block)).toString();

          if (blockHash===validBlockHash) {
            //validate block connectivity with previous block.
            if(blockHeight == 0){
              if(block.previousBlockHash =='') resolve(true);
            }else{
              this.getBlock(blockHeight-1).then((previousBlock)=>{
              
                if (block.previousBlockHash!==previousBlock.hash) {
                  reject('Invalid connectivity, Block #'+blockHeight +' is incorrectly connected with Block #'+(blockHeight-1));
                }else{
                  resolve(true);
                }
              }).catch((error)=>{
                reject('Error getting Block #'+(blockHeight-1), error);
              });
            
            }
          } else {
            reject('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          }

      }).catch((error)=>{
        reject("Error getting block "+blockHeight, error);
      });
      });
    }



 // Validate blockchain
     validateChain(){
      return new Promise((resolve, reject)=>{
        this.getBlockHeight().then(async (height)=>{
           
            let errorList = [];
        
          for (var i = 0; i <= height; i++) {
              await this.validateBlock(i).then((valid)=>{
              console.log('Valid block: '+i);
            }).catch((error)=>{
              errorList.push(i);
            });
          }

        if (errorList.length>0) {
              console.log('Blocks errors: '+errorList);
        } else {
              console.log('No errors detected');
        }
          resolve(errorList);
          
      }).catch((error)=>{
            console.log("Error getting block height.");
            reject(error);
      });

    });

    }

  static createBlock(description) {
        return new Block(description)
  }

}//end of class
  
module.exports = Blockchain;
  
