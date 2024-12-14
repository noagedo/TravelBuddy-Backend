import express from "express";
const router = express.Router();
import postController from "../controllers/post";

router.post("/", postController.addNewPost);

router.get("/", postController.getAllPosts);

router.get("/:postId",(req,res)=>{postController.getPostById(req,res)});

router.get("/sender", postController.getPostBySender); 

router.put("/:postId", postController.updatePost);

export default router;