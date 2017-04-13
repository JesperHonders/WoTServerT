var express = require('express')
var app = express()
var request = require('request')
var path = require('path');

var slackURL = 'https://hooks.slack.com/services/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';

function getTestPersonaLoginCredentials(callback) {
//  request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sqi&d=FF28&td=8D4B&c=00FFDF')
}

function sendSlackMessage(message){
    request({
        url: slackURL,
        form: '{"text": "'+message+'"}',
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
  console.log(req.query);
  //sendSlackMessage(message);
  getTestPersonaLoginCredentials();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})




