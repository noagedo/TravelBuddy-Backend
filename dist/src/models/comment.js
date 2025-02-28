"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    postId: { type: mongoose_1.default.Schema.Types.String, ref: "Post", required: true },
    sender: { type: mongoose_1.default.Schema.Types.String, ref: "User", required: true }, //ID of the user
    content: String,
    createdAt: { type: Date, default: Date.now },
    senderProfilePicture: { type: String }
});
exports.default = mongoose_1.default.model("Comment", commentSchema);
//# sourceMappingURL=comment.js.map