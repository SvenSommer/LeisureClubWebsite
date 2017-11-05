var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
    gender: String,
    firstname: String,
    lastname: String,
    email: {type: String, unique: true, required:true},
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
    created: {type: Date, default: Date.now},
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

module.exports =  mongoose.model("User", userSchema);