var express = require('express')
var app = express()
var request = require('request')
var path = require('path');

var generalSlackURL = 'https://hooks.slack.com/services/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';
var newsSlackURL = 'https://hooks.slack.com/services/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';
var newsApiKey = '9e5dce43547a4fe0a8b0b875111ff3c2'; 
var chipIDs = ['AF3E', '8d4b', 'FF28'];

function setLEDColor(importance) {
    request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sdc&d=' + chipIDs[0] + '&td=' + chipIDs[0] + '&c=' + importance, function () {
        //remove old messages
        //request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=rdc&d=' + chipIDs[0] + '&td=' + chipIDs[0]);

        //create new message
        request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sqi&d=' + chipIDs[0]);
    });
    
    request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sdc&d=' + chipIDs[1] + '&td=' + chipIDs[1] + '&c=' + importance, function () {
        //remove old messages
        //request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=rdc&d=' + chipIDs[1] + '&td=' + chipIDs[1]);

        //create new message
        request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sqi&d=' + chipIDs[1]);
    });

    request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sdc&d=' + chipIDs[2] + '&td=' + chipIDs[2] + '&c=' + importance, function () {
        //remove old messages
        //request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=rdc&d=' + chipIDs[2] + '&td=' + chipIDs[2]);

        //create new message
        request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sqi&d=' + chipIDs[2]);
    });
}

function getNewsArticles(source, sort) {
    request(' https://newsapi.org/v1/articles?source=' + source + '&sortBy='+ sort +'&apiKey=' + newsApiKey, function (error, response, data) {
        var parsedData = JSON.parse(data);
        //var author = parsedData.source;
        var articles = parsedData.articles;
        console.log(articles);
        if (articles != undefined) {
            for (var i = 0; i < 3; i++) {
                var message = articles[i].title + ' ' + articles[i].url;
                sendSlackMessage(message, newsSlackURL);
            }
        }
    });
}
    
//google-news - top
//bbc-news  - top
//the-next-web - latest
//techradar - latest


//getNewsArticles('google-news', 'top');

var sensorValue;
function getSensorValues() {

    request({
        url: 'https://api.thingspeak.com/channels/260065/fields/1.json?results=1',
        method: 'GET',
        async: false,
    }, function (error, response, data) {
        if (error) {
            console.log(error);
        } else {
            var parsedData = JSON.parse(data);

            var data = {
                value: parsedData.feeds[0].field1,
                created_at: parsedData.feeds[0].created_at
            }
            
            sensorValue = data;
        }
    });
   
}


var lastSensorValue = 0;
setInterval(function(){
    getSensorValues();
    var curDate = new Date().getDate();
    var data = sensorValue;
        
    console.log(data);  
    if(data != undefined){
        
        if (lastSensorValue != data.value && lastSensorValue > 0) {
            lastSensorValue = data.value;
            console.log('IT CHANGED');
            if (data.value > 0 && data.value < 25) {
                console.log('UNDER 25');
                getNewsArticles('google-news', 'top');
            } else if (data.value > 25 && data.value < 50) {
                console.log('ABOVE 25');
                getNewsArticles('bbc-news', 'top');
            } else if (data.value > 50 && data.value < 75) {
                console.log('ABOVE 50');
                getNewsArticles('the-next-web', 'latest');
            } else if (data.value > 75 && data.value < 100) {
                console.log('ABOVE 75');
                getNewsArticles('techradar', 'latest');
            }
        }
    }
}, 5000);

function sendSlackMessage(message, url) {
    request({
        url: url,
        form: '{"text": "' + message + '"}',
        method: 'POST',
        type: 'application/json',
    }, function (error, response, data) {
        if (error) {
            console.log(error);
        } else {
            return data;
        }
    });
}
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/form.html'));
})


app.get('/message', function (req, res) {
    var message = req.query.text;
    var importance = req.query.importance;
    var newsMedium = req.query.medium;
    
    if(newsMedium == 'no-medium'){
            sendSlackMessage(message, generalSlackURL);
    }else{
        getNewsArticles(newsMedium, 'top');
    }
    setLEDColor(importance);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})




