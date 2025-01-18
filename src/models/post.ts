import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.String, ref: "User", required: true },
    content: String,
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    photos: { type: [String], default: [] }
})

export default mongoose.model("Post", postSchema);

