const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");

router.post("/", postController.addNewPost);

router.get("/", postController.getAllPosts);

router.get("/:postId", postController.getPostById);

router.get("/sender", postController.getPostBySender); 

router.put("/:postId", postController.updatePost);

module.exports = router;