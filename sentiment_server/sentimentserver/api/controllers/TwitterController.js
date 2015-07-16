/**
 * TwitterController
 *
 * @description :: Server-side logic for managing twitters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


var CronJob = require('cron').CronJob;
var fs = require('fs');
var exec = require('child_process').exec;

module.exports = {

	readFile: function(success, error){
		
		var moodsToScan = ["RONAmood", "CTmood", "BFLICmood", "CTSTOCKmood", "WALMARTmood", "AMAZONmood", "LOWESmood", "ALIBABAmood", "HDmood", "HBCmood", "SEARSmood"];

		exec('Rscript /home/ubuntu/sentiment.R', function (error, stdout, stderr) {
		  // output is in stdout
		  if(error) return console.log(error);
		  	console.log(stdout);
			moodsToScan.forEach(function(file){
				scanFile(file);
			});
		});

		//scanFile('RONAmood');

		var scanFile = function(context){

			fs.readFile('/' + context + '.txt', 'utf8', function (err,data) {
			  if (err) {
			    return console.log(err);
			  }
			  data = data.replace(/"/g, '');
			  var text = data.split("\n");
			  var moodArray = [];

			  for(var i = 0; i < text.length; i++){

			  	if(text[i]){
			  		moodArray.push(text[i].split(", "));
			  	}
			  	
			  }

			  console.log(moodArray.length);
			  moodArray.forEach(function(mood){

			  	var tweet = {};

			  	tweet.pos = mood[0];
			  	tweet.neg = mood[1];
			  	tweet.sentiment = mood[2];
			  	tweet.date = new Date(mood[4]);
			  	tweet.twitterId = mood[5];
			  	tweet.type = mood[6];
			  	tweet.searchString = mood[7];

			  	Twitter.create(tweet, function(newTweet){
			  		console.log(newTweet);
			  	})

			  })


			});

		}


	}
};

