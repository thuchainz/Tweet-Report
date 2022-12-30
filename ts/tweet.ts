class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.includes("Just completed") || this.text.includes("Just posted")) {
            return "completed_event";
        }
        else if (this.text.startsWith("Watch")) {
            return "live_event";
        }
        else if (this.text.includes("Achieved")) {
            return "achievement";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if ((this.text.includes(" - ") && !this.text.includes("TomTom MySports Watch")) || this.text.includes("\n")) {
            return true;
        }
        return false;
    }

    //parses the written text from the tweet
    get writtenText():string {
        if(!this.written) {
            return "";
        }
        var writtenText = this.text.slice(this.text.indexOf(" - "), this.text.indexOf("https://t.co/"));
        return writtenText;
    }

    //parses the activity type from the text of the tweet
    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        let activity = "";
        let words = this.text.split(" ");   //splits text into array of words
        let start = words.indexOf("a")+1; 
        let end = words.indexOf("with");    //(1) "Just completed/posted a/an [distance] [activity] with/-"
        if (words.includes("an")) {         //(2) "Just posted a/an [activity] in [duration] with/-"
            start = words.indexOf("an")+1;
        }
        if (words.includes("-")) {
            end = words.indexOf("-");
        }

        words = words.slice(start, end);    //trims words array to activity-related text
        if (words.includes("in")) {
            activity = words.slice(0, words.indexOf("in")).join(" ");
        }
        else {
            activity = (words.slice(words.indexOf("mi")).join(" ") || words.slice(words.indexOf("km")).join(" "));    
        }
        if (activity == "") {
            activity = "MySports";
        }
        return activity;
    }

    //parses the distance from the text of the tweet
    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

	    let words = this.text.split(" ");
	    let distance = parseFloat(words[3]);
        if (words[4] == "km") {
            distance = distance/1.609;
        }
	    return distance;
    }
}
