##Concept
Je kan via de interface een bericht plaatsen voor het hele kantoor. 
Aan dit bericht geef je een kleur mee de kleur staat voor de belangrijksgraat van het bericht. Dus als hij rood is word er verwacht dat je hem meteen leest, orangje nog wel vandaag en groen ter informatie. Deze kleur gaat af doordat je het doosje met lampjes op je bureau hebt staan en de message komt binnen via slack. 

De interface
![alt tag](https://github.com/heleensnoeck/iot_her/tree/master/week%201/donderdag/screenshots/interface.png) 

##De werking
![alt tag](https://github.com/heleensnoeck/iot_her/tree/master/week%201/donderdag/screenshots/flowchart.jpg) 

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
|   |--index.js
|   |--package.json
|   |--README.md
```

In handler.js word een http request aangemaakt die de url message (bericht) en de importance (kleur lampjes) meekrijgt. 
Vervolgens word in index.js een request gemaakt naar /message daar worden het bericht en importance als variable opgeslagen en uitgestuurd naar de server van slack en de server van de arduino. 
