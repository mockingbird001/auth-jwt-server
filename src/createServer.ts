import { AppContext } from "./types/index";
import { createToken, sendToken, verifyToken } from "./utils/tokenHandler";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { AuthResolvers } from "./resolvers/AuthResolvers";
import { UserModel } from "./entities/User";

export default async () => {
  const schema = await buildSchema({
    resolvers: [AuthResolvers],
    emitSchemaFile: { path: "./src/schema.graphql" },
    validate: false,
  });

  return new ApolloServer({
    schema,
    context: async ({ req, res }: AppContext) => {
      const token = req.cookies[process.env.COOKIE_NAME!];

      if (token) {
        try {
          const decodedToken = verifyToken(token) as {
            userId: string;
            tokenVersion: number;
            iat: number;
            exp: number;
          } | null;

          if (decodedToken) {
            req.userId = decodedToken.userId;
            req.tokenVersion = decodedToken.tokenVersion;

            if (Date.now() / 1000 - decodedToken.iat > 6 * 60 * 60) {
              const user = await UserModel.findById(req.userId);

              if (user) {
                if (user.tokenVersion === req.tokenVersion) {
                  user.tokenVersion = user.tokenVersion + 1;
                  const updatedUser = await user.save();

                  if (updatedUser) {
                    const token = createToken(
                      updatedUser.id,
                      updatedUser.tokenVersion
                    );

                    req.tokenVersion = updatedUser.tokenVersion;

                    sendToken(res, token);
                  }
                }
              }
            }
          }
        } catch (error) {
          req.userId = undefined;
          req.tokenVersion = undefined;
        }
      }
      return { req, res };
    },
  });
};
