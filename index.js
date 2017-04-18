var express = require('express')
var app = express()
var request = require('request')
var path = require('path');

var slackURL = 'https://hooks.slack.com/services/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';
var chipIDs = ['AF3E', '8d4b', 'FF28'];

function setLEDColor(importance) {
  for(var i = 0; i < chipIDs.length; i++){
      request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sdc&d='+chipIDs[i]+'&td='+chipIDs[i]+'&c=' + importance, function(){
        //remove old messages
        request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=rdc&d='+chipIDs[i]+'&td='+chipIDs[i]+'');
        
        //create new message
        request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sqi&d='+chipIDs[i]);
    }); 
  }  
    

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
  setLEDColor(importance);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})




