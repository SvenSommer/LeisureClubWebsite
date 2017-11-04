var express = require("express");
var router = express.Router({mergeParams: true});
var Event = require("../models/event");
var Comment = require("../models/comment");
var middleware = require("../middleware");
// ============================================
// COMMENT ROUTES
// ============================================


// COMMENTS NEW
router.get("/new", middleware.isLoggedIn,  function(req,res){
    Event.findById(req.params.id, function(err,foundEvent){
        if (err) {
            console.log(err);
        } else {

            res.render("comments/new", {event:foundEvent});
        }
    });
});

//COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function(req,res){

   Event.findById(req.params.id,function(err, foundevent) {
       if (err) {
           console.log(err);
           res.redirect("/events");
       } else
       {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Da ist etwas schief gelaufen.");
                    console.log(err);
                }   else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save commnent
                    comment.save();

                    foundevent.comments.push(comment);
                    foundevent.save();
                    req.flash("success", "Kommentar erfolgreich hinzugefügt.");
                    res.redirect("/events/" + foundevent._id);
                }
            });
       }
    });
});


// COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership,  function(req,res){
    Event.findById(req.params.id, function(err, foundEvent){
       if (err || !foundEvent) {
            req.flash("error","Veranstaltung nicht gefunden!");
            res.redirect("back");
        } 
        Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err || !foundComment) {
            req.flash("error","Kommentar nicht gefunden!");
            res.redirect("back");
        } else {
             res.render("comments/edit", {event_id:req.params.id, comment: foundComment});
        }
    });
});
    });


//COMMENTS UPDATE ROUTE
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedCommens){
        if (err || !updatedCommens) {
            req.flash("error","Komentar nicht gefunden!");
            res.redirect("back");        
        } else {
            res.redirect("/events/" + req.params.id);
        }
        
    });
});

//COMMENTS DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
     if (err) {
         res.redirect("back");  
     } else
     {
         req.flash("success", "Kommentar erfolgreich gelöscht!");
         res.redirect("/events/"+ req.params.id);
     }
      
    });
});



module.exports = router;