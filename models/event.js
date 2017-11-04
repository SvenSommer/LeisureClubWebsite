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
    title: String,
    image: String,
    description: String,
    meetingpoint: String,
    place: String,
    date: String,
    time: String,
    deadline: String,
    subscribers: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                        
                    }],
    fee: String,
    comments: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Comment"
                    }],
    created: {type: Date, default: Date.now}
});

module.exports =  mongoose.model("Event", eventSchema);