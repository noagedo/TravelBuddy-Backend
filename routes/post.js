const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");

router.post("/", postController.addNewPost);

router.get("/", postController.getAllPosts);


module.exports = router;