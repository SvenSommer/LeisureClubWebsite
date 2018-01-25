var express = require("express");
var router = express.Router();
var Event = require("../models/event");
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
// MEMORIES ROUTES
// ===================================

//INDEX - show all memories
router.get("/", middleware.isLoggedIn, function(req, res){
    // Get all events from DB
    Event.find().sort({"date":-1}).populate("subscribers").exec(function(err, memories){
        if(err){
            console.log(err);
        }
        else {
            res.render("memories/index", {memories: memories, page: 'memories'});
        }
    });
});

//SHOW - shows more info about one memory
router.get("/:id",middleware.isLoggedIn, function(req, res) {
    Event.findById(req.params.id).populate("comments").populate("subscribers").exec(function(err, foundMemory){
        if (err || !foundMemory) {
            req.flash("error","Erinnerung nicht gefunden!");
            res.redirect("back");
            console.log(err);
        } else {
            res.render("memories/show",{memory:foundMemory}); 
        }
    });
   
});


module.exports = router;