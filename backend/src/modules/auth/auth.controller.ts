import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import {
  registerSchema,
  loginSchema,
} from "./auth.validation";
import { sendResponse } from "../../utils/response";

export class AuthController {
  static async register(
    req: Request,
    res: Response
  ) {
    try {
      const data =
        registerSchema.parse(req.body);

      const result =
        await AuthService.register(
          data
        );

      return sendResponse(
        res,
        201,
        true,
        "Registration successful",
        result
      );
    } catch (error: any) {
      return sendResponse(
        res,
        400,
        false,
        error.message
      );
    }
  }

  static async login(
    req: Request,
    res: Response
  ) {
    try {
      const data =
        loginSchema.parse(req.body);

      const result =
        await AuthService.login(
          data
        );

      return sendResponse(
        res,
        200,
        true,
        "Login successful",
        result
      );
    } catch (error: any) {
      return sendResponse(
        res,
        400,
        false,
        error.message
      );
    }
  }
}