# SAM - Sans Accident Mortel - Cap projet ESIEA 2020-2021

## Présentation
<p>SAM est un projet de fin d'étude réalisé en 5ème année pour deux étudiants Skema</p>
<p>Nous avons réaliser le prototype d'une application mobile qu'ils ont imaginés. Cette dernière doit fonctionner sur Android et IOS</p>
<p>L'application permet au client de contacter un chauffeur, à l'instar d'Uber, pour le ramener chez lui.

En effet, si une personne en soirée n'est plus en état de conduire sa voiture pour rentrer, elle peut contacter un <b>SAM</b> qui viendra sur place à vélo.
Le SAM met son vélo dans le coffre de la voiture et reconduit la personne chez elle. Cette application sera déployée dans une ville au départ.</p>

Note : Le client ne peux pas choisir le chauffeur, la recherche notifie le SAM le plus proche automatiquement.

### Membres du projet
- Stephen Sakovitch
- Theo Machon
- Florian Pinsard
- Vincent Faury
- Morgan Jully

## Technologies utilisées
- <b>Carte</b> : API Google maps
- <b>Framework mobile</b> : Ionic
- <b>Backend</b> : NodeJS - Mysql - Sequelize (ORM)
- <b>Connunication temps réel client/serveur</b> : Socket.io

Video demonstration de l'application SAM :  https://drive.google.com/file/d/1DLY07wa37adLieixMX44s-DohJ4v0mWk/view?usp=sharing

## Ecran Connexion / S'inscrire / Profil
<div>
<img style="float:left;" height="616" width="300" src="https://raw.githubusercontent.com/carage34/SAM/master/images/login.PNG">
<img style="float:left;" height="616" width="300" src="https://raw.githubusercontent.com/carage34/SAM/master/images/register.PNG">
<img style="float:left;" height="616" width="300" src="https://raw.githubusercontent.com/carage34/SAM/master/images/profil.PNG">
</div>

## Ecran Accueil Client / Chauffeur
<div>
<img style="float:left;" height="616" width="300" src="https://raw.githubusercontent.com/carage34/SAM/master/images/ecran_client_chauffeur.PNG">
<img style="float:left;" height="616" width="300" src="https://raw.githubusercontent.com/carage34/SAM/master/images/ecran_chauffeur.PNG">
</div>
Le chauffeur peut se déclarer en ligne ou hors ligne.<br/>
Cela aura pour effet de faire apparaitre ou non sa position sur la carte du client en temps réel (drapeau ici)
<p>En cliquant dessus le client voit à quel distance il est du chauffeur</p>

## Ecran Recherche
<img height="616" width="300" src="https://raw.githubusercontent.com/carage34/SAM/master/images/recherche.PNG">
<i><legend>Recherche avec autocompletion</legend></i>

## Ecran Attente client / Notification chauffeur
<div>
<img style="float:left;" height="616" width="300" src="https://raw.githubusercontent.com/carage34/SAM/master/images/attente_sam.PNG">
<img style="float:left;" height="616" width="300" src="https://raw.githubusercontent.com/carage34/SAM/master/images/course_chauffeur.PNG">
</div>

## Ecran Chauffeur vers le client
<div>
<img style="float:left;" height="616" width="300" src="https://raw.githubusercontent.com/carage34/SAM/master/images/start_course_client.PNG">
<img style="float:left;" height="616" width="300" src="https://raw.githubusercontent.com/carage34/SAM/master/images/start_course_chauffeur.PNG">
</div>

## Ecran Chauffeur conduit le client à son domicile
<div>
<img style="float:left;" height="616" width="300" src="https://raw.githubusercontent.com/carage34/SAM/master/images/chauffeur_arrived_client.PNG">
<img style="float:left;" height="616" width="300" src="https://raw.githubusercontent.com/carage34/SAM/master/images/course_start_client.PNG">
</div>

## Ecran Chat instantané Client / Chauffeur
<div>
<img style="float:left;" height="616" width="300" src="https://raw.githubusercontent.com/carage34/SAM/master/images/chat.PNG">
</div>


