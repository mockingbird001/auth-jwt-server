import express from "express";
import monggoose from "mongoose";
import { config } from "dotenv";
import createServer from "./createServer";
import cookieParser from "cookie-parser";
config();

const { PORT, DB_USER, DB_PASSWORD, DB_ENDPOINT, DB_NAME } = process.env;

const startServer = async () => {
  try {
    await monggoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_ENDPOINT}/${DB_NAME}?retryWrites=true&w=majority`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );

    const app = express();
    app.use(cookieParser());

    const server = await createServer();

    server.applyMiddleware({ app });

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
