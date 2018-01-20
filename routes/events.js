var express = require("express");
var router = express.Router();
var Event = require("../models/event");
var Announcement =  require("../models/announcement");
var middleware = require("../middleware");
var geocoder = require('geocoder');
var moment   = require('moment');
var multer = require('multer');
var cloudinary = require('cloudinary');

// ===================================
// IMAGE UPLOAD
// ===================================
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Es sind nur Bilddateien erlaubt!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})


cloudinary.config({ 
  cloud_name: 'lustige-truppe', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});



// ===================================
// EVENT ROUTES
// ===================================

//INDEX - show all events
router.get("/", middleware.isLoggedIn, function(req, res){
    // Get all events from DB
    Event.find().sort({"date":1}).populate("subscribers").exec(function(err, events){
        if(err){
            console.log(err);
        }
        else {
            Announcement.find().sort({"created":1}).exec(function(err, foundAnnouncements){
            if (err) {
                req.flash("error","verfasste Ankündigungen nicht gefunden!");
                res.redirect("/");
            }
            res.render("events/index", {events: events, 
                                    page: 'events',
                                    announcements: foundAnnouncements});
            });
        }
    });
});



// CREATE - add new event to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req,res){
    
   cloudinary.uploader.upload(req.file.path, function(cloudinaryresult) {
        var title = req.body.title;
        var image =  cloudinaryresult.secure_url;
        var description =req.body.description;
        var meetingpoint =req.body.meetingpoint;
        var date =  moment(req.body.date, "DD.MM.YYYY", 'de').format('YYYY-MM-DD');
        console.log("date: " + date);
        var time =req.body.time;
        var deadline = moment(req.body.deadline, "DD.MM.YYYY", 'de').format('YYYY-MM-DD');
        var maxSubscribers = req.body.maxSubscribers;
        var fee =req.body.fee;
        var author = {
            id: req.user._id,
            username: req.user.username
        };
        
        geocoder.geocode(req.body.location, function (err, data) {
        if(err){
                req.flash('error', err.message);
                return res.redirect('back');
            } 
            else {
                var lat = "";
                var lng = "";
                var location = req.body.location;
                if (data.results[0]) {
                    lat = data.results[0].geometry.location.lat;
                    lng = data.results[0].geometry.location.lng;
                    location = data.results[0].formatted_address;
                }
                var newEvent = {
                    title : title,
                    author: author,
                    image: image,
                    description : description,
                    location : location,
                    lat: lat, 
                    lng: lng,
                    meetingpoint : meetingpoint,
                    date : date,
                    time : time,
                    deadline : deadline,
                    maxSubscribers : maxSubscribers,
                    fee : fee
                };
                // Create a new Event and save to DB
                Event.create(newEvent, function(err, newlyCreated){
                    if(err){
                        req.flash('error', err.message);
                        return res.redirect('back');
                    } else {
                        res.redirect("/events/" + newlyCreated.id);
                    }
                });
            }
        });
    });
});

//NEW - show form to create Event
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("events/new"); 
});



//SHOW - shows more info about one event
router.get("/:id",middleware.isLoggedIn, function(req, res) {
    Event.findById(req.params.id).populate("comments").populate("subscribers").exec(function(err, foundEvent){
        if (err || !foundEvent) {
            req.flash("error","Veranstaltung nicht gefunden!");
            res.redirect("back");
            console.log(err);
        } else {
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
router.put("/:id", middleware.checkEventOwnership, upload.single('image'), function(req,res){
    //req.body = req.sanitize(req.body);
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = "";
        var lng = "";
        var location =req.body.location;
        if (data.results[0]) {
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
            location = data.results[0].formatted_address;
        }


    Event.findById(req.params.id, function(err, foundEvent){
       //check for new image
       if (!req.hasOwnProperty('file')) {
            console.log("taking old image: " + foundEvent.image + "...");
             var newData = 
            {
                title: req.body.title, 
                image: foundEvent.image, 
                description: req.body.description, 
                location : location,
                lat: lat, 
                lng: lng,
                meetingpoint: req.body.meetingpoint, 
                date : moment(req.body.date, "DD.MM.YYYY", 'de').format('YYYY-MM-DD'),
                time: req.body.time, 
                deadline: moment(req.body.deadline, "DD.MM.YYYY", 'de').format('YYYY-MM-DD'), 
                maxSubscribers : req.body.maxSubscribers,
                fee: req.body.fee
            };
        
            Event.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    req.flash("success","Erfolgreich bearbeitet!");
                    res.redirect("/events/" + campground._id);
                }
            });
           } else
       {
           console.log("Uploading file: " +req.file.path + "...");
            cloudinary.uploader.upload(req.file.path, function(cloudinaryresult) {
                var newData = 
                {
                    title: req.body.title, 
                    image: cloudinaryresult.secure_url,
                    description: req.body.description, 
                    location : location,
                    lat: lat, 
                    lng: lng,
                    meetingpoint: req.body.meetingpoint, 
                    date : moment(req.body.date, "DD.MM.YYYY", 'de').format('YYYY-MM-DD'),
                    time: req.body.time, 
                    deadline: moment(req.body.deadline, "DD.MM.YYYY", 'de').format('YYYY-MM-DD'), 
                    maxSubscribers : req.body.maxSubscribers,
                    fee: req.body.fee
                };
                
                Event.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
                    if(err){
                        req.flash("error", err.message);
                        res.redirect("back");
                    } else {
                        req.flash("success","Erfolgreich bearbeitet!");
                        res.redirect("/events/" + campground._id);
                    }
                });
            });
       }
   

       
    });
  });
});

//DELETE ROUTE
router.delete("/:id",middleware.checkEventOwnership, function(req, res){
     Event.findByIdAndRemove(req.params.id, function(err){  
     if (err) {
            console.log(err);
            res.redirect("/events");
        } else {
            req.flash('success', 'Veranstaltung erfolgreich gelöscht!');
            res.redirect("/events");
        }
    });
});



module.exports = router;