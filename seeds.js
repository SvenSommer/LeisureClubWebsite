var mongoose = require("mongoose");
var Event = require("./models/event");
var Comment = require("./models/comment");

var dataEvents = [
    {   
        no : "1", 
        title : "Club Wandertag", 
        image : "http://www.steinhuder-meer.de/f5-edit/ups/www.steinhuder-meer.de/tb_artikel/image/wandern510.jpg", 
        description : "Heute machen wir sozusagen mal eine geschichtliche Tour durch die Region. Wir beginnen in Garzin und durchstöbern die liebevoll zusammengetragen Exponate des DDR & Nostalgie-Museums von Rene Schmidt und anschließend wandern wir zur Pyramide Garzau. Dort machen wir dann eine kleine Picknickpause (jeder versorgt sich selbst) und schauen uns den derzeitigen Zustand der wiedererbauten Pyramide und des Schlossgarten an. Anschließend geht es wieder zurück zu unseren PKW´s Strecke gesamt ca. 10 - 12 km und einfach zu laufen.", 
        place : " Weitere Infos folgen noch!", 
        meetingpoint : "Garzin Kirche", 
        date : "08.12.2017", 
        time : "12:00", 
        deadline : "28.11.2017", 
        fee : "0 €"
    },
    {   
        no : "2", 
        title : "Bosseln", 
        image : "http://ostfriesland-bilder.de/images/bosseln.jpg", 
        description : "So, dann werden wir mal die Saison 2017/2018 einläuten, denn Bosseln ist ja genau der Freizeitsport für die kalte, trübere Jahreszeit.\r\nWie immer treffen wir uns am Landgasthof zum Mühlenteich und zwei Teams treten gegeneinander (nicht wirklich) an. Wir sorgen für die passenden Getränke und ihr für gute Stimmung!", 
        place : "Landgasthof zum Mühlenteich in Eggersdorf",
        meetingpoint : "Landgasthof zum Mühlenteich in Eggersdorf", 
        date : "2017-12-15", 
        deadline : "2017-12-01", 
        fee : "3 €"
    },
    {   
        no : "3", 
        title : "Konzert in der Schlosskirche", 
        image : "http://ais.badische-zeitung.de/piece/03/7c/e5/0b/58516747.jpg", 
        description : "Johann Strauß und seine komponierenden Zeitgenossen Es erwarten Sie die schönsten Melodien der Musikwelt des 19. Jahrhunderts von Johann Strauß, dem „lachenden Genius Wiens“, wie ihn Richard Strauss einst nannte, über die Musik seiner größten Antipoden und doch seiner Bewunderer, Richard Wagner und Johannes Brahms, bis zu Jacques Offenbach, dem musikalischen Schöpfer des Cancan. Es spielen für Sie: Prof. Alexander Vitlin, Piano, Kapellmeister der Staatsoper Berlin, Konrad Other, Violine, 1. Konzertmeister der Komischen Oper Berlin H.-J. Scheitzbach, Violoncello, Solocellist des Berliner Virtuosen Ensembles, der Sie mit gekonnter und spritziger Moderation durch den Abend führt. Sie werden wieder vor dem Konzert und in der Pause von den ehrenamtlichen Helfern versorgt, damit Sie das Konzerthaus rundum zufrieden verlassen können.", 
        place : " Schlosskirche Altlandsberg", 
        meetingpoint : " Schlosskirche Altlandsberg", 
        date : "2017-12-15", 
        deadline : "2017-12-10", 
        fee : "3 €"
        
    },
    {   
        no : "4", 
        title : "Boldern", 
        image : "http://www.fitzrocks.de/uploads/tx_templavoila/bg_03.jpg", 
        description : "Hallo liebe Kletterinteressierte!\r\n\r\nWillkommen bei BoulderworX, der Boulderhalle die für jeden Geschmack etwas zu bieten hat. Doch was genau ist Bouldern eigentlich? Bouldern ist  Klettern ohne Seil bis zu einer Höhe, aus der man noch abspringen kann. Zur Sicherheit landet man auf dicken Matten.\r\n\r\nUnser Angebot ist für Profis, Bouldereinsteiger und  auch für Kinder interessant.", 
        place : "Kletterhalle Berlin", 
        meetingpoint : "S-Bahnhof Tiergarten", 
        date : "2018-02-01", 
        deadline : "2018-01-15",
        fee : "3 €"
    }
    ]

function seedDB(){
    //Remove all Events
    Event.remove({}, function(err){
        if (err) {
            console.log(err);
        }
       /* else{
            console.log("removed all events");
             //add a few events
            dataEvents.forEach(function(seed){
                Event.create(seed, function(err,event){
                    if (err) {
                        console.log(err);
                    }
                    else{
                        console.log("Added a Event");
                        //create a comment
                        Comment.create(
                        {
                            text: "Oh da bin ich dabei! Das letzte mal war es richtig gut!",
                            author:"Bernd"
                        }, function(err, comment){
                            if (err) {
                                console.log(err);
                            } else {
                                event.comments.push(comment);
                                event.save();
                                console.log("Created new comment");
                            }
                            
                        });
                    }
                });
            });
        }*/
    });
   
    
}

module.exports = seedDB;