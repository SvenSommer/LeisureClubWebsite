var mongoose = require("mongoose");

var announcementSchema = new mongoose.Schema({
    title: String,
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String()
    },
    accepted: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        date: {type: Date, default: Date.now}
    }],
    created: {type: Date, default: Date.now}
});

module.exports =  mongoose.model("Announcement", announcementSchema);
















