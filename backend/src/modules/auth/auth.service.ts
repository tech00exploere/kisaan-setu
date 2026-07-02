import bcrypt from "bcrypt";
import { User } from "../../models/User";
import {
  RegisterInput,
  LoginInput,
} from "./auth.interface";
import { generateToken } from "../../utils/jwt";

export class AuthService {
  static async register(
    payload: RegisterInput
  ) {
    const existingUser =
      await User.findOne({
        email: payload.email,
      });

    if (existingUser) {
      throw new Error(
        "User already exists"
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        payload.password,
        10
      );

    const user = await User.create({
      ...payload,
      password: hashedPassword,
    });

    const token = generateToken(
      user._id.toString(),
      user.role
    );

    return {
      user,
      token,
    };
  }

  static async login(
    payload: LoginInput
  ) {
    const user =
      await User.findOne({
        email: payload.email,
      });

    if (!user) {
      throw new Error(
        "Invalid credentials"
      );
    }

    const isMatch =
      await bcrypt.compare(
        payload.password,
        user.password
      );

    if (!isMatch) {
      throw new Error(
        "Invalid credentials"
      );
    }

    const token = generateToken(
      user._id.toString(),
      user.role
    );

    return {
      user,
      token,
    };
  }
}