var mongoose = require("mongoose");
var eventSchema = new mongoose.Schema({
    no: String,
    author: {
            id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
            },
            username: String()  
    },
    organizers: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        
    }],
    title: {type: String, required:true},
    image: String,
    description: {type: String, required:true},
    meetingpoint: String,
    location: {type: String, required:true},
    lat: Number,
    lng: Number,
    date: {type: String, required:true},
    time: String,
    deadline: String,
    fee: String,
    subscribers: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscriber"
    }],
    maxSubscribers: Number,
    comments: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],

    created: { type: Date, default: Date.now }
});

module.exports =  mongoose.model("Event", eventSchema);