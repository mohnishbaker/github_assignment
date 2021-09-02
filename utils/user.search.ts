import axios from 'axios';

export default class {
  static async userSearch(userName: string) {
    try {
      const url = `https://api.github.com/users/${userName}`;
      const response = await axios.get(url);
      return response;
    } catch (error) {
      return error;
    }
  }
}
