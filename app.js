var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    User                = require("./models/user"),
    Event               = require("./models/event"),
    Comment             = require("./models/comment"),
    seedDB              = require("./seeds");



var commentRoutes = require("./routes/comments"),
    eventRoutes = require("./routes/events"),
    indexRoutes      = require("./routes/index")
    

//APP Config    
mongoose.connect("mongodb://localhost/freizeitverein", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB(); //Seeding the database

//PASSPOORT CINFIGURATION
app.use(require("express-session")({
    secret:"_MPhD8fCqBxOP`TLlF^wV\2pjliS^061BdvJOg%,zV77eV>WEdBFA2m/N0zz;5JO",
    resave: false,
    saveUninitialized: false
    
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.use("/", indexRoutes);
app.use("/events", eventRoutes);
app.use("/events/:id/comments",commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Freizeitverein Server has started!");
});