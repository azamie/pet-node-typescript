import { Request, Response, NextFunction } from 'express';

function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log('authenticatedMiddleware', req.user);
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ status: 401, message: 'You are not authorized' });
  }
}

export default authenticatedMiddleware;
