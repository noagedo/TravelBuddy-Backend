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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_1 = __importDefault(require("../models/post"));
const addNewPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const photos = req.body.photos || [];
        const _a = req.body, { likes = 0 } = _a, rest = __rest(_a, ["likes"]);
        const post = new post_1.default(Object.assign({ likes, photos }, rest));
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
        console.log(req.query.sender);
        const posts = yield post_1.default.find({ sender: { $regex: `^${req.query.sender}$`, $options: "i" } });
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
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPost = yield post_1.default.findByIdAndDelete(req.params.postId);
        if (deletedPost)
            res.status(201).send("Post deleted successfully");
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
    deletePost
};
//# sourceMappingURL=post.js.map