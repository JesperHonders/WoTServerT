var express = require('express')
var app = express()
var request = require('request')

function getTestPersonaLoginCredentials(callback) {
  request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sqi&d=FF28&td=8D4B&c=00FFDF')
}

function sendSlackMessage(){
    request({
        url: 'https://hooks.slack.com/services/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',
        form: '{"text": "NU MOET HET LICHTJE BRANDEN"}',
        method: 'POST',
        type: 'application/json',
    }, function (error, response, data) {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
            return data;
            //res.send(data);
        }
    });
}

app.get('/', function (req, res) {
  getTestPersonaLoginCredentials()
  sendSlackMessage();
  res.send("send Post")
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})




