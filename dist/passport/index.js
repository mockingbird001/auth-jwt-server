"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportGoogle = exports.PassportFB = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_facebook_1 = require("passport-facebook");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, } = process.env;
const FBConfig = {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/auth/facebook/callback",
    passReqToCallback: true,
};
const PassportFB = () => passport_1.default.use(new passport_facebook_1.Strategy(FBConfig, (req, _, __, profile, done) => {
    try {
        if (profile) {
            const request = req;
            request.userProfile = profile;
            done(undefined, profile);
        }
    }
    catch (error) {
        done(error);
    }
}));
exports.PassportFB = PassportFB;
const GoogleConfig = {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
    passReqToCallback: true,
};
const PassportGoogle = () => passport_1.default.use(new passport_google_oauth20_1.Strategy(GoogleConfig, (req, _, __, profile, done) => {
    try {
        if (profile) {
            const request = req;
            request.userProfile = profile;
            done(undefined, profile);
        }
    }
    catch (error) {
        done(error);
    }
}));
exports.PassportGoogle = PassportGoogle;
//# sourceMappingURL=index.js.map