import express from "express";
const router = express.Router();
import commentController from "../controllers/comment";


/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - postId
 *         - content
 *       properties:
 *         postId:
 *           type: string
 *           description: The ID of the post this comment belongs to
 *         content:
 *           type: string
 *           description: The content of the comment
 *       example:
 *         postId: '1234'
 *         content: 'This is a comment'
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Creates a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *      400:
 *        description: Bad request
 *     500:
 *       description: Internal server error
 */
router.post("/", commentController.createComment);

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Gets all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of all comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *      400:
 *       description: Bad request
 *    500:
 *     description: Internal server error
 */
router.get("/", commentController.getAllComments);

/**
 * @swagger
 * /comments/{postId}:
 *   get:
 *     summary: Gets all comments for a specific post by post ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post for which to retrieve comments
 *     responses:
 *       200:
 *         description: List of comments for the specified post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *     400:
 *      description: Bad request
 *   404:
 *    description: Post not found
 */
router.get("/:postId", commentController.getCommentsByPostId);

/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Updates a comment by its ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The updated comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *    400:
 *     description: Bad request
 *  404:
 *  description: Comment not found
 * 500:
 * description: Internal server error
 */
router.put("/:commentId", (req,res)=>{commentController.updateComment(req,res)});

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Deletes a comment by its ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete
 *     responses:
 *       200:
 *         description: The deleted comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *    400:
 *    description: Bad request
 * 404:
 * description: Comment not found
 * 500:
 * description: Internal server error
 * 
 */

router.delete("/:commentId", (req,res)=>{commentController.deleteComment(req,res)});

router.delete("/", commentController.deleteAllComments);



export default router;