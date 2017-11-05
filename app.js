var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    passport            = require("passport"),
    moment              = require('moment'),
    LocalStrategy       = require("passport-local"),
    User                = require("./models/user");



var indexRoutes         = require("./routes/index"),
    commentRoutes       = require("./routes/comments"),
    eventRoutes         = require("./routes/events"),
    usersRoutes         = require("./routes/users");
    
console.log("DatabaseUrl: " + process.env.DATABASEURL);
//APP Config    
var url = process.env.DATABASEURL || "mongodb://localhost/freizeitverein";
mongoose.connect(url, {useMongoClient: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

moment.locale("de");
moment().format('LLL');
app.locals.moment = moment;
//PASSPOORT CINFIGURATION
app.use(require("express-session")({
    secret: process.env.PASSWORDSECRET,
    resave: false,
    saveUninitialized: false
    
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//local passport

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.use("/", indexRoutes);
app.use("/events", eventRoutes);
app.use("/events/:id/comments",commentRoutes);
app.use("/users", usersRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Freizeitverein Server has started!");
});