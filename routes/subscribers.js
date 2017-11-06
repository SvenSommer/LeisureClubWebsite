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
                        req.flash("error", "Die Anmeldefrist für diese Veranstaltung ist bereits abgelaufen!");
                        res.redirect("/events/" + foundevent._id);
                    } else {                    
                        //add username and id to subscriber
                        subscriber.id = req.user._id;
                        subscriber.username = req.user.username;
                        //save subscriber
                        subscriber.save();
                        foundevent.subscribers.push(subscriber);
                        foundevent.save();
                        
                        req.flash("success", "Du hast dich erfolgreich für " + foundevent.title + " angemeldet!");
                        res.redirect("/events/" + foundevent._id);
                            
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
            console.log("dDate" + dDate);
            if(moment(cDate).isAfter(dDate) &&  !req.user.isAdmin){
                req.flash("error", "Die Anmeldefrist und damit auch Abmeldefrist für diese Veranstaltung ist bereits abgelaufen!");
                res.redirect("/events/" + foundevent._id);
            } else { 
                Subscriber.findByIdAndRemove(req.params.subscriber_id, function(err){
                    if (err) {
                         res.redirect("back");  
                    } else
                    {
                        req.flash("success", "Erfolgreich abgemeldet!");
                        res.redirect("/events/"+ req.params.id);
                    }
                });
            }
        }
    });    
});



module.exports = router;
