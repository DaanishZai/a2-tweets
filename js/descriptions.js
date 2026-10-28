let written_save = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].written) {
			written_save.push(tweet_array[i]);
		}
	}
}

function addEventHandlerForSearch() {
	document.getElementById('textFilter').addEventListener('input', function() {
		let curr = this.value;
		let table = document.getElementById('tweetTable');
		document.getElementById('searchText').innerText = curr;

		if (curr == '') {
			table.innerHTML = '';
			document.getElementById('searchCount').innerText = 0;
			return;
		};

		let rows = '';
		let count = 0;
		for (let i = 0; i < written_save.length; i++) {
			if (written_save[i].writtenText.toLowerCase().includes(curr.toLowerCase())){
				count = count + 1;
				rows = rows + written_save[i].getHTMLTableRow(count);
			}
		}

		table.innerHTML = rows;
		document.getElementById('searchCount').innerText = count;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});