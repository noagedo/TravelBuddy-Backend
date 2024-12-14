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
const post_1 = __importDefault(require("../models/post"));
const addNewPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = new post_1.default(req.body);
        yield post.save();
        res.status(201).send(post);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default.find();
        res.send(posts);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_1.default.findById(req.params.postId);
        if (post)
            res.send(post);
        else
            res.status(404).send("Post not found");
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const getPostBySender = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default.find({ sender: req.query.sender });
        if (posts.length > 0)
            res.send(posts);
        else
            res.status(404).send("No posts found for this sender");
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_1.default.findByIdAndUpdate(req.params.postId, req.body, {
            new: true,
        });
        if (post)
            res.send(post);
        else
            res.status(404).send("Post not found");
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.default = {
    addNewPost,
    getAllPosts,
    getPostById,
    getPostBySender,
    updatePost,
};
//# sourceMappingURL=post.js.map