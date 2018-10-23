class  SignatureValidationResponse{
	
	constructor(registrationRequest){
		this.registerStar = registrationRequest.registerStar;
		this.status ={
			address: registrationRequest.address,
			requestTimeStamp : registrationRequest.requestTimeStamp,
			message: registrationRequest.message,
			validationWindow: registrationRequest.validationWindow,
			messageSignature: registrationRequest.messageSignature
		};

	}



}

module.exports = SignatureValidationResponse;