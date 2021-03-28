import { AppRequest } from "./../types/index";
import { UserModel } from "../entities/User";

export const isAuthenticated = async (req: AppRequest) => {
  if (!req.userId) throw new Error("Please login to proceed");

  const user = await UserModel.findById(req.userId);

  if (!user) throw new Error("Not authenticated.");

  if (req.tokenVersion !== user.tokenVersion)
    throw new Error("Not authenticated");

  return user;
};
