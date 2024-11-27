const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");

router.post("/", postController.addNewPost);


module.exports = router;