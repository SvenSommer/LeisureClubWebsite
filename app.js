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
    subscribersRoutes   = require("./routes/subscribers"),
    eventRoutes         = require("./routes/events"),
    usersRoutes         = require("./routes/users"),
    announcementsRoutes = require("./routes/announcements");


// killall mongod ; cd ; ./mongod --repair ; cd data ; rm -rf mongod.lock ; cd ; ./mongod
// . init.sh
if (!process.env.SITENAME) {
    console.log("SITENAME is not defined!");
}  
if (!process.env.DATABASEURL) {
    console.log("DATABASEURL is not defined!");
}    
if (!process.env.PASSWORDSECRET) {
    console.log("PASSWORDSECRET is not defined!");
}    
if (!process.env.GMAILSERVERPW) {
    console.log("GMAILSERVERPW is not defined!");
}    
if (!process.env.MAILADRESS) {
    console.log("MAILADRESS is not defined!");
}
if (!process.env.USERPASSPHRASE) {
    console.log("USERPASSPHRASE is not defined!");
}  
if (!process.env.ADMINPASSPHRASE) {
    console.log("ADMINPASSPHRASE is not defined!");
}  
if (!process.env.CLOUDINARY_API_KEY) {
    console.log("CLOUDINARY_API_KEY is not defined!");
}  
if (!process.env.CLOUDINARY_API_SECRET) {
    console.log("CLOUDINARY_API_SECRET is not defined!");
}  



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
   res.locals.clubname = process.env.SITENAME;
   res.locals.clubname_gen = process.env.CLUBNAME_GENITIV || process.env.SITENAME;
   next();
});


app.use("/", indexRoutes);
app.use("/events", eventRoutes);
app.use("/events/:id/comments", commentRoutes);
app.use("/events/:id/subscribers", subscribersRoutes);
app.use("/users", usersRoutes);
app.use("/announcements", announcementsRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});