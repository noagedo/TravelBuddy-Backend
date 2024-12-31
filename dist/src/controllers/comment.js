"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comment_1 = __importDefault(require("../models/comment"));
const mongoose_1 = __importDefault(require("mongoose"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = new comment_1.default(req.body);
        yield comment.save();
        res.status(200).json(comment);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield comment_1.default.find();
        res.json(comments);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const getCommentsByPostId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield comment_1.default.find({ postId: req.params.postId });
        res.json(comments);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield comment_1.default.findByIdAndUpdate(req.params.commentId, req.body, { new: true });
        // Check if the comment exists
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        // Return the updated comment
        res.status(200).json(comment);
    }
    catch (error) {
        // Handle validation errors, invalid IDs, etc.
        res.status(400).json({ message: "Invalid request", error });
    }
});
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: "Invalid comment ID" });
        }
        const deletedComment = yield comment_1.default.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
const deleteAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield comment_1.default.deleteMany({});
        res.status(200).json({ message: "All comments deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.default = {
    createComment,
    getAllComments,
    getCommentsByPostId,
    updateComment,
    deleteComment,
    deleteAllComments,
};
//# sourceMappingURL=comment.js.map