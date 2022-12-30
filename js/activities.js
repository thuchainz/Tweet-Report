function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//Create array of activities to find top three
	var activities = tweetActivities(tweet_array);
	var first = activities[0]["activityType"];
	var second = activities[1]["activityType"];
	var third = activities[2]["activityType"];

	//Update number of activities and top three
	$('#numberActivities').text(activities.length);
	$('#firstMost').text(first);
	$('#secondMost').text(second);
	$('#thirdMost').text(third);

	//Create array of distances and update longest/shortest/day
	var distances = topThreeDistances(tweet_array, first, second, third);
	$('#longestActivityType').text("bike");
	$('#shortestActivityType').text("walk");
	$('#weekdayOrWeekendLonger').text("weekends");

	//Display either all activities or means
	buttonToggle();

	//Visualize number of tweets containing each type of activity
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activities
	  },
	  "mark": "circle",
	  "encoding": {
		"x": {
			"field": "activityType",
			"type": "ordinal",
			"sort": "-y"
		},
		"y": {
			"field": "count",
			"type": "quantitative",
			"scale": {
				"domain": [0, 5000],
				"type": "symlog"
			}
		}
	  }
    };
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//Visualize the distances of three most-tweeted activities by the day of the week
	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
		  "values": distances
		},
		"width" : 200,
		"mark": "circle",
		"encoding": {
		  "x": {
			  "field": "day",
			  "type": "nominal",
			  "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			  "axis": {"title": "time (day)"}
		  },
		  "y": {
			  "field": "distance",
			  "type": "quantitative",		  
		  },
		  "color": {
			"field": "activityType",
			"type": "nominal",
		  }
		}
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	//Visualize the average distances of the three most-tweeted activities by the day of the week
	distance_vis_aggregated_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
		  "values": distances
		},
		"width" : 200,
		"mark": "circle",
		"encoding": {
			"x": {
			  "field": "day",
			  "type": "nominal",
			  "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			  "axis": {"title": "time (day)"}
			},
			"y": {
			  "aggregate": "average",
			  "field": "distance",
			  "type": "quantitative",
			  "axis": {"title": "mean of distance"}
		  	},
			"color": {
			"field": "activityType",
			"type": "nominal",
		  	}
		}
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});
}

//Create map of the number of tweets containing each acitvity type
//Return sorted array
function tweetActivities(tweet_array) {
	let activity_map = new Map();
	tweet_array.forEach(function(tweet) {
		if (tweet.activityType != "unknown" && !tweet.activityType.includes(".") && !tweet.activityType.includes(":")) {
			activity_map.set(tweet.activityType, activity_map.get(tweet.activityType) + 1 || 1);
		}
	});
	activity_map = new Map([...activity_map].sort((a, b) => b[1] - a[1]));
	
	var activity_array = [];
	activity_map.forEach(function(value, key) {
		activity_array.push({"activityType": key, "count": value});
	});
	return activity_array;
}

//Create array of tweets in the top three activity types, the distances, and the weekdays
function topThreeDistances(tweet_array, first, second, third) {
	var top_three_distances = [];
	var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	tweet_array.forEach(function(tweet) {
		if (tweet.activityType == first) {
			top_three_distances.push({"activityType": tweet.activityType, "distance": tweet.distance, "day": weekdays[tweet.time.getDay()]});
		}
		else if (tweet.activityType == second) {
			top_three_distances.push({"activityType": tweet.activityType, "distance": tweet.distance, "day": weekdays[tweet.time.getDay()]});
		}
		else if (tweet.activityType == third) {
			top_three_distances.push({"activityType": tweet.activityType, "distance": tweet.distance, "day": weekdays[tweet.time.getDay()]});
		}
	});
	return top_three_distances;
}

//Toggle button between show all and show means
function buttonToggle() {
	var show_means = false;
	$('#distanceVis').show();
	$('#distanceVisAggregated').hide();
	
	$('#aggregate').click(function() {
		if(show_means) {
			show_means = false;
			$('#aggregate').text("Show means");
			$('#distanceVis').show();
			$('#distanceVisAggregated').hide();
		}
		else {
			show_means = true;
			$('#aggregate').text("Show all activities");
			$('#distanceVis').hide();
			$('#distanceVisAggregated').show();
		}
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});