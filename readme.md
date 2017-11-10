# LeisureClub Website
A website for elderly/seniors to create and subscribe to events.
A Testversion is available here: [LeisureClub](https://serene-sierra-20655.herokuapp.com/).<br>
Register with passphrase ("Codewort"): "Sommerblume"



## Installation

Clone this repository:
````
git clone https://github.com/SvenSommer/LeisureClubWebsite.git
````

Install dependencies:
````
npm install
````

An mongodb Database is needed. 
See intall instructions (here)[http://mongodb.github.io/node-mongodb-native/2.0/getting-started/installation-guide/]

## Configuration

Some enviroment variables are needed:

* <strong>DATABASEURL</strong> - URL to the databse  default:mongodb://localhost/leisureclub 
* <strong>PASSWORDSECRET</strong> - Passphrase to ensure password authentication.
* <strong>MAILADRESS</strong> - Password reset works with a googlemail account. Mailadress is needed.
* <strong>GMAILSERVERPW</strong> - Password reset works with a googlemail account. Password is needed.
* <strong>USERPASSPHRASE</strong> - When registering. User need a passphrase. This gives them access to the member sites with the events.
* <strong>ADMINPASSPHRASE</strong> - Administrators use another passphrase and get additional actions, like delete and edit comments, members, events.








