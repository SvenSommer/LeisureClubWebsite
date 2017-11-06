var mongoose = require("mongoose");

var subscriberSchema = new mongoose.Schema({
    
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username: String(),
    created: { type: Date, default: Date.now }
});

module.exports =  mongoose.model("Subscriber", subscriberSchema);