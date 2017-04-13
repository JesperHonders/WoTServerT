var express = require('express')
var app = express()
var request = require('request')
var path = require('path');

var slackURL = 'https://hooks.slack.com/services/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';

function getTestPersonaLoginCredentials(importance) {
 request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sdc&d=AF3E&td=AF3E&c=' + importance, function(){
    request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sqi&d=AF3E');
    //request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=rdc&d=AF3E&td=AF3E');
  });
   request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sdc&d=8d4b&td=8d4b&c=' + importance, function(){
    request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sqi&d=8d4b');
    //request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=rdc&d=8d4b&td=8d4b');
  });
   request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sdc&d=FF28&td=FF28&c=' + importance, function(){
    request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sqi&d=FF28');
    //request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=rdc&d=FF28&td=FF28');
  });
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
  
  sendSlackMessage(message);
  getTestPersonaLoginCredentials(importance);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})




