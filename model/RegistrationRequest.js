const constants = require('../Constants');


class  RegistrationRequest{
	
	constructor(address){
		this.address = address;
      	this.requestTimeStamp = Date.now();
      	this.message = address+":"+this.requestTimeStamp+":starRegistry";
      	this.validationWindow = constants.VALIDATION_WINDOW_MINUTES*60;
      	this.messageSignature = "invalid";
      	this.registerStar = false;

	}
}

module.exports = RegistrationRequest;