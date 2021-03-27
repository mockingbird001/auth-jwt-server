import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";
import { User, UserModel } from "../entities/User";
import {
  validateUsername,
  validateEmail,
  validatePassword,
} from "../utils/validate";
import { createToken, sendToken } from "../utils/tokenHandler";
import { AppContext } from "../types";

@Resolver()
export class AuthResolvers {
  @Query(() => [User], { nullable: "items" })
  async users(): Promise<User[] | null> {
    try {
      return UserModel.find();
    } catch (error) {
      throw error;
    }
  }

  @Query(() => User, { nullable: true })
  async me(@Arg("userId") userId: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(userId);

      if (!user) throw new Error("User nor found.");

      return user;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => User, { nullable: true })
  async signup(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: AppContext
  ): Promise<User | null> {
    try {
      if (!username) throw new Error("Username is required.");
      if (!email) throw new Error("Email is required.");
      if (!password) throw new Error("Password is required.");

      const user = await UserModel.findOne({ email });

      if (user) throw Error("Email already in use, please sign in instead.");

      const isUsernameValid = validateUsername(username);

      if (!isUsernameValid)
        throw new Error("Username must be between 3 - 60 characters.");

      const isEmailValid = validateEmail(email);

      if (!isEmailValid) throw new Error("Email is invalid.");

      const isPasswordValid = validatePassword(password);

      if (!isPasswordValid)
        throw new Error("Password must be between 6 - 50 characters.");

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      const token = createToken(newUser.id, newUser.tokenVersion);

      sendToken(res, token);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => User, { nullable: true })
  async signin(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: AppContext
  ): Promise<User | null> {
    try {
      if (!email) throw new Error("Email is required.");
      if (!password) throw new Error("Password is required.");

      const user = await UserModel.findOne({ email });

      if (!user) throw Error("Email not found.");

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) throw new Error("Email or Password is valid.");

      const token = createToken(user.id, user.tokenVersion);

      sendToken(res, token);

      return user;
    } catch (error) {
      throw error;
    }
  }
}
