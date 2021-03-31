"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.sendToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (userId, tokenVersion) => jsonwebtoken_1.default.sign({ userId, tokenVersion }, process.env.COOKIE_SECRET, {
    expiresIn: "15d",
});
exports.createToken = createToken;
const sendToken = (res, token) => res.cookie(process.env.COOKIE_NAME, token, { httpOnly: true });
exports.sendToken = sendToken;
const verifyToken = (token) => jsonwebtoken_1.default.verify(token, process.env.COOKIE_SECRET);
exports.verifyToken = verifyToken;
//# sourceMappingURL=tokenHandler.js.map