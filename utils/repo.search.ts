import axios from 'axios';

export default class {
  static async search(repoName: string) {
    try {
      const url = `https://api.github.com/search/repositories?q=${repoName}`;
      const response = await axios.get(url);
      const { data } = response;
      return data;
    } catch (error) {
      return error;
    }
  }
}
