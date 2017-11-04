
var express = require("express");
var router = express.Router();
var Event = require("../models/event");
var middleware = require("../middleware");
// ===================================
// EVENT ROUTES
// ===================================

//INDEX - show all events
router.get("/", function(req, res){
    
    Event.find({},function(err, events){
        if(err){
            console.log(err);
        }
        else {
            res.render("events/index", {events: events});
        }
    });
});

//CREATE - add new event to DB
router.post("/", middleware.isLoggedIn, function(req,res){
    
   // req.body.event.body = req.sanitize(req.body.event.body);
    
    var title = req.body.title;
    var image =  req.body.image;
    var description =req.body.description;
    var place =req.body.place;
    var meetingpoint =req.body.meetingpoint;
    var date =req.body.date;
    var time =req.body.time;
    var deadline =req.body.deadline;
    var subscribers =req.body.subscribers;
    var fee =req.body.fee;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    console.log("time=" + time);
    var newEvent = {
        title : title,
        author: author,
        image: image,
        description : description,
        place : place,
        meetingpoint : meetingpoint,
        date : date,
        time : time,
        deadline : deadline,
        subscribers : subscribers,
        fee : fee
        };
    
    Event.create(newEvent, function(err, newlyCreated){
       if(err){
           console.log(err);
       } 
       else {
             res.redirect("/events");
       }
    });
    

});

//NEW - show form to create Event
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("events/new"); 
});



//SHOW - shows more info abaut one event
router.get("/:id", function(req, res) {
    Event.findById(req.params.id).populate("comments").exec(function(err, foundEvent){
        if (err || !foundEvent) {
            req.flash("error","Veranstaltung nicht gefunden!");
            res.redirect("back");
            console.log(err);
        } else {
            console.log(foundEvent);
            res.render("events/show",{event:foundEvent}); 
        }
    });
   
});

//EDIT - edit an existing Event
router.get("/:id/edit", middleware.checkEventOwnership, function(req, res) {
    Event.findById(req.params.id, function(err, foundEvent){
        res.render("events/edit", {event: foundEvent });
    });
});


//UPDATE ROUTE
router.put("/:id", middleware.checkEventOwnership, function(req,res){
    req.body.event.body = req.sanitize(req.body.event.body);
    Event.findByIdAndUpdate(req.params.id, req.body.event, function(err,updatedEvent){  
     if (err) {
            console.log(err);
            res.redirect("/events");
        } else {
            res.redirect("/events/" + req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:id",middleware.checkEventOwnership, function(req, res){
     Event.findByIdAndRemove(req.params.id, function(err){  
     if (err) {
            console.log(err);
            res.redirect("/events");
        } else {
            res.redirect("/events");
        }
    });
});



module.exports = router;