# LeisureClub Website
Run a simple and free website to organize events, parties or other happenings with more participants. Easily monitor and inform your subscribers. Let everybody stay in touch and keep an overview of the number of participants.
A Testversion is available here: [LeisureClub](https://leisureclub-demo.herokuapp.com/login).<br>
Register with passphrase ("Codewort"): "User" for User privileges, or "Admin" for Admin privileges

## Installation

A detailed installation instruction is available as a [blogpost on my website](http://robstechlog.com/2017/11/14/run-website-organize-upcoming-events/).

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
* <strong>SITENAME</strong> – The name of your Website. It appears at several locations, e.g. in the navbar.
* <strong>PASSWORDSECRET</strong> - Passphrase to ensure password authentication.
* <strong>MAILADRESS</strong> - Password reset works with a googlemail account. Mailadress is needed.
* <strong>GMAILSERVERPW</strong> - Password reset works with a googlemail account. Password is needed.
* <strong>USERPASSPHRASE</strong> - When registering. User need a passphrase. This gives them access to the member sites with the events.
* <strong>ADMINPASSPHRASE</strong> - Administrators use another passphrase and get additional actions, like delete and edit comments, members, events.








