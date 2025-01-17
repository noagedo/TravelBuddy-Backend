"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_1 = __importDefault(require("../controllers/post"));
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Post API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - sender
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         sender:
 *           type: string
 *           description: The sender of the post
 *       example:
 *         title: "My First Post"
 *         content: "This is the content of my first post"
 *         sender: "noa"
 */
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Adds a new post
 *     description: Adds a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The new post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.post("/", post_1.default.addNewPost);
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Gets all posts
 *     description: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: Posts not found
 *       500:
 *         description: Internal server error
 */
router.get("/", post_1.default.getAllPosts);
/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Gets a specific post by ID
 *     description: Get a specific post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to retrieve
 *     responses:
 *       200:
 *         description: A specific post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.get("/:postId", post_1.default.getPostById);
/**
 * @swagger
 * /posts/sender:
 *   get:
 *     summary: Gets posts by a specific sender
 *     description: Get posts by sender
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts by sender
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: Posts not found
 *       500:
 *         description: Internal server error
 */
router.get("/sender", post_1.default.getPostBySender);
/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Updates a post by ID
 *     description: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.put("/:postId", post_1.default.updatePost);
/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Deletes a post
 *     description: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:postId", post_1.default.deletePost);
exports.default = router;
//# sourceMappingURL=post.js.map