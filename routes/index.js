var express = require("express");
var router = express.Router();
var passport =  require("passport");
var User =  require("../models/user");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

router.get("/", function(req, res){
   res.render("landing");
});

// ===================
// AUTH ROUTES
// ===================

// SHOW REGISTER FORM
router.get("/register", function(req, res) {
    res.render("register", {page: 'register'});
});

// HANDLE SIGNUP LOGIC
router.post("/register",function(req, res) {
   // req.body.event.body = req.sanitize(req.body.event.body);
    var newUser = new User({
        username: req.body.username,
        firstname:  req.body.firstname,
        lastname:  req.body.lastname,
        email:  req.body.email
    });
    if (req.body.passphrase === process.env.ADMINPASSPHRASE) {
        newUser.isAdmin = true;
        newUser.isActive = true;
    }
    else if (req.body.passphrase === process.env.USERPASSPHRASE) {
        newUser.isAdmin = false;
        newUser.isActive = false;
    } else {
        return res.render("register", {error: "Codeword nicht erkannt!"});   
    }

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Herzlich Willkommen " + user.username + " beim der lustigen Truppe." );
            res.redirect("/events");       
        });
    });
    
});

// SHOW LOGIN FORM
router.get("/login", function(req,res){
   res.render("login", {page: 'login'});
});

/*
//HANDLING LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/events",
        failureRedirect: "/login"
    }),  function(req, res) {
      
});
*/

/* POST login page. */
router.post('/login', function(req, res, next) {
    passport.authenticate('local', { 
        successRedirect: "/events",
        failureRedirect: "/login"
    }, function(err, user, info) {
        if(err) {
            console.log(err);
            req.flash("error","Error1");
            return res.redirect("/login");
        }

        if(!user) {
            req.flash("error","Benutzername oder Passwort ist nicht richtig!");
            return res.redirect("/login");
        }
        return req.logIn(user, function(err) {
            if(err) {
              req.flash("error","Error2");
              return res.redirect("/login");
            } 
            console.log("User " + req.user.username + " last login:" + Date.now());

            User.findOneAndUpdate({'username': req.user.username}, {lastLogin: Date.now()}, {new: true}, function(err, user) {
              if (err) {
                  console.log(err);
              }
            });
            req.flash("success","Willkommen zurück " + user.firstname + "!");
            return res.redirect("/events");
        });
    })(req, res, next);
});

//LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success","Du wurdest erfolgreich ausgeloggt!");
    res.redirect("/events");
});


//================================================================================
// Password reset Route
//================================================================================
// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'Es existiert kein Account mit dieser Emailadresse');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.MAILADRESS,
          pass: process.env.GMAILSERVERPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.MAILADRESS,
        subject: 'Freizeitverein: Passwort zurücksetzen',
        text: 'Du erhälst diese Nachricht da du (oder jemand anderes) eine Anfrage zum Zurücksetzen des Passwortes verschickt hat.\n\n' +
          'Bitte klicke auf den folgenden Link, oder kopiere in in deinen Browser um dein Passwort zurückzusetzen:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'Falls du diese Anfrage nicht verschickt hast, ignoriere bitte diese Email und alles bleibt unverändert.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Eine Email zur Wiederherstellung des Passwortes wurde an ' + user.email + ' versendet.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
 // User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
  User.findOne({ resetPasswordToken: req.params.token}, function(err, user) {
    if (!user) {
      req.flash('error', 'Der Schlüssel zum Zurücksetzen des Passwortes ist ungültig oder bereits abgelaufen.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Der Schlüssel zum Zurücksetzen des Passwortes ist ungültig oder bereits abgelaufen.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          });
        } else {
            req.flash("error", "Passwörter stimmen nicht überrein.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.MAILADRESS,
          pass: process.env.GMAILSERVERPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.MAILADRESS,
        subject: 'Freizeitverein: Dein Passwort wurde geändert.',
        text: 'Hello,\n\n' +
          'Das ist die Bestätigung das dein Passwort für den Benutzer mit der Emailadresse ' + user.email + ' grade geändert wurde.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Dein Passwort würde erfolgreich geändert!');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/events');
  });
});



module.exports = router;