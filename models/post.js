const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    sender: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("post", postSchema);

