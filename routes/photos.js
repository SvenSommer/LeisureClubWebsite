var express = require("express");
var router = express.Router({mergeParams: true});
var Event = require("../models/event");
var Photo = require("../models/photo");
var middleware = require("../middleware");
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


// ============================================
// PHOTO ROUTES
// ============================================

// PHOTO NEW
router.get("/new", middleware.isLoggedIn,  function(req,res){
    Event.findById(req.params.id, function(err,foundEvent){
        if (err) {
            console.log(err);
        } else {

            res.render("photos/new", {event:foundEvent});
        }
    });
});


// PHOTO CREATE
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req,res){
     cloudinary.uploader.upload(req.file.path, function(cloudinaryresult) {
        Event.findById(req.params.id,function(err, foundevent) {
           if (err) {
               console.log(err);
               res.redirect("/events");
           } else
           {
                Photo.create(req.body.photo, function(err, photo) {
                    if (err) {
                        req.flash("error", "Da ist etwas schief gelaufen.");
                        console.log(err);
                    }   else {
                        photo.path = cloudinaryresult.secure_url;
                        photo.description = req.body.photo.description;
                        //add username and id to photo
                        photo.uploader.id = req.user._id;
                        photo.uploader.username = req.user.username;
                        //save photo
                        photo.save();
                        console.log(photo);
        
                        foundevent.photos.push(photo);
                        foundevent.save();
                        req.flash("success", "Foto erfolgreich hinzugefügt.");
                        res.redirect("/events/" + foundevent._id);
                    }
                });
           }
        });
     });
});

//SHOW - shows more info about one event
router.get("/:photo_id",middleware.isLoggedIn, function(req, res) {
     Event.findById(req.params.id).populate("photos").exec(function(err, foundEvent){
       if (err || !foundEvent) {
            req.flash("error","Veranstaltung nicht gefunden!");
            res.redirect("back");
        } 
        Photo.findById(req.params.photo_id, function(err, foundPhoto) {
            if (err || !foundPhoto) {
                req.flash("error","Foto nicht gefunden!");
                res.redirect("back");
            } else {
                 res.render("photos/show", {event: foundEvent, event_id:req.params.id, photo: foundPhoto});
            }
        });
    });
});


//PHOTO EDIT ROUTE
router.get("/:photo_id/edit", middleware.checkPhotoOwnership,  function(req,res){
    Event.findById(req.params.id, function(err, foundEvent){
       if (err || !foundEvent) {
            req.flash("error","Veranstaltung nicht gefunden!");
            res.redirect("back");
        } 
        Photo.findById(req.params.photo_id, function(err, foundPhoto) {
            if (err || !foundPhoto) {
                req.flash("error","Foto nicht gefunden!");
                res.redirect("back");
            } else {
                 res.render("photos/edit", {event_id:req.params.id, photo: foundPhoto});
            }
        });
    });
});

//PHOTO UPDATE ROUTE
router.put("/:photo_id",middleware.checkPhotoOwnership, upload.single('image'), function(req, res){
    console.log("sucess!!");
    if (!req.hasOwnProperty('file')) {
        Photo.findById(req.params.photo_id, function(err, oldPhoto){
            var newData = 
                    {
                        path : oldPhoto.path,
                        uploader : oldPhoto.uploader,
                        description : req.body.photo.description,
                        comments : oldPhoto.comments,
                        created : oldPhoto.created
                        
                    };
            Photo.findByIdAndUpdate(req.params.photo_id, {$set: newData}, function(err, updatedPhoto){
                if (err || !updatedPhoto) {
                    req.flash("error","Foto nicht gefunden!");
                    res.redirect("back");        
                } else {
                    res.redirect("/events/" + req.params.id);
                }
                
            });
        });    
    }
    else
    {
        console.log("has file!!");
    }
});

//PHOTO DESTROY ROUTE
router.delete("/:photo_id",middleware.checkPhotoOwnership, function(req, res){
    Photo.findByIdAndRemove(req.params.photo_id, function(err){
     if (err) {
         res.redirect("back");  
     } else
     {
         req.flash("success", "Foto erfolgreich gelöscht!");
         res.redirect("/events/"+ req.params.id);
     }
      
    });
});

module.exports = router;