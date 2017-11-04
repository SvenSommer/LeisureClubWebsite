var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
    gender: String,
    name: String,
    surname: String,
    email: String,
    username: String,
    password: String,
    photo: String,
    birthday: Date,
    city: String,
    street: String,
    housenumber: String,
    created: {type: Date, default: Date.now}
});

userSchema.plugin(passportLocalMongoose);

module.exports =  mongoose.model("User", userSchema);