var express = require('express')
var app = express()
var request = require('request')

function getTestPersonaLoginCredentials(callback) {
  request('https://oege.ie.hva.nl/~palr001/icu/api.php?t=sqi&d=FF28&td=8D4B&c=00FFDF')
}

app.get('/', function (req, res) {
  getTestPersonaLoginCredentials()
  res.send("send Post")
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
