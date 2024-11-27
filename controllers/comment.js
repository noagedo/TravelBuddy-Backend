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

module.exports = {
    createComment,
};