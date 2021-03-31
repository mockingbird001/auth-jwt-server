"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const User_1 = require("../entities/User");
const isAuthenticated = async (req) => {
    if (!req.userId)
        throw new Error("Please login to proceed");
    const user = await User_1.UserModel.findById(req.userId);
    if (!user)
        throw new Error("Not authenticated.");
    if (req.tokenVersion !== user.tokenVersion)
        throw new Error("Not authenticated");
    return user;
};
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=authHandler.js.map