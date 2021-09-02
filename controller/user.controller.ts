import { Request, Response, NextFunction } from 'express';
import userModel from '../model/user.model';
import userUtil from '../utils/user.search';

export default class {
  static async userSearch(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('UserSearch called with', req.body.username);
      const userName: string = req.body.username;
      if (!userName) {
        res.send({ status: 403, message: 'Invalid username' });
      } else {
        const userData = await userModel.findOne({ login: `${userName}` });
        if (userData !== null) {
          res.send({ status: 200, message: 'Success', data: userData });
        } else {
          let response: any;
          response = await userUtil.userSearch(userName);
          if (response.data) {
            const responseData = await userModel.create(response.data);
            res.send({ status: 200, message: 'Success', data: responseData });
          } else {
            res.send({ status: 404, message: 'No User Found' });
          }
        }
      }
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}
