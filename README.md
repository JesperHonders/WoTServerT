##NerdUp

Jesper Honders, Heleen Snoeck en Joshua Onwezen

## Doelgroep

Developers en designers in de webdevelopment branche. 

## Concept

Via de interface kan de gebruiker een bericht plaatsen voor het hele kantoor. 
Aan dit bericht geef je een kleur mee de kleur staat voor de belangrijksgraat van het bericht. Dus als hij rood is word er verwacht dat je hem meteen leest, orangje nog wel vandaag en groen ter informatie. Deze kleur gaat af doordat je het doosje met lampjes op je bureau hebt staan en de message komt binnen via slack. Op deze manier kunnen developers door middel van het lichtje even uit hun code gehaald worden en naar bijv. de vergaderruimte gestuurd worden voor een vergadering!

Naast vergaderen lezen developers veel artikelen. Wij hebben bedacht dat door middel van een nerdbril pakken er een bepaalde hoeveelheid artikelen naar je slack channel gestuurd worden. Wil je dus veel leesmateriaal? Dan moet je de grootste nerdbril pakken en worden er 3 artikelen voor jou om te lezen naar je slack toegestuurd.

### Het doosje
We hebben een doosje gekregen en hieraan hebben wij led lampjes een bewegingssensor en een geluidssensor aan gehangen. 

In de foto hieronder kun je zien dat zodra het lampje gaat branden er verschillende boodschappen zijn per kleur: Zie afbeelding hieronder:

Het doosje
![alt tag](screenshots/doosje.JPG) 

### De interface
Via de interface kan de gebruiker een bericht plaatsen voor het hele kantoor. 
Aan dit bericht geef je een kleur mee de kleur staat voor de belangrijksgraat van het bericht (zie afbeelding doosje). Deze kleur gaan vervolgens af bij alle doosjes. Iedereen weet dan of hij het bericht meteen moet lezen of niet. Daarnaast krijg je het daadwerkelijke bericht door via slack. 
Op deze manier kan bijv. aangegeven worden dat er nu een vergadering is en dat ze daar nu heen moeten.

De interface
![alt tag](screenshots/interface.png) 

### Vrije tijd
Als de gebruikers vrije tijd hebben of een pauze inlassen, gaan veel developers en designers artikelen lezen over hun vakgebied. Dit process wilde wij optimaliseren. Vaak is het een gedoe en weet je niet op welke site je moet beginnen met kijken. Hierdoor hebben wij bedacht dat je alleen maar hoeft aan te geven hoeveel je wil nerden. Dit geef je aan door een bril van het rek te pakken. Hoe hoger het level hoe mee artikelen naar je toe worden gestuurd in slack. Zodra je een bril hebt gepakt hoor een een Bliebje als feedback dat het is geregisreerd en de artikelen onderweg zijn. 

Nerd-up
![alt tag](screenshots/Nerd-up.JPG) 


#De werking van de applicatie

Flow
![alt tag](screenshots/flowchart3.jpg) 

## Werking Berichten


#### handler.js
In handler.js word een http request aangemaakt die de url message (bericht) en de importance (kleur lampjes) meestuurd naar de backend (/message). 

``` javascript
var handler = {
    submitMessage: function(){
        var form = document.querySelector('form');
        form.addEventListener('submit', function(e){
            e.preventDefault();
           
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == XMLHttpRequest.DONE) {
                    if (request.status == 4) {
                        console.log('result')
                    }
                }
            };
            
            var message = document.querySelector('input[type*="text"]').value;
            var importance = document.querySelector('input[name="color"]:checked').value;
            console.log(importance);
            request.open("GET", "/message?text=" + message + "&importance=" + importance, true);
            request.send();
            
            document.querySelector('.message-sent').classList.add('show');
        });
    },
}
```
### Server.js
Vervolgens word in server.js een request naar /message afgehandelt en worden het bericht en importance als variable opgeslagen en uitgestuurd naar de server van slack en de server van de arduino in beide weer een HTTP request. 

``` javascript
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

```

Er staan 2 functies in sendmessage 1 om de message naar slack te sturen en een functie om de kleuren van de arduino te zetten. 

``` javascript
var generalSlackURL = 'https://hooks.slack.com/services/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';

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

```

Er word een array aangemaakt met de chipIDs[0].
Daarna stuur je een request uit met de kleur van het lampje die je hebt ingevuld.
(Hij zet de kleur op het kastje en daarn op zichzelf).


``` javascript
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
```

# NerdUp Werking

Doormiddel van de nodeMCU in combinatie met een afstandsensor kunnen wij uitlezen welke bril er wordt gepakt bij NerdUp.
Zodra de nodeMCu detecteerd dat er een bril is gepakt, stuurt de nodeMCU een HTTP request naar onze eigen server. Op de server wordt er uitgelezen welke bril is er gepakt.

In de nodeMCU gebruiken we de volgende code om de afstand uit te lezen:

