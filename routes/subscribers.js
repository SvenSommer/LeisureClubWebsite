var express = require("express");
var router = express.Router({mergeParams: true});
var Event = require("../models/event");
var Subscriber = require("../models/subscriber");
var middleware = require("../middleware");



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
            });
       }
    });
});
//action="/events/59ff8ea38c3efd712f11300e/subscribers/59ff8eab8c3efd712f11300f/?_method=DELETE"
///        events/59ff8ea38c3efd712f11300e/comments   /59ffa6cefc9d9772c7a1d70c/?_method=DELETE
//SUBSCRIBER DESTROY ROUTE
router.delete("/:subscriber_id", function(req, res){
    Subscriber.findByIdAndRemove(req.params.subscriber_id, function(err){
     if (err) {
         res.redirect("back");  
     } else
     {
         req.flash("success", "Erfolgreich abgemeldet!");
         res.redirect("/events/"+ req.params.id);
     }
      
    });
});



module.exports = router;
