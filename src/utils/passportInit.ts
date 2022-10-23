import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback,
} from 'passport-jwt';

import UserModel from '@/resources/user/user.model';

function verifyJWTCallBack(payload: any, done: VerifiedCallback): void {
  console.log('verifyJWTCallBack');
  UserModel.findOne({ _id: payload.sub })
    .then((user) => {
      if (user) return done(null, user);

      return done(null, false);
    })
    .catch((err) => done(err, undefined));
}

function passportConfigInitialize(): JwtStrategy {
  let secretOrKey: Buffer;

  if (process.env.JWT_SECRET) {
    secretOrKey = Buffer.from(process.env.JWT_SECRET);
  } else {
    throw new Error('You need to provide JWT secret key');
  }

  const options: StrategyOptions = {
    
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretOrKey,
  };
  
  return new JwtStrategy(options, verifyJWTCallBack);
}

export default passportConfigInitialize;
