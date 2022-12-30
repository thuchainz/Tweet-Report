"use strict";
class Tweet {
    constructor(tweet_text, tweet_time) {
        this.text = tweet_text;
        this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
    }
    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source() {
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
    get written() {
        if ((this.text.includes(" - ") && !this.text.includes("TomTom MySports Watch")) || this.text.includes("\n")) {
            return true;
        }
        return false;
    }
    //parses the written text from the tweet
    get writtenText() {
        if (!this.written) {
            return "";
        }
        var writtenText = this.text.substring(this.text.indexOf("-") + 2, this.text.indexOf(" https://t.co/"));
        return writtenText;
    }
    //parses the activity type from the text of the tweet
    get activityType() {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        var start = this.text.indexOf("mi") + 3;
        var end = this.text.indexOf(" with");
        if (this.text.includes(" km ")) {
            start = this.text.indexOf("km") + 3;
        }
        if (this.written) {
            end = this.text.indexOf(" -");
        }
        var activity = this.text.slice(start, end);
        return activity;
    }
    //parses the distance from the text of the tweet
    get distance() {
        if (this.source != 'completed_event') {
            return 0;
        }
        let end = this.text.indexOf(" mi");
        if (this.text.includes(" km ")) {
            end = this.text.indexOf(" km");
        }
        var distance = parseFloat(this.text.slice(this.text.indexOf("a") + 2, end));
        if (this.text.includes(" km ")) {
            distance = distance / 1.609;
        }
        return distance;
    }
    getHTMLTableRow(rowNumber) {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}
