/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key,value){

  return new Promise(function(resolve, reject){

     db.put(key, value, function(err) {
          if (err) reject(err);
          else {
            //console.log("addLevelDBData successful: key="+key+", value ="+ value);
            resolve(value);
          }
     });
  });
  
}


// Get data from levelDB with key
function getLevelDBData(key){

  return new Promise(function(resolve, reject){

   db.get(key, function(err, value) {
      if (err) reject(err);
      else
      resolve(value);
  });
  });
}



function getNumberOfEntries(){

  return new Promise(function(resolve, reject){

    let i = 0;
    db.createReadStream().on('data', function(data) {
        i++;
    }).on('error', function(err) {
        console.log('Unable to read data stream!', err);
        reject(error);
    }).on('close', function() {
        //console.log('NumberOfEntries in DB:' + i);
        resolve(i);
    });


  });
}
module.exports.addLevelDBData = addLevelDBData;
module.exports.getLevelDBData = getLevelDBData;
module.exports.getNumberOfEntries = getNumberOfEntries;



