import { config } from "dotenv";
config();
import express from "express";
import monggoose from "mongoose";
import createServer from "./createServer";
import cookieParser from "cookie-parser";
import passport from "passport";
import { PassportFB, PassportGoogle } from "./passport";
import { FBAuthenticate, GoogleAuthenticate } from "./passport/socialMediaAuth";

const { PORT, DB_USER, DB_PASSWORD, DB_ENDPOINT, DB_NAME } = process.env;

PassportFB();
PassportGoogle();

const startServer = async () => {
  try {
    await monggoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_ENDPOINT}${DB_NAME}?retryWrites=true&w=majority`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );

    const app = express();
    app.use(cookieParser());

    app.get("/auth/facebook", passport.authenticate("facebook"));

    app.get(
      "/auth/facebook/callback",
      passport.authenticate("facebook", {
        session: false,
        failureRedirect: "http://localhost:3000",
        scope: ["profile", "email"],
      }),
      FBAuthenticate
    );

    app.get(
      "/auth/google",
      passport.authenticate("google", {
        scope: ["profile", "email"],
      })
    );

    app.get(
      "/auth/google/callback",
      passport.authenticate("google", {
        session: false,
        failureRedirect: "http://localhost:3000",
      }),
      GoogleAuthenticate
    );

    const server = await createServer();

    server.applyMiddleware({
      app,
      cors: { origin: "http://localhost:3000", credentials: true },
    });

    app.listen({ port: PORT }, () => {
      console.log(
        `Server is ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
