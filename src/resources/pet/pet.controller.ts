import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import authenticatedMiddleware from '@/middleware/authenticated.middleware';
import validate from '@/resources/pet/pet.validation';
import PetService from '@/resources/pet/pet.service';
import mongoose from 'mongoose';
import passport from 'passport';

class PetController implements Controller {
  public path = '/pets';
  public router = Router();
  private PetService = new PetService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      passport.authenticate('jwt', { session: false }),
      authenticatedMiddleware,
      validationMiddleware(validate.create),
      this.create
    );

    this.router.get(`${this.path}`, this.getPets);

    this.router.patch(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      authenticatedMiddleware,
      validationMiddleware(validate.update),
      this.update
    );

    this.router.delete(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      authenticatedMiddleware,
      this.delete
    );

    this.router.get(`${this.path}/:id`, this.getPet);
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, description, imgURL } = req.body;

      const pet = await this.PetService.create(name, description, imgURL);

      res.status(201).json({ pet });
    } catch (error) {
      next(new HttpException(400, 'Cannot create new pet'));
    }
  };

  private getPets = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const PetList = await this.PetService.getPets();

      res.status(200).json({ PetList });
    } catch (error) {
      next(new HttpException(404, 'Cannot fetch the pet list'));
    }
  };

  private getPet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const pet = await this.PetService.getPet(id);

      if (pet) res.status(200).json({ pet });
      else
        res.status(404).json({ message: `Cannot find the pet with id=${id}` });
    } catch (error) {
      next(new HttpException(404, 'Cannot fetch the pet pet information'));
    }
  };

  private update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const { name, description, imgURL } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No pets with id: ${id}`);

      await this.PetService.update(id, name, description, imgURL);

      res.status(200).json({ _id: id, name, description, imgURL });
    } catch (error) {
      next(new HttpException(400, 'Cannot update the pet'));
    }
  };

  private delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No pets with id: ${id}`);

      await this.PetService.delete(id);

      res
        .status(200)
        .json({ message: `Successfully delete the pet with id=${id}` });
    } catch (error) {
      next(new HttpException(400, 'Cannot update the pet'));
    }
  };
}

export default PetController;
