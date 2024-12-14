import Comment from "../models/comment";
import { Request, Response } from "express";

const createComment = async (req:Request, res:Response) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        res.status(400).send(error);
    }
};


const getAllComments = async (req:Request, res:Response) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getCommentsByPostId = async (req:Request, res:Response) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        res.json(comments);
    } catch (error) {
        res.status(400).send(error);
    }
};

const updateComment = async (req:Request, res:Response) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, { new: true });
        res.json(comment);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteComment = async (req:Request, res:Response) => {
    try {
       
        const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);

        if (!deletedComment) {
            return res.status(404).send("Comment not found");
        }

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(400).send(error);
    }
};




export default {
    createComment,
    getAllComments,
    getCommentsByPostId,
    updateComment,
    deleteComment,
};