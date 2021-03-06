var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
    gender: String,
    firstname: String,
    lastname: String,
    email: {type: String, required:true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    username: {type: String, unique: true, required:true},
    password: String,
    avatar: String,
    birthday: String,
    city: String,
    zipcode: Number,
    streetAndNumber: String,
    telephone: String,
    mobil: String,
    viewClassic: {type: Boolean, default: true},
    created: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    isAdmin: {type: Boolean, default: false},
    isActive: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

module.exports =  mongoose.model("User", userSchema);





