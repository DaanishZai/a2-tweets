class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.toLowerCase().includes("completed") || this.text.toLowerCase().includes("posted")){
            return 'completed_event';
        }
        else if (this.text.toLowerCase().includes('live')){
            return 'live_event';
        }
        else if (this.text.toLowerCase().includes('achieved')){
            return 'achievement';
        }
        else {
            return 'miscellaneous';
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (this.source != 'completed_event') {
            return false;
        }
        return this.text.includes(' - ');
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        let text = this.text.split(' - ').slice(1).join(' - ');
        text = text.replace(/https?:\/\/\S+/g, '');
        text = text.replace(/#Runkeeper/gi, '');
        return text.trim()
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        let parsed = this.text.split(' ')
        for (let i =0; i < parsed.length; i++){
            if (parsed[i] == 'km' || parsed[i] == 'mi') {
                return parsed[i + 1];
            }
        }

        return "unknown";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        let parsed = this.text.split(' ');
        for (let i = 0; i < parsed.length; i++) {
            if (parsed[i] == 'km') {
                return parseFloat(parsed[i - 1]) / 1.609;
            }
            if (parsed[i] == 'mi') {
                return parseFloat(parsed[i - 1]);
            }
        }
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        let link = "";
        let words = this.text.split(' ');
        for (let i = 0; i < words.length; i++) {
            if (words[i].indexOf('http') == 0) {
                link = words[i];
                break;
            }
        }

        let c = this.writtenText;

        if (link != "") {
            c = c + ' <a href="' + link + '">' + link + '</a>';
        }

        return '<tr><th scope="row">' + rowNumber + '</th><td>' + this.activityType + '</td><td>' + c + '</td></tr>';
    }
}