# Javascript - Le film

## Description du projet
Ce projet est une application qui permet de gérer une bibliothèque de films. Les utilisateurs peuvent créer un compte, ajouter des films à leurs favoris et recevoir des notifications par e-mail lorsqu'un nouveau film est ajouté ou lorsqu'un film dans leurs favoris est modifié. Seuls les administrateurs peuvent créer, modifier et supprimer des films.
Ils peuvent également exporter l'ensemble des films dans la base de données au format CSV.
## Fonctionnalités

- Envoi d'un e-mail de bienvenue lorsqu'un utilisateur est créé
- Gestion d'une bibliothèque de films (titre, description, date de sortie, réalisateur)
- Gestion d'une liste de films favoris pour chaque utilisateur
- Notifications par e-mail lorsqu'un nouveau film est ajouté ou lorsqu'un film favori est modifié
- Export CSV de l'ensemble des films dans la BDD via un message broker pour les administrateurs

## Technologies utilisées
- Node.js
- Hapi.js
- Docker
- RabbitMQ
- MySQL
- Nodemailer pour l'envoi d'e-mails
- JWT pour l'authentification
- Schwifty pour l'interaction avec la base de données

## Démarrage du projet

### Prérequis

- Node.js
- npm
- Docker
- RabbitMQ
- MySQL

### Démarrage

1. Clonez le dépôt GitHub
2. Installez les dépendances avec `npm install`
3. Démarrez les conteneurs Docker de base de données et RabbitMQ avec les commandes suivantes : 
- `docker run --name hapi-mysql -e MYSQL_USER=erwab -e MYSQL_PASSWORD=hapi -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -d -p 3308:3306 mysql:8 mysqld --default-authentication-plugin=mysql_native_password`
- `docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management`
4. Démarrez le serveur avec `npm start`

## Choses importantes à savoir

- Lorsque de la connexion, le token JWT est log dans la console.  
- Il faut donc le copier et le coller dans la modale d'autorisation du swagger, précédé de "Bearer ".
Aucune variable d'environnement n'est nécessaire, j'ai choisi de modifier le fonctionnement de l'application pour ne pas utiliser
qu'un seul compte ethereal.email pour l'envoi de mails. On utilise là des comptes temporaires à chaque requêtes.

## Auteurs
- Erwan B.
- Banane G.
- Service R.
- Chat G.
- Github C.
- Stack O.
- Karim G.
- Damien V.