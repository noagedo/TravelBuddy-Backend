const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");


router.post("/", commentController.createComment);

router.get("/", commentController.getAllComments);

router.get("/:postId", commentController.getCommentsByPostId);

router.put("/:commentId", commentController.updateComment);


module.exports = router;