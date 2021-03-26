import express from "express";

const startServer = () => {
  const app = express();

  app.listen({ port: 5000 }, () => {
    console.log(`Server is ready at http://localhost:5000`);
  });
};

startServer();