``` C++

void readDistance() {
  long duration, distance;
  digitalWrite(TRIGGER, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIGGER, HIGH);
  delayMicroseconds(10);

  digitalWrite(TRIGGER, LOW);
  duration = pulseIn(ECHO, HIGH);
  distance = (duration/2) / 29.1;

  if (distance < 40) {
    writeThingSpeak(distance);
    playSong();
  }
  delay(1000); // ThingSpeak will only accept updates every 15 seconds.
}

```
Deze code is vrij standaard. Ook lees je hier 2 functies die worden aangeropen. writeThingSpeak() en playSong(), writeThingSpeak() wordt gebruikt om zodra de afstandsensor getriggerd word onder de 40 centimeter om de afstand door te sturen naar onze eigen server. playSong() wordt gebruikt om een feedback geluidje te laten horen.


## Communicatie met onze server

Voor deze applicatie gebruiken we onze eigen node server. We zijn begonnen met een thingspeak channel, maar deze kon maar 1x in de 15seconden een update aan en was heel erg traag. Daarom hebben we besloten zelf een json bij te houden op onze eigen server, dit heeft als voordeel dat de applicatie bijna instant werkt inplaats van een delay van 4 seconden en we kunnen zelf de data vormgeven op onze eigen manier.

als writeThingSpeak() wordt aangeroepen, wordt de volgende code uitgevoerd:

``` C++
void writeThingSpeak(int distance) {
  Serial.println(distance);
  Serial.println("running client connect");
  HTTPClient http;
  String reqString = "http://188.226.148.132/pushdata/";
  reqString += String(distance);
  reqString += "/";
  reqString += String(chipID);
  // Serial.println(reqString);
  http.begin(reqString);
  int status = http.GET();
  Serial.println(status);
}
```

Hier wordt een http request gedaan naar onze eigen server naar de route pushdata/"Afstand"/"sensorID".
Deze request wordt in de server.js opgevangen als volgt:

``` javascript
app.get('/pushdata/:distance/:chipId', function (req, res){
  var distance = req.params.distance;
  var chipId = req.params.chipId;
  res.send('pushed distance: '+distance+" and chipId: "+chipId);
  fs.readFile('./sensordata.json', function (err, data) {
      if(err) {
        console.log(err);
      } else {
        var dataToSend = JSON.parse(data)

        dataToSend.push({distance: distance, chipId : chipId, time: new Date().getTime()})
        checkArticle(dataToSend);
        fs.writeFile("./sensordata.json", JSON.stringify(dataToSend))
      }
  })


})

```

De distance en chipId worden uit de url gelezen. de sensordata.json wordt geopent en geparsed. Daarna worden de nieuwe values toegevoegd en de file wordt weer gesaved.

Hier lees je ook dat de checkArticle() wordt aangeroepen. Dat is de volgende stap in het proces. In deze functie lezen we de laatste 2 objecten (afstanden en id's) van de json uit, testen we of er niet gespammed wordt, en checken we wat voor artikelen we gaan sturen:

``` javascript

function checkArticle(data) {
  console.log(data, typeof data, data.length);

  var jsonLength = data.length;
  var minDifference = (data.hasOwnProperty("time")) ? data[jsonLength - 2].time + 5000 : 0;
  var lastValue = data[jsonLength - 1].distance;
  var lastChipID = data[jsonLength - 1].chipId;
  // console.log(json.length);
  if (data[jsonLength - 1].time > minDifference){
          if (lastValue > 0 && lastValue < 17) {
              getNewsArticles('the-next-web', 'latest', 1, lastChipID);
              setLEDColor('000080');
          } else if (lastValue > 17 && lastValue < 27) {
              getNewsArticles('the-next-web', 'latest', 2, lastChipID);
              setLEDColor('000080');
          } else if (lastValue > 27 && lastValue < 40) {
              getNewsArticles('the-next-web', 'latest', 3, lastChipID);
              setLEDColor('000080');
          }
  }
}


```

Er worden hier weer 2 functies aangeroepen om het proces af te maken: getNewsArticles() en setLEDColor(). SetLEDColor gebruiken we om nog een extra feedback te geven dat de artikelen zijn gestuurd door de ledjes op het doosje te laten branden. En in getNewsArticles doen we 2 api calls naar zowel de newsApi als naar slack:

``` javascript

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
                }else if(id == chipIDs[2]){
                    sendSlackMessage(message, joshSlackURL);
                }

            }
        }
    });
}

```

Er wordt hierboven in de code een call gedaan naar newsapi.org daaruit wordt een object opgehaald, daarvan worden de articles names en url's uit gheaald. en deze worden doorgestuurd naar sendSlackMessage() die er als volgt uitziet:  

``` javascript

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

```

De slack berichten worden naar een specifiek channel gestuurd. Dit staat hardcoded in de code aangezien er een webhook aangemaakt moest worden via de slack API. Op basis van de chipID wordt er naar het juiste channel gepost.

```
var jesperSlackURL = 'https://hooks.slack.com/services/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';

```


er wordt hier een post call gestuurd naar in dit geval de slack api. met daarin de article title en url van de vorige functie. En zo is het NerdUp proces compleet
