"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comment_1 = __importDefault(require("../controllers/comment"));
const post_1 = __importDefault(require("../controllers/post"));
router.post("/", comment_1.default.createComment);
router.get("/", comment_1.default.getAllComments);
router.get("/:postId", comment_1.default.getCommentsByPostId);
router.put("/:commentId", comment_1.default.updateComment);
router.delete("/:commentId", (req, res) => { post_1.default.getPostById(req, res); });
exports.default = router;
//# sourceMappingURL=comment.js.map