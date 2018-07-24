var express = require("express");
var router = express.Router({mergeParams: true});
var Event = require("../models/event");
var Subscriber = require("../models/subscriber");
var middleware = require("../middleware");
var moment              = require('moment');



// SUBSCRIBERS NEW
router.get("/new", middleware.isLoggedIn, function(req,res){
      Event.findById(req.params.id,function(err, foundEvent) {
       if (err) {
           console.log(err);
       } else
       {
            res.render("subscribers/new", {event:foundEvent});
           // res.redirect("back");   
       }
    });
});

//SUBSCRIBER CREATE
router.post("/", middleware.isLoggedIn, function(req,res){

   Event.findById(req.params.id,function(err, foundevent) {
       if (err) {
           console.log(err);
           res.redirect("/events");
       } else
       {
            Subscriber.create(req.body.subscriber, function(err, subscriber) {
                
               if (err) {
                    req.flash("error", "Da ist etwas schief gelaufen.");
                    console.log(err);
                }   else {
                    var cDate = new Date();
                    var dDate = new Date(foundevent.deadline);
                    if(moment(cDate).isAfter(dDate) && !req.user.isAdmin){
                        req.flash("error", "Das Anmeldeende für diese Veranstaltung ist bereits erreicht!");
                        //res.redirect("/events/" + foundevent._id);
                        res.redirect("back");  
                    } else {                    
                        //add username and id to subscriber
                        subscriber.id = req.user._id;
                        subscriber.username = req.user.username;
                        //save subscriber
                        subscriber.save();
                        foundevent.subscribers.push(subscriber);
                        foundevent.save();
                        req.flash("success", 'Du hast dich erfolgreich für die Veranstaltung "' + foundevent.title + '" angemeldet!');
                        res.redirect("back"); 
                      // res.redirect("/events#"+foundevent.id);   
                            
                    }
                    

                }
            });
       }
    });
});

//SUBSCRIBER DESTROY ROUTE
router.delete("/:subscriber_id", function(req, res){

    Event.findById(req.params.id,function(err, foundevent) {
        if (err) {
           console.log(err);
           res.redirect("/events");
        } else  {
            var cDate = new Date();
            var dDate = new Date(foundevent.deadline);
            if(moment(cDate).isAfter(dDate) &&  !req.user.isAdmin){
                req.flash("error", "Das Anmeldeende für diese Veranstaltung ist bereits erreicht!");
                res.redirect("back");  
                //res.redirect("/events/" + foundevent._id);
            } else { 
                Subscriber.findByIdAndRemove(req.params.subscriber_id, function(err){
                    if (err) {
                         res.redirect("back");  
                    } else
                    {
                        req.flash("success", 'Du hast dich erfolgreich für die Veranstaltung "' + foundevent.title + '" abgemeldet!');
                        res.redirect("back"); 
                       // res.redirect("/events#"+foundevent.id);   
                    }
                });
            }
        }
    });    
});



module.exports = router;
