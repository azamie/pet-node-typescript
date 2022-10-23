import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import User from '@/resources/user/user.interface';

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<User>('User', UserSchema);
