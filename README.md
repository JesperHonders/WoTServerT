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
