import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import { issueJWT } from '@/utils/token';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private UserService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );

    this.router.post(
      `${this.path}/register`,
      validationMiddleware(validate.register),
      this.register
    );

    this.router.get(`${this.path}`, this.getUsers);
  }

  private getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userList = await this.UserService.getUsers();

      res.status(200).json({ userList });
    } catch (error) {
      next(new HttpException(400, 'Cannot not fetch the user list'));
    }
  };

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { username, password } = req.body;

      const { success, status, message, jwtToken, user } =
        await this.UserService.login(username, password);

      if (success) {
        res.status(status).json({ success, jwtToken, user });
      } else {
        res.status(status).json({ success, message });
      }
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { username, password, role } = req.body;

      const user = await this.UserService.register(username, password, role);

      const jwt = issueJWT(user);

      res
        .status(201)
        .json({ user, token: jwt.token, expiresIn: jwt.expiresIn });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default UserController;
