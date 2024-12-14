import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.String, ref: "User", required: true },
    content: String,
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Post", postSchema);

