import { UserModel } from "../entities/User";

export const isAuthenticated = async (
  userId: string,
  tokenVersion?: number
) => {
  const user = await UserModel.findById(userId);

  if (!user) throw new Error("Not authenticated.");

  if (tokenVersion !== user.tokenVersion) throw new Error("Not authenticated");

  return user;
};
