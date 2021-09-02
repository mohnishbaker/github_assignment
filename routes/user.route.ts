import express from 'express';
import userController from '../controller/user.controller';

const router = express.Router();

router.post('/userSearch', userController.userSearch);

export { router as userRoute };
