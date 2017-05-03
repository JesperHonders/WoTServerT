##Doelgroep

Nerds op het werk. Developers gebruiken vaak slack, daarom gaan we hier iets mee doen! 
Wat doen nerds op het werk? Programmeren natuurlijk. Daarnaast lezen de meeste nerds echter veel artikelen en vergaderen ze ook zo nu en doen.

##Concept

Via de interface kan de gebruiker een bericht plaatsen voor het hele kantoor. 
Aan dit bericht geef je een kleur mee de kleur staat voor de belangrijksgraat van het bericht. Dus als hij rood is word er verwacht dat je hem meteen leest, orangje nog wel vandaag en groen ter informatie. Deze kleur gaat af doordat je het doosje met lampjes op je bureau hebt staan en de message komt binnen via slack. Op deze manier kunnen developers door middel van het lichtje even uit hun code gehaald worden en naar bijv. de vergaderruimte gestuurd worden voor een vergadering!

Naast vergaderen lezen developers veel artikelen. Wij hebben bedacht dat door middel van een nerdbril pakken er een bepaalde hoeveelheid artikelen naar je slack channel gestuurd worden. Wil je dus veel leesmateriaal? Dan moet je de grootste nerdbril pakken en worden er 3 artikelen voor jou om te lezen naar je slack toegestuurd.

De interface
![alt tag](screenshots/interface.png) 

##De werking
![alt tag](screenshots/flowchart.jpg) 

##File structuur

|--Server IOT
|	|--node_moduls
|   |--public
|   	|--js
|			|--app.js
|			|--handler.js
|		|--style
|			|--style.js
|			|--script.js
|		|--form.html  
|   |--screenshots
|   |--server.js
|   |--package.json
|   |--README.md
```

In handler.js word een http request aangemaakt die de url message (bericht) en de importance (kleur lampjes) meestuurd naar de backend (/message). 
Vervolgens word in index.js een de request naar /message afgehandelt en worden het bericht en importance als variable opgeslagen en uitgestuurd naar de server van slack en de server van de arduino in beide weer een HTTP request. 



##Doelgroep

Developers en designers in de webdevelopment branche. 

##Concept

Developers en designers maken tegenwoordig veel gebruik van Slack. 
Slack is het communicatie platform voor developers/designers. 

###Het doosje
We hebben een doosje gekregen en hieraan hebben wij led lampjes een bewegingssensor en een geluidssensor aan gehangen. 

In de foto hieronder kun je zien dat zodra het lampje gaat branden er verschillende boodschappen zijn per kleur: Zie afbeelding hieronder:

FOTO DOOSJE

###De interface
Via de interface kan de gebruiker een bericht plaatsen voor het hele kantoor. 
Aan dit bericht geef je een kleur mee de kleur staat voor de belangrijksgraat van het bericht (zie afbeelding doosje). Deze kleur gaan vervolgens af bij alle doosjes. Iedereen weet dan of hij het bericht meteen moet lezen of niet. Daarnaast krijg je het daadwerkelijke bericht door via slack. 
Op deze manier kan bijv. aangegeven worden dat er nu een vergadering is en dat ze daar nu heen moeten.

###Vrije tijd
Als de gebruikers vrije tijd hebben of een pauze inlassen, gaan veel developers en designers artikelen lezen over hun vakgebied. Dit process wilde wij optimaliseren. Vaak is het een gedoe en weet je niet op welke site je moet beginnen met kijken. Hierdoor hebben wij bedacht dat je alleen maar hoeft aan te geven hoeveel je wil nerden. Dit geef je aan door een bril van het rek te pakken. Hoe hoger het level hoe mee artikelen naar je toe worden gestuurd in slack. Zodra je een bril hebt gepakt hoor een een Bliebje als feedback dat het is geregisreerd en de artikelen onderweg zijn. 

FOTO REK

##De werking 

AFBEELDING FLOW 



####handler.js
In handler.js word een http request aangemaakt die de url message (bericht) en de importance (kleur lampjes) meestuurd naar de backend (/message). 

```
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
###Server.js
Vervolgens word in server.js een request naar /message afgehandelt en worden het bericht en importance als variable opgeslagen en uitgestuurd naar de server van slack en de server van de arduino in beide weer een HTTP request. 

```
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

```

var generalSlackURL = 'https://hooks.slack.com/services/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';

function sendSlackMessage(message, url) {
    request({
        url: url,
        form: '{"text": "' + message + '"}',
        method: 'POST', // een post want je gaat iets poste op de slack server?
        type: 'application/json',
    }, function (error, response, data) {
        if (error) {
            console.log(error);
        } else {
            return data;
        }
    });
}
app.use(express.static(__dirname + '/public')); // hier geeft hij een folder aan 

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/form.html')); // open deze pagina
})

```


Er word een array aangemaakt met de chipIDs[0].
Daarna stuur je een request uit met de kleur van het lampje die je hebt ingevuld.
(Hij zet de kleur op het kastje en daarn op zichzelf).


```
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
