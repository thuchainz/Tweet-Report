function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//Update tweet number and dates
	$('#numberTweets').text(tweet_array.length);
	$('#firstDate').text(tweetDates(tweet_array).earliest.time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}));
	$('#lastDate').text(tweetDates(tweet_array).latest.time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}));
	
	//Update tweet categories and percentages
	var counts = tweetCategories(tweet_array);

	$('.completedEvents').text(counts.completed);
	$('.liveEvents').text(counts.live);
	$('.achievements').text(counts.achievement);
	$('.miscellaneous').text(counts.misc);
	$('.written').text(counts.written);

	$('.completedEventsPct').text(((counts.completed/tweet_array.length)*100).toFixed(2) + "%");
	$('.liveEventsPct').text(((counts.live/tweet_array.length)*100).toFixed(2) + "%");
	$('.achievementsPct').text(((counts.achievement/tweet_array.length)*100).toFixed(2) + "%");
	$('.miscellaneousPct').text(((counts.misc/tweet_array.length)*100).toFixed(2) + "%");
	$('.writtenPct').text(((counts.written/counts.completed)*100).toFixed(2) + "%");
}

//Find earliest and latest tweets
function tweetDates(tweet_array) {
	var earliest = tweet_array[0];
	var latest = tweet_array[0];

	tweet_array.forEach(function(tweet) {
		if (tweet.time < earliest.time) {
			earliest = tweet;
		}
		else if (tweet.time > latest.time) {
			latest = tweet;
		}
	});
	return {earliest, latest};
}

//Count tweets in each category and written tweets
function tweetCategories(tweet_array) {
	var completed = 0;
	var live = 0;
	var achievement = 0;
	var misc = 0;
	var written = 0;

	tweet_array.forEach(function(tweet) {
		if (tweet.source == "completed_event") {completed++;
			if (tweet.written) {written++;}}
		else if (tweet.source == "live_event") {live++;}
		else if (tweet.source == "achievement") {achievement++;}
		else if (tweet.source == "miscellaneous") {misc++;}
	});
	return {completed, live, achievement, misc, written};
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});