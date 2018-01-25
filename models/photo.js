var mongoose = require("mongoose");

var photoSchema = new mongoose.Schema({
    path: String,
    uploader: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String()
    },
    description: String,
    comments: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    created: {type: Date, default: Date.now}
});

module.exports =  mongoose.model("Photo", photoSchema);