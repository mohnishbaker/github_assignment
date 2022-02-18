import { Request, Response, NextFunction } from "express";
import userModel from "../model/user.model";
import userUtil from "../utils/user.search";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import { verify } from "crypto";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
export default class {
  static async userSearch(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("UserSearch called with", req.body.username);
      const userName: string = req.body.username;
      if (!userName) {
        res.send({ status: 403, message: "Invalid username" });
      } else {
        const userData = await userModel.findOne({ login: `${userName}` });
        if (userData !== null) {
          res.send({
            status: 200,
            message: "Success",
            data: userData,
          });
        } else {
          let response: any;
          response = await userUtil.userSearch(userName);
          if (response.data) {
            const responseData = await userModel.create(response.data);
            res.send({ status: 200, message: "Success", data: responseData });
          } else {
            res.send({ status: 404, message: "No User Found" });
          }
        }
      }
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
  static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("signUp called with", req.body.email);
      let { email, name, password } = req.body;
      password = await bcrypt.hash(password, 10);
      const saveResult = await userModel.create({
        email,
        name,
        password,
      });
      if (saveResult) {
        return res.send({ status: 200, message: "Success", data: saveResult });
      } else {
        return res.send({
          status: 500,
          message: "Failed",
        });
      }
    } catch (error: any) {
      console.log("Error - ", error);
      if (error.code == "11000") {
        return res.send({ status: 400, message: "Username already exists" });
      } else {
        return res.send({ status: 500, message: error.message });
      }
    }
  }
  static async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userData: any = await userModel.find({ email }).lean();
      if (!userData) {
        return res.send({ status: 400, message: "Invalid username" });
      }
      if (await bcrypt.compare(password, userData[0].password)) {
        const token = jwt.sign({ email, password }, JWT_SECRET as string);
        const userData = await userModel.findOne({ email: email });
        return res.send({
          status: 200,
          message: "Successful",
          token: token,
          userData,
        });
      }
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
  static async addToFavourite(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("addToFavourite called");
      const {
        objectId,
        token,
        id,
        name,
        description,
        url,
        privateRepo,
        favourite,
      } = req.body;
      const verfiyJWT: any = await jwt.verify(token, JWT_SECRET as string);
      if (verfiyJWT.iat) {
        const favArray = [
          {
            id,
            name,
            description,
            url,
            privateRepo,
            favourite,
          },
        ];
        const updateResult = await userModel.updateOne(
          { _id: objectId },
          {
            $push: {
              favouriteRepo: favArray,
            },
          }
        );
        return res.send({ status: 200, message: "Success", data: verfiyJWT });
      } else {
        return res.send({
          status: 200,
          message: "Cannot verify token",
          data: verfiyJWT,
        });
      }
    } catch (error: any) {
      console.log("Error - ", error);
      if ((error.message = "invalid token")) {
        return res.send({
          status: 500,
          message: error.message,
        });
      } else {
        return next(error);
      }
    }
  }
  static async removeFromFavourite(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { token, id, objectId } = req.body;
      const verfiyJWT: any = jwt.verify(token, JWT_SECRET as string);
      if (verfiyJWT.iat) {
        const deleteResult = await userModel.updateOne(
          { _id: objectId },
          { $pull: { favouriteRepo: { id: id } } }
        );
        if (deleteResult) {
          return res.send({
            status: 200,
            message: "Repo removed",
            data: deleteResult,
          });
        } else {
          return res.send({ status: 500, message: "Cannot remove repo" });
        }
      } else {
        return res.send({
          status: 500,
          message: "Cannot verify token",
          data: verfiyJWT,
        });
      }
    } catch (error) {
      console.log("Error - ", error);
      return next(error);
    }
  }
  static async viewUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const userData = await userModel.findOne({ email: email });
      if (userData) {
        return res.send({
          status: 200,
          message: "Successful",
          userData,
        });
      } else {
        return res.send({ status: 500, message: "No user found" });
      }
    } catch (error) {
      console.log("Error - ", error);
      return next(error);
    }
  }
}
