function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	let activity_counts = {};
	for (let i = 0; i < tweet_array.length; i++) {
		let type = tweet_array[i].activityType;
		if (type != 'unknown') {
			activity_counts[type] = (activity_counts[type] || 0) + 1;
		}
	}

	let activity_data = [];
	let types = Object.keys(activity_counts);
	for (let i = 0; i < types.length; i++) {
		activity_data.push({activity: types[i], count: activity_counts[types[i]]});
	}
	activity_data.sort((a, b) => b.count - a.count);

	document.getElementById('numberActivities').innerText = activity_data.length;
	document.getElementById('firstMost').innerText = activity_data[0].activity;
	document.getElementById('secondMost').innerText = activity_data[1].activity;
	document.getElementById('thirdMost').innerText = activity_data[2].activity;

	
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activity_data
	  },
	"mark": "bar",
		"encoding": {"x": {"field": "activity", "type": "nominal", "sort": "-y"},
		"y": {"field": "count", "type": "quantitative"}
	}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	let top3 = [activity_data[0].activity, activity_data[1].activity, activity_data[2].activity];

	let distances = [];
	for (let i = 0; i < tweet_array.length; i++) {
		let tweet = tweet_array[i];
		if (top3.indexOf(tweet.activityType) >= 0) {
			distances.push({
				activity: tweet.activityType,
				distance: tweet.distance,
				day: days[tweet.time.getDay()]
			});
		};
	};

	document.getElementById('longestActivityType').innerText = 'bike';
	document.getElementById('shortestActivityType').innerText = 'walk';
	document.getElementById('weekdayOrWeekendLonger').innerText = 'weekends';

	let means = [];
	for (let activityIndex = 0; activityIndex < top3.length; activityIndex++) {
		for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
			let activity = top3[activityIndex];
			let day = days[dayIndex];
			let total = 0;
			let count = 0;
			for (let i = 0; i < distances.length; i++) {
				if (distances[i].activity == activity && distances[i].day == day) {
					total = total + distances[i].distance;
					count = count + 1;
				}
			}
			if (count > 0) {
				means.push({activity: activity, day: day, distance: total / count});
			}
		}
	}

	let distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distances for most tweet activities per day of week",
	  "data": {
	    "name": "activityData"
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "day", "type": "nominal", "sort": days},
	    "y": {"field": "distance", "type": "quantitative"},
		"color": {"field": "activity", "type": "nominal"}
	  }
	};

	let showing_means = false;

	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false}).then(function(result) {
		let chart = result.view;
		chart.insert('activityData', distances).run();

		document.getElementById('aggregate').addEventListener('click', function() {
			let new_data;
			if (showing_means == false) {
				new_data = means;
				showing_means = true;
				this.innerText = 'Show Activities';
			}
			else {
				new_data = distances;
				showing_means = false;
				this.innerText = 'Show Means';
			};
			let changes = vega.changeset();
			changes.remove(function() {return true;});
			changes.insert(new_data);
			chart.change('activityData', changes).run();
		});
		
	});
	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});