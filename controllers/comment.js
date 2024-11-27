const Comment = require("../models/comment");

const createComment = async (req, res) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        res.status(400).send(error.message);
    }
};


const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const getCommentsByPostId = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        res.json(comments);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, { new: true });
        res.json(comment);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const deleteComment = async (req, res) => {
    try {
       
        const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);

        if (!deletedComment) {
            return res.status(404).send("Comment not found");
        }

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(400).send(error.message);
    }
};


module.exports = {
    createComment,
    getAllComments,
    getCommentsByPostId,
    updateComment,
    deleteComment
};