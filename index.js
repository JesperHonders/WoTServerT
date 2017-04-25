var express = require('express')
var app = express()
var request = require('request')
var path = require('path');
var fs = require('fs')

var heleenSlackURL = 'https://hooks.slack.com/services/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';
var generalSlackURL = 'https://hooks.slack.com/services/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';
var newsSlackURL = 'https://hooks.slack.com/services/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';
var triviaSlackURL = 'https://hooks.slack.com/services/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';
var newsApiKey = '9e5dce43547a4fe0a8b0b875111ff3c2';
var chipIDs = ['AF3E', '8d4b', 'FF28'];

function setLEDColor(importance) {
    request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sdc&d=' + chipIDs[0] + '&td=' + chipIDs[0] + '&c=' + importance, function () {
        request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sqi&d=' + chipIDs[0]);
    });

    request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sdc&d=' + chipIDs[1] + '&td=' + chipIDs[1] + '&c=' + importance, function () {
        request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sqi&d=' + chipIDs[1]);
    });

    request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sdc&d=' + chipIDs[2] + '&td=' + chipIDs[2] + '&c=' + importance, function () {
        request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sqi&d=' + chipIDs[2]);
    });
}

function getNewsArticles(source, sort, amount) {
    request(' https://newsapi.org/v1/articles?source=' + source + '&sortBy='+ sort +'&apiKey=' + newsApiKey, function (error, response, data) {
        var parsedData = JSON.parse(data);
        var articles = parsedData.articles;
        if (articles != undefined) {
            for (var i = 0; i < amount; i++) {
                var message = articles[i].title + ' ' + articles[i].url;
                sendSlackMessage(message, newsSlackURL);
            }
        }
    });
}
//
//function getTriviaQuestion(difficulty){
//
//    request('https://opentdb.com/api.php?amount=1&difficulty=' + difficulty, function (error, response, data) {
//
//        var parsedData = JSON.parse(data);
//        var question = parsedData.results[0].question;
//        var answer = parsedData.results[0].correct_answer;
//        setLEDColor('FF0000');
//        sendSlackMessage(question, triviaSlackURL);
//
//        clearInterval(checkSensorValue);
//
//        setTimeout(function(){
//            startSensorValueCheck();
//            sendSlackMessage(answer, triviaSlackURL);
//        }, 15000);
//    });
//}
//
//getTriviaQuestion('easy');
//google-news - top
//bbc-news  - top
//the-next-web - latest
//techradar - latest

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
var checkSensorValue;
function startSensorValueCheck() {
    checkSensorValue = setInterval(function () {
        getSensorValues();
        var data = sensorValue;

        console.log(data);
        if (data != undefined) {

            if (lastSensorValue != data.value) {
                lastSensorValue = data.value;
                console.log('IT CHANGED');
                if (data.value > 0 && data.value < 21) {
                    getNewsArticles('the-next-web', 'latest', 1);
                } else if (data.value > 20 && data.value < 41) {
                    getNewsArticles('the-next-web', 'latest', 2);
                } else if (data.value > 40 && data.value < 61) {
                    getNewsArticles('the-next-web', 'latest', 3);
                } else if (data.value > 60 && data.value < 81) {
                    getNewsArticles('the-next-web', 'latest', 4);
                } else if (data.value > 80 && data.value < 101) {
                    getNewsArticles('the-next-web', 'latest', 5);
                }
            }
//          STUFF FOR TRIVIA
//            if (lastSensorValue != data.value) {
//                lastSensorValue = data.value;
//                console.log('IT CHANGED');
//                if (data.value > 0 && data.value < 11) {
//                    getTriviaQuestion('easy');
//                } else if (data.value > 10 && data.value < 21) {
//                    getTriviaQuestion('medium');
//                } else if (data.value > 20 && data.value < 30) {
//                    getTriviaQuestion('hard');
//                }
//            }

        }
    }, 2000);
}

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

app.get('/pushdata/:distance/:chipId', function (req, res){
  var distance = req.params.distance;
  var chipId = req.params.chipId;
  fs.readFile('./sensordata.json', function (err, data) {
      if(err) {
        console.log(err);
      }

      var json = JSON.parse(data)
      json.push({distance: distance, chipId : chipId })

      fs.writeFile("./sensordata.json", JSON.stringify(json))
  })
})


app.get('/message', function (req, res) {
    var message = req.query.text;
    var importance = req.query.importance;

    sendSlackMessage(message, generalSlackURL);
    setLEDColor(importance);
});

app.listen(3000, '0.0.0.0' ,function () {
    console.log('Example app listening on port 3000!')
})
