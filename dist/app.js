"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const db = mongoose_1.default.connection;
        db.on("error", (error) => {
            console.error("Database connection error:", error);
        });
        db.once("open", () => {
            console.log("Connected to database");
        });
        if (process.env.DB_CONNECT === undefined) {
            console.error("DB_CONNECT is not defined in .env file");
            reject();
        }
        else {
            mongoose_1.default.connect(process.env.DB_CONNECT).then(() => {
                console.log("Connected to database");
                const bodyParser = require("body-parser");
                app.use(bodyParser.json());
                app.use(bodyParser.urlencoded({ extended: true }));
            }).catch((error) => {
                console.error("Database connection error:", error);
                reject(error);
            });
            const postRoutes = require("./routes/post");
            app.use("/posts", postRoutes);
            const commentRoutes = require("./routes/comment");
            app.use("/comments", commentRoutes);
            app.listen(port, () => {
                console.log(`Server is running at http://localhost:${port}`);
            });
        }
        resolve;
    });
});
exports.default = initApp;
//# sourceMappingURL=app.js.map