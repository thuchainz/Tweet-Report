var written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	//Filter to just the written tweets
	written_tweets = runkeeper_tweets.map(function(tweet) {
			return new Tweet(tweet.text, tweet.completed_at);
		}).filter(function(tweet) {
			return tweet.written;
		});
}

function addEventHandlerForSearch() {
	$('#searchText').text("");
	$('#searchCount').text(0);
	$('#textFilter').keyup(function() {
		refresh();
	});
}
 
//Redo search everytime a key is pressed
function refresh() {
	var input = $('#textFilter').val();
	
	//Empty table, count, and text
	$('#tweetTable').empty();
	if (input == "") {
		$('#searchText').text("");
		$('#searchCount').text(0);
		return;
	}

	let input_lowercase = new RegExp(input, "i");
	let input_count = 0;

	//Iterate through written tweets and append to table if tweet includes input
	written_tweets.forEach(function(tweet) {
		if(tweet.writtenText.search(input_lowercase) != -1) {
			input_count++;
			$('#tweetTable').append("<tr><td>" + input_count + 
									"</td><td>" + tweet.activityType + 
									"</td><td>" + tweet.distance.toFixed(2) + displayUnit(tweet) +
									"</td><td>" + clickableLink(tweet) + "</td></tr>");
		}
		$('#searchText').text(input);
		$('#searchCount').text(input_count);
	});
}

//Return distance unit
function displayUnit(tweet) {
	var unit = " mi";
	if (tweet.text.includes("km")) {
		unit = " km";
	}
	return unit
}

//Return tweet text with clickable link
function clickableLink(tweet) {
	var prefix = /\bhttps?:\/\/t.co\/\w+/gi;
    var link = tweet.text.match(prefix);
    var text_with_link = tweet.text.replace(prefix, '<a href="' + link + '">' + link + '</a>');
	return text_with_link;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});
document.querySelector('.table').tsortable()