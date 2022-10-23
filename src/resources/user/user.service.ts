import UserModel from '@/resources/user/user.model';
import User from '@/resources/user/user.interface';
import bcrypt from 'bcrypt';
import { issueJWT } from '@/utils/token';
import Token from '@/utils/interfaces/token.interface';

class UserService {
  private user = UserModel;

  private async generatePasswordHash(
    password: string
  ): Promise<string | undefined> {
    try {
      if (password) {
        const passwordHash = bcrypt.hash(password, 10);
        return passwordHash;
      }
    } catch (error) {
      throw new Error('Unable to generate password hash');
    }
  }

  private async isValidPassword(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }
  /**
   *  Login
   */
  public async login(
    username: string,
    password: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    jwtToken: Token | null;
    user: User | null;
  }> {
    try {
      const user = await this.user.findOne({ username: username });

      if (!user) {
        // throw new Error('Unable to find user with that username');
        return {
          success: false,
          message: 'Unable to find user with that username',
          status: 404,
          jwtToken: null,
          user: null,
        };
      }

      if (await this.isValidPassword(password, user.password)) {
        return {
          success: true,
          message: 'Login successfully',
          status: 200,
          jwtToken: issueJWT(user),
          user,
        };
      } else {
        return {
          success: false,
          message: 'Wrong credentials given',
          status: 403,
          jwtToken: null,
          user: null,
        };
      }
    } catch (error) {
      throw new Error(`Unable to login`);
    }
  }

  /**
   *  register a new user
   */
  public async register(
    username: string,
    password: string,
    role: string
  ): Promise<User> {
    try {
      const passwordHash = await this.generatePasswordHash(password);

      const newUser = await this.user.create({
        username,
        password: passwordHash,
        role,
      });

      return newUser;
    } catch (error) {
      throw new Error('Unable to register new user');
    }
  }

  /**
   * Fetch user list
   */
  public async getUsers(): Promise<User[]> {
    try {
      const userList = this.user.find();

      return userList;
    } catch (error) {
      throw new Error('Unable to fetch the user list');
    }
  }
}

export default UserService;
