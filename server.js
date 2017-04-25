var express = require('express')
var app = express()
var request = require('request')
var path = require('path');
var fs = require('fs');

//PERSONAL SLACK URLS
var heleenSlackURL = 'https://hooks.slack.com/services/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';
var joshSlackURL = 'https://hooks.slack.com/services/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';
var jesperSlackURL = 'https://hooks.slack.com/services/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';

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

function getNewsArticles(source, sort, amount, id) {
    request(' https://newsapi.org/v1/articles?source=' + source + '&sortBy='+ sort +'&apiKey=' + newsApiKey, function (error, response, data) {
        var parsedData = JSON.parse(data);
        var articles = parsedData.articles;
        if (articles != undefined) {
            for (var i = 0; i < amount; i++) {
                var message = articles[i].title + ' ' + articles[i].url;

                if(id == chipIDs[0]){
                    sendSlackMessage(message, heleenSlackURL);
                }else if(id == chipIDs[1]){
                    sendSlackMessage(message, jesperSlackURL);
                }else if(id = chipIDs[2]){
                    sendSlackMessage(message, joshSlackURL);
                }

            }
        }
    });
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
  res.send('Hello');
  fs.readFile('./sensordata.json', function (err, data) {
      if(err) {
        console.log(err);
      }

      var dataToSend = JSON.parse(data)

      dataToSend.push({distance: distance, chipId : chipId, time: new Date().getTime()})
      checkArticle(dataToSend);
      fs.writeFile("./sensordata.json", JSON.stringify(dataToSend))
  })


})

app.get('/message', function (req, res) {
    var message = req.query.text;
    var importance = req.query.importance;

    sendSlackMessage(message, generalSlackURL);
    setLEDColor(importance);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

function checkArticle(data) {
  console.log(data, typeof data, data.length);

  var jsonLength = data.length;
  var minDifference = data[jsonLength - 2].time + 5000;
  var lastValue = data[jsonLength - 1].distance;
  var lastChipID = data[jsonLength - 1].chipId;
  // console.log(json.length);
  if (data[jsonLength - 1].time > minDifference){
          if (lastValue > 0 && lastValue < 21) {
              getNewsArticles('the-next-web', 'latest', 1, lastChipID);
          } else if (lastValue > 20 && lastValue < 41) {
              getNewsArticles('the-next-web', 'latest', 2, lastChipID);
          } else if (lastValue > 40 && lastValue < 61) {
              getNewsArticles('the-next-web', 'latest', 3, lastChipID);
          } else if (lastValue > 60 && lastValue < 81) {
              getNewsArticles('the-next-web', 'latest', 4, lastChipID);
          } else if (lastValue > 80 && lastValue < 101) {
              getNewsArticles('the-next-web', 'latest', 5, lastChipID);
          }
  }
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
