function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	let completed_events = 0;
	let live_events = 0;
	let achievements = 0;
	let miscellaneous = 0;
	let total_tweets = 0;
	let written = 0;
	let firstDate = tweet_array[0].time;
	let lastDate = tweet_array[0].time;

	for (let i = 0; i < tweet_array.length; ++i){
		if (tweet_array[i].source == 'completed_event'){
			completed_events++;
		}
		else if (tweet_array[i].source == 'live_event'){
			live_events++;
		}
		else if (tweet_array[i].source == 'achievement'){
			achievements++;
		}
		else if (tweet_array[i].source == 'miscellaneous'){
			miscellaneous++;
		}
		if (tweet_array[i].written) {
			written++;
		}
		if (tweet_array[i].time < firstDate){
			firstDate = tweet_array[i].time;
		}
		if (tweet_array[i].time > lastDate){
			lastDate = tweet_array[i].time;
		}
		total_tweets++;
	}
	document.querySelectorAll('.completedEvents').forEach(e => e.innerText = completed_events);
	document.querySelectorAll('.completedEventsPct').forEach(e => e.innerText = (100*completed_events/total_tweets).toFixed(2)+'%');
	document.querySelectorAll('.liveEvents').forEach(e => e.innerText = live_events);
	document.querySelectorAll('.liveEventsPct').forEach(e => e.innerText = (100*live_events/total_tweets).toFixed(2) + '%');
	document.querySelectorAll('.achievements').forEach(e => e.innerText = achievements);
	document.querySelectorAll('.achievementsPct').forEach(e => e.innerText = (100*achievements/total_tweets).toFixed(2) + '%');
	document.querySelectorAll('.miscellaneous').forEach(e => e.innerText = miscellaneous);
	document.querySelectorAll('.miscellaneousPct').forEach(e => e.innerText = (100*miscellaneous/total_tweets).toFixed(2) + '%');
	document.querySelectorAll('.written').forEach(e => e.innerText = written);
	document.querySelectorAll('.writtenPct').forEach(e => e.innerText = (100*written/completed_events).toFixed(2) + '%');
	document.getElementById('firstDate').innerText = firstDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
	document.getElementById('lastDate').innerText = lastDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});