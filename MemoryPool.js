const RegistrationRequest = require('./model/RegistrationRequest');
const constants = require('./Constants');


class  MemoryPool{
	
	constructor(){
		this.map = new Map();
	
	}

	processNewRequest(address){
		let request = this.map.get(address);

		if(request == undefined || request == null){

			request = new RegistrationRequest(address);
			this.addRequest(request);
		}else{
	 		let timePassed = Math.floor((Date.now()-request.requestTimeStamp)/1000);
      		
      		request.validationWindow =constants.VALIDATION_WINDOW_MINUTES*60 -timePassed;
		}

		return request;

	}

	addRequest(registrationRequest){
		
		setTimeout(() => {
            this.removeRequest(registrationRequest);
        }, constants.VALIDATION_WINDOW_MINUTES*60 * 1000);

		this.map.set(registrationRequest.address, registrationRequest);
	}
	
	removeRequest(registrationRequest){		
			this.map.delete(registrationRequest.address);
	}
	
	retrieveRequest(key){
		return this.map.get(key);
	}

	showAll(){

		for (var key of this.map.keys()) {
 	 		let req = this.map.get(key);
 	 		console.log(req.address+", " + req.requestTimeStamp+"," +req.message+"," + req.validationWindow);
 		}
	}
}

module.exports = MemoryPool;