"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    sender: { type: mongoose_1.default.Schema.Types.String, ref: "User", required: true }, //ID of the user
    content: String,
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    likesBy: { type: [mongoose_1.default.Schema.Types.String], default: [] },
    photos: { type: [String], default: [] },
    senderProfilePicture: { type: String }
});
exports.default = mongoose_1.default.model("Post", postSchema);
//# sourceMappingURL=post.js.map