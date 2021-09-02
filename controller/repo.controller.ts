import { Request, Response } from 'express';
import repoUtil from '../utils/repo.search';

export default class {
  static async repoSearch(req: Request, res: Response) {
    try {
      console.log('RepoSearch called with', req.body.repo_name);
      if (!req.body.repo_name) {
        res.send({
          status: 403,
          message: 'Please provide a valid repository name',
        });
      } else {
        const repoName: any = req.body.repo_name;
        const searchData = await repoUtil.search(repoName);
        if (searchData.total_count === 0) {
          res.send({ status: 404, message: 'No such repository' });
        } else {
          const data: object[] = [];
          const responseOutput = {
            data,
          };
          searchData.items.forEach((element: any) => {
            const newResponse = {
              repo_name: element.name,
              owner_name: element.owner.login,
              description: element.description,
              stars_count: element.stargazers_count,
              html_url: element.html_url,
            };
            responseOutput.data.push(newResponse);
          });
          res.send({ status: 200, message: 'Success', data: responseOutput });
        }
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
