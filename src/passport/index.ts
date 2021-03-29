import passport from "passport";
import {
  Strategy as FBStrategy,
  StrategyOptionWithRequest as FBStrategyOptionWithRequest,
} from "passport-facebook";
import {
  Strategy as GoogleStrategy,
  StrategyOptionsWithRequest as GoogleStrategyWithRequest,
} from "passport-google-oauth20";
import { AppRequest } from "../types";

const {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;

const FBConfig: FBStrategyOptionWithRequest = {
  clientID: FACEBOOK_APP_ID!,
  clientSecret: FACEBOOK_APP_SECRET!,
  callbackURL: "http://localhost:5000/auth/facebook/callback",
  passReqToCallback: true,
};

export const PassportFB = () =>
  passport.use(
    new FBStrategy(FBConfig, (req, _, __, profile, done) => {
      try {
        if (profile) {
          const request = req as AppRequest;
          request.userProfile = profile;
          done(undefined, profile);
        }
      } catch (error) {
        done(error);
      }
    })
  );

const GoogleConfig: GoogleStrategyWithRequest = {
  clientID: GOOGLE_CLIENT_ID!,
  clientSecret: GOOGLE_CLIENT_SECRET!,
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true,
};

export const PassportGoogle = () =>
  passport.use(
    new GoogleStrategy(GoogleConfig, (req, _, __, profile, done) => {
      try {
        if (profile) {
          const request = req as AppRequest;
          request.userProfile = profile;
          done(undefined, profile);
        }
      } catch (error) {
        done(error);
      }
    })
  );
