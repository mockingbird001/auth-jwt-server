"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthenticate = exports.FBAuthenticate = void 0;
const User_1 = require("../entities/User");
const tokenHandler_1 = require("../utils/tokenHandler");
const FBAuthenticate = async (req, res) => {
    if (!req.userProfile)
        return;
    const { id, emails, displayName, provider } = req.userProfile;
    try {
        const user = await User_1.UserModel.findOne({ facebookId: id });
        let token;
        if (!user) {
            const newUser = await User_1.UserModel.create({
                username: displayName,
                email: (emails && emails[0].value) || provider,
                facebookId: id,
                password: provider,
            });
            await newUser.save();
            token = tokenHandler_1.createToken(newUser.id, newUser.tokenVersion);
            tokenHandler_1.sendToken(res, token);
            res.redirect("http://localhost:3000/dashboard");
        }
        else {
            token = tokenHandler_1.createToken(user.id, user.tokenVersion);
            tokenHandler_1.sendToken(res, token);
            res.redirect("http://localhost:3000/dashboard");
        }
    }
    catch (error) {
        res.redirect("http://localhost:3000");
    }
};
exports.FBAuthenticate = FBAuthenticate;
const GoogleAuthenticate = async (req, res) => {
    if (!req.userProfile)
        return;
    const { id, emails, displayName, provider } = req.userProfile;
    try {
        const user = await User_1.UserModel.findOne({ googleId: id });
        let token;
        if (!user) {
            const newUser = await User_1.UserModel.create({
                username: displayName,
                email: (emails && emails[0].value) || provider,
                googleId: id,
                password: provider,
            });
            await newUser.save();
            token = tokenHandler_1.createToken(newUser.id, newUser.tokenVersion);
            tokenHandler_1.sendToken(res, token);
            res.redirect("http://localhost:3000/dashboard");
        }
        else {
            token = tokenHandler_1.createToken(user.id, user.tokenVersion);
            tokenHandler_1.sendToken(res, token);
            res.redirect("http://localhost:3000/dashboard");
        }
    }
    catch (error) {
        res.redirect("http://localhost:3000");
    }
};
exports.GoogleAuthenticate = GoogleAuthenticate;
//# sourceMappingURL=socialMediaAuth.js.map