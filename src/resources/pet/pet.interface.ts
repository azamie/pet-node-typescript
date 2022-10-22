import { Document } from 'mongoose';

export default interface Pet extends Document {
  name: string;
  description: string;
  imgURL: string;
}
