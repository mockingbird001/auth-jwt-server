import { Response } from "express";
import { AppRequest } from "../types";
import { UserModel, User } from "../entities/User";
import { createToken, sendToken } from "../utils/tokenHandler";

export const FBAuthenticate = async (req: AppRequest, res: Response) => {
  if (!req.userProfile) return;

  const { id, emails, displayName, provider } = req.userProfile;

  try {
    const user = await UserModel.findOne({ facebookId: id });
    let token: string;

    if (!user) {
      const newUser = await UserModel.create<
        Pick<User, "username" | "email" | "facebookId" | "password">
      >({
        username: displayName,
        email: (emails && emails[0].value) || provider,
        facebookId: id,
        password: provider,
      });

      await newUser.save();

      token = createToken(newUser.id, newUser.tokenVersion);

      sendToken(res, token);

      res.redirect("http://localhost:3000/dashboard");
    } else {
      token = createToken(user.id, user.tokenVersion);

      sendToken(res, token);

      res.redirect("http://localhost:3000/dashboard");
    }
  } catch (error) {
    res.redirect("http://localhost:3000");
  }
};
