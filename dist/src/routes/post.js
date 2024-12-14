"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_1 = __importDefault(require("../controllers/post"));
router.post("/", post_1.default.addNewPost);
router.get("/", post_1.default.getAllPosts);
router.get("/:postId", (req, res) => { post_1.default.getPostById(req, res); });
router.get("/sender", post_1.default.getPostBySender);
router.put("/:postId", post_1.default.updatePost);
exports.default = router;
//# sourceMappingURL=post.js.map