import jwt from 'jsonwebtoken';
import User from '@/resources/user/user.interface';
import Token from './interfaces/token.interface';

export const issueJWT = (user: User): Token => {
  const _id = user._id;
  const expiresIn = '1d';

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn,
  });

  return {
    token: 'Bearer ' + signedToken,
    expiresIn: expiresIn,
  };
};
