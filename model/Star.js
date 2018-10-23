const constants = require('../Constants');


class  Star{
	
	constructor(star){
		this.dec = star.dec;
		this.ra = star.ra;
		this.mag = star.mag;
		this.const = star.const;
		this.story = star.story;

	}

	isValid(){
		let error = new Error();

		if(this.dec == undefined || this.dec.length == 0 || this.ra == undefined || this.ra.length == 0 
			|| this.story == undefined || this.story.length ==0) {
			throw new Error("Star's ra, dec and story fields are required.");
		}

		
		const isASCII = ((str) => /^[\x00-\x7F]*$/.test(str));

		if (!isASCII(this.story)) {
           throw new Error("Your star story contains non-ASCII symbol");
        }

		
		let storyLengthBytes = new Buffer(this.story).length;
        let storyLengthWords = this.story.split(" ").length;

        if (storyLengthBytes > constants.MAX_STORY_BYTES || storyLengthWords > constants.MAX_STORY_WORDS) {
           throw new Error("Story length must be less than "+MAX_STORY_BYTES +" bytes or " +MAX_STORY_WORDS +" words.");
        }
	}
}

module.exports = Star;

