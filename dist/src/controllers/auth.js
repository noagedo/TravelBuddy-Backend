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
exports.authMiddleware = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator_1 = require("validator");
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client();
const googleSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const ticket = yield client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload === null || payload === void 0 ? void 0 : payload.email;
        if (email != null) {
            let user = yield user_1.default.findOne({ 'email': email });
            if (user == null) {
                user = yield user_1.default.create({
                    'userName': (payload === null || payload === void 0 ? void 0 : payload.name) || email.split('@')[0],
                    'email': email,
                    'password': '0',
                    'profilePicture': payload === null || payload === void 0 ? void 0 : payload.picture
                });
            }
            const tokens = yield generateTokens(user);
            res.status(200).send(Object.assign({ userName: user.userName, email: user.email, _id: user._id, profilePicture: user.profilePicture }, tokens));
        }
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(400).send(err.message);
        }
        else {
            return res.status(400).send("An error occurred");
        }
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, userName } = req.body;
    // Validate userName
    if (!userName || userName.trim() === '') {
        return res.status(400).send({ error: "Invalid input data" });
    }
    if (!(0, validator_1.isEmail)(email)) {
        return res.status(400).send({ error: "Invalid email format" });
    }
    if (!password || password.trim() === '') {
        return res.status(400).send({ error: "Invalid input data" });
    }
    try {
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: "Email is already in use" });
        }
        const existingUserName = yield user_1.default.findOne({ userName });
        if (existingUserName) {
            return res.status(400).send({ error: "Username is already in use" });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        let profilePicture = req.body.profilePicture;
        if (!profilePicture)
            profilePicture = null;
        const user = yield user_1.default.create({
            userName,
            email,
            password: hashedPassword,
            profilePicture: profilePicture,
        });
        res.status(200).send(user);
    }
    catch (error) {
        console.error("Error during user registration:", error);
        res.status(400).send({ error: "An error occurred" });
    }
});
const generateTokens = (user) => {
    if (process.env.TOKEN_SECRET === undefined) {
        return null;
    }
    const rand = Math.random();
    const accessToken = jsonwebtoken_1.default.sign({
        _id: user._id,
        rand: rand,
    }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION || "10s" });
    const refreshToken = jsonwebtoken_1.default.sign({
        _id: user._id,
        rand: rand,
    }, process.env.TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d" });
    return { refreshToken: refreshToken, accessToken: accessToken };
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = yield user_1.default.findOne({ email: email });
        if (!user) {
            res.status(404).send({ error: "User not found" });
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            res.status(400).send("incorrect email or password");
            return;
        }
        const tokens = generateTokens(user);
        if (!tokens) {
            res.status(400).send({ error: "Token generation error" });
            return;
        }
        if (user.refreshTokens == null) {
            user.refreshTokens = [];
        }
        user.refreshTokens.push(tokens.refreshToken);
        yield user.save();
        res.status(200).send(Object.assign(Object.assign({}, tokens), { _id: user._id, userName: user.userName, profilePicture: user.profilePicture }));
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).send({ error: err.message || "An error occurred" });
        }
        else {
            res.status(400).send({ error: "An error occurred" });
        }
    }
});
const validateRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        if (refreshToken == null) {
            reject("error");
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            reject("error");
            return;
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                reject(err);
                return;
            }
            const userId = payload._id;
            try {
                const user = yield user_1.default.findById(userId);
                if (!user) {
                    reject("error");
                    return;
                }
                //check if token exists
                if (!user.refreshTokens ||
                    !user.refreshTokens.includes(refreshToken)) {
                    user.refreshTokens = [];
                    yield user.save();
                    reject(err);
                    return;
                }
                resolve(user);
            }
            catch (err) {
                reject(err);
            }
        }));
    });
};
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        console.log("Updating user:", userId, updateData);
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const updatedUser = yield user_1.default.findByIdAndUpdate(userId, updateData, { new: true });
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield validateRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send("error");
            return;
        }
        //remove the token from the user
        user.refreshTokens = user.refreshTokens.filter((token) => token !== req.body.refreshToken);
        yield user.save();
        res.status(200).send("logged out");
    }
    catch (_a) {
        res.status(400).send("error");
        return;
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield validateRefreshToken(req.body.refreshToken);
        const tokens = generateTokens(user);
        console.log(tokens);
        if (!tokens) {
            res.status(400).send("error");
            return;
        }
        user.refreshTokens = user.refreshTokens.filter((token) => token !== req.body.refreshToken);
        user.refreshTokens.push(tokens.refreshToken);
        yield user.save();
        res.status(200).send(Object.assign(Object.assign({}, tokens), { _id: user._id }));
    }
    catch (_a) {
        res.status(400).send("error");
    }
});
const authMiddleware = (req, res, next) => {
    const tokenHeader = req.headers["authorization"];
    const token = tokenHeader && tokenHeader.split(" ")[1];
    if (!token) {
        res.status(400).send("Access denied");
        return;
    }
    if (process.env.TOKEN_SECRET === undefined) {
        res.status(400).send("server error");
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(400).send("Access denied");
        }
        else {
            const userId = payload._id;
            req.params.userId = userId;
            next();
        }
    });
};
exports.authMiddleware = authMiddleware;
exports.default = {
    googleSignIn,
    register,
    login,
    refresh,
    logout,
    updateUser,
};
//# sourceMappingURL=auth.js.map