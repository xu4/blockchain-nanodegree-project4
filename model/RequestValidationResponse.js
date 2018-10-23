

class RequestValidationResponse{
	
	constructor(registrationRequest){
		this.address = registrationRequest.address;
      	this.requestTimeStamp = registrationRequest.requestTimeStamp;
      	this.message =registrationRequest.message;
      	this.validationWindow = registrationRequest.validationWindow;
	}

}

module.exports = RequestValidationResponse;