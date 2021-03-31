"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenHandler_1 = require("./utils/tokenHandler");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const AuthResolvers_1 = require("./resolvers/AuthResolvers");
const User_1 = require("./entities/User");
exports.default = async () => {
    const schema = await type_graphql_1.buildSchema({
        resolvers: [AuthResolvers_1.AuthResolvers],
        emitSchemaFile: { path: "./src/schema.graphql" },
        validate: false,
    });
    return new apollo_server_express_1.ApolloServer({
        schema,
        context: async ({ req, res }) => {
            const token = req.cookies[process.env.COOKIE_NAME];
            if (token) {
                try {
                    const decodedToken = tokenHandler_1.verifyToken(token);
                    if (decodedToken) {
                        req.userId = decodedToken.userId;
                        req.tokenVersion = decodedToken.tokenVersion;
                        if (Date.now() / 1000 - decodedToken.iat > 6 * 60 * 60) {
                            const user = await User_1.UserModel.findById(req.userId);
                            if (user) {
                                if (user.tokenVersion === req.tokenVersion) {
                                    user.tokenVersion = user.tokenVersion + 1;
                                    const updatedUser = await user.save();
                                    if (updatedUser) {
                                        const token = tokenHandler_1.createToken(updatedUser.id, updatedUser.tokenVersion);
                                        req.tokenVersion = updatedUser.tokenVersion;
                                        tokenHandler_1.sendToken(res, token);
                                    }
                                }
                            }
                        }
                    }
                }
                catch (error) {
                    req.userId = undefined;
                    req.tokenVersion = undefined;
                }
            }
            return { req, res };
        },
    });
};
//# sourceMappingURL=createServer.js.map