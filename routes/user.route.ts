import express from "express";
import userController from "../controller/user.controller";

const router = express.Router();

router.post("/userSearch", userController.userSearch);
router.post("/signUp", userController.signUp);
router.post("/signIn", userController.signIn);
router.post("/addToFavourite", userController.addToFavourite);
router.post("/removeFromFavourite", userController.removeFromFavourite);
router.post("/viewUser", userController.viewUser);
export { router as userRoute };
