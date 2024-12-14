import express from "express";
const router = express.Router();
import commentController from "../controllers/comment";
import postController from "../controllers/post";


router.post("/", commentController.createComment);

router.get("/", commentController.getAllComments);

router.get("/:postId", commentController.getCommentsByPostId);

router.put("/:commentId", commentController.updateComment);

router.delete("/:commentId", (req,res)=>{postController.getPostById(req,res)});


export default router;